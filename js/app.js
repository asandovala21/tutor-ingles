import { askJSON, MODELS, TutorError } from './claude.js';
import { CHARACTERS, SCENARIOS, GRAMMAR_TOPICS, PRON_SETS, PHRASE_GROUPS, MAX_SESSIONS, characterById, topicById } from './curriculum.js';
import {
  meetingSystem, learnerTurnText, MEETING_SCHEMA,
  lessonSystem, lessonRequest, LESSON_SCHEMA, gradeRequest, GRADE_SCHEMA,
  pronSystem, PRON_FEEDBACK_SCHEMA, PRON_SENTENCES_SCHEMA,
} from './prompts.js';
import {
  settings, progress, saveSettings, saveProgress, resetProgress, logErrors, markIntroduced, recordModuleSession,
  listTranscripts, saveTranscript, deleteTranscript, exportAll, importAll,
} from './store.js';
import { pdfToText } from './pdf.js';
import { speak, stopSpeaking, listen, canListen, avatarSVG, animateMouth, compareWords, englishVoices, hasVoiceFor } from './speech.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');

// ---------------- utilidades ----------------

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Markdown mínimo: **negrita**, viñetas "- " y párrafos. */
function md(s = '') {
  const lines = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('- ') || t.startsWith('• ')) {
      if (!inList) html += '<ul>';
      inList = true;
      html += `<li>${t.slice(2)}</li>`;
    } else {
      if (inList) html += '</ul>';
      inList = false;
      if (t) html += `<p>${t}</p>`;
    }
  }
  return html + (inList ? '</ul>' : '');
}

let toastTimer;
function toast(msg, ms = 3500) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

function showError(err) {
  console.error(err);
  toast(err instanceof TutorError ? err.message : `Error: ${err.message || err}`, 6000);
}

function usd(n) {
  return n < 0.01 ? `${(n * 100).toFixed(2)}¢` : `US$${n.toFixed(2)}`;
}

/** Ajusta la altura de un textarea a su contenido. */
function autoGrow(el) {
  if (el.tagName !== 'TEXTAREA') return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}

/**
 * Botón de micrófono que escribe en un input. El texto queda en la caja para
 * revisarlo o corregirlo; no se envía solo. Si ya había texto, lo nuevo se agrega al final.
 */
function attachMic(button, input, { onDone } = {}) {
  if (!canListen) {
    button.disabled = true;
    button.title = 'Reconocimiento de voz no disponible en este navegador';
    return;
  }
  let busy = false;
  button.addEventListener('click', async () => {
    if (busy) {
      listen.stop?.();
      return;
    }
    busy = true;
    stopSpeaking();
    button.classList.add('recording');
    const label = button.textContent;
    const placeholder = input.placeholder;
    const base = input.value.trim();
    const prevStt = input.dataset.stt ? JSON.parse(input.dataset.stt) : null;
    const show = (t) => {
      input.value = [base, t].filter(Boolean).join(' ');
      autoGrow(input);
    };
    button.textContent = '⏹️';
    input.placeholder = 'Escuchando… habla con calma. Toca ⏹️ cuando termines.';
    toast('🎤 Escuchando. Puedes hacer pausas: toca ⏹️ cuando termines.', 4000);
    try {
      const res = await listen({ onInterim: show });
      show(res.text);
      const stt = { ...res, text: input.value };
      if (prevStt || base) {
        stt.alternatives = [input.value];
        if (prevStt?.confidence && res.confidence) stt.confidence = (prevStt.confidence + res.confidence) / 2;
        if (base && !prevStt) stt.edited = true;
      }
      input.dataset.stt = JSON.stringify(stt);
      if (res.text) toast('Revisa el texto, corrígelo si quieres y toca ➤ para enviar. 🎤 agrega más.', 4000);
      onDone?.(stt);
    } catch (e) {
      showError(e);
    } finally {
      busy = false;
      button.classList.remove('recording');
      button.textContent = label;
      input.placeholder = placeholder;
    }
  });
  input.addEventListener('input', () => {
    autoGrow(input);
    if (input.dataset.stt) {
      const stt = JSON.parse(input.dataset.stt);
      stt.edited = true;
      input.dataset.stt = JSON.stringify(stt);
    }
  });
}

function speakBtn(text, lang = 'en-AU', pitch = 1) {
  const b = document.createElement('button');
  b.className = 'mini-btn';
  b.textContent = '🔊';
  b.setAttribute('aria-label', 'Escuchar');
  b.addEventListener('click', () => speak(text, { lang, pitch }));
  return b;
}

// ---------------- pestañas ----------------

const tabs = { meeting: renderMeeting, grammar: renderGrammar, pron: renderPron, progress: renderProgress };

function go(tab) {
  stopSpeaking();
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  view.innerHTML = '';
  view.scrollTop = 0;
  tabs[tab]();
}

document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => go(b.dataset.tab)));

// ================= REUNIÓN =================

const meeting = { active: false, history: [], character: null, config: null };

async function renderMeeting() {
  if (meeting.active) return renderMeetingLive();
  const transcripts = await listTranscripts();
  view.innerHTML = `
    <section class="card">
      <h2>Simular una reunión</h2>
      <p class="muted">Elige con quién hablas. El personaje te habla en voz alta, tú respondes por micrófono y después de cada intervención te corrijo y te enseño gramática nueva.</p>
      <div class="char-grid">
        ${CHARACTERS.map((c) => `
          <button class="char ${c.id === settings.character ? 'selected' : ''}" data-id="${c.id}">
            <div class="char-face">${avatarSVG(c)}</div>
            <strong>${c.name}</strong>
            <small>${c.lang === 'en-AU' ? '🇦🇺 Australiano' : '🇮🇳🇦🇺 Indio-australiano'}${hasVoiceFor(c.lang) ? '' : ' ⚠️ sin voz instalada'}</small>
          </button>`).join('')}
      </div>
    </section>

    <section class="card">
      <div class="seg">
        <label><input type="radio" name="mode" value="scenario" checked /> Escenario</label>
        <label><input type="radio" name="mode" value="transcript" ${transcripts.length ? '' : 'disabled'} /> Desde transcripción</label>
      </div>
      <div id="mode-scenario">
        <label>Escenario
          <select id="scenario">${SCENARIOS.map((s) => `<option value="${s.id}">${esc(s.title)}</option>`).join('')}</select>
        </label>
        <p id="scenario-desc" class="muted"></p>
      </div>
      <div id="mode-transcript" hidden>
        <label>Transcripción
          <select id="transcript">${transcripts.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}</select>
        </label>
      </div>
      <label>Foco gramatical (opcional)
        <select id="focus">
          <option value="">Libre: el tutor elige qué enseñarte</option>
          ${GRAMMAR_TOPICS.map((t) => `<option value="${t.id}">${esc(t.title)}</option>`).join('')}
        </select>
      </label>
      <button id="start" class="primary big">▶️ Empezar reunión</button>
    </section>

    <section class="card">
      <h2>Mis transcripciones (${transcripts.length})</h2>
      <p class="muted">Sube tus transcripciones de reuniones (PDF, .txt, .vtt) o pégalas. Los PDF se convierten a texto en el teléfono, así gastas menos créditos. Se guardan en el teléfono y se envían a Claude solo cuando simulas esa reunión.</p>
      <ul class="list">
        ${transcripts.map((t) => `<li><span>${esc(t.name)} <small class="muted">${Math.round(t.text.length / 1000)}k car.</small></span><span><button class="mini-btn" data-view="${t.id}" aria-label="Ver texto">👁️</button><button class="mini-btn danger" data-del="${t.id}">🗑️</button></span></li><li class="t-preview" id="pv-${t.id}" hidden><pre>${esc(t.text.slice(0, 3000))}${t.text.length > 3000 ? '\n…' : ''}</pre></li>`).join('') || '<li class="muted">Aún no hay transcripciones.</li>'}
      </ul>
      <label class="file-btn secondary">📄 Subir archivos<input id="t-files" type="file" accept=".pdf,.txt,.vtt,.srt,.md,application/pdf,text/plain" multiple hidden /></label>
      <details>
        <summary>Pegar texto</summary>
        <input id="t-name" type="text" placeholder="Nombre (p. ej. Weekly Ops 12-Sep)" />
        <textarea id="t-text" rows="6" placeholder="Pega aquí la transcripción…"></textarea>
        <button id="t-save" class="secondary">Guardar transcripción</button>
      </details>
    </section>`;

  const desc = () => ($('#scenario-desc').textContent = SCENARIOS.find((s) => s.id === $('#scenario').value).desc);
  desc();
  $('#scenario').addEventListener('change', desc);

  view.querySelectorAll('.char').forEach((b) =>
    b.addEventListener('click', () => {
      settings.character = b.dataset.id;
      saveSettings();
      view.querySelectorAll('.char').forEach((x) => x.classList.toggle('selected', x === b));
      const c = characterById(b.dataset.id);
      speak(`Hi, I'm ${c.name}. ${c.lang === 'en-AU' ? "G'day! Ready for the meeting?" : 'Hello, shall we get started?'}`, { lang: c.lang, pitch: c.pitch });
    }),
  );

  view.querySelectorAll('input[name=mode]').forEach((r) =>
    r.addEventListener('change', () => {
      const t = view.querySelector('input[name=mode]:checked').value === 'transcript';
      $('#mode-transcript').hidden = !t;
      $('#mode-scenario').hidden = t;
    }),
  );

  $('#t-files').addEventListener('change', async (e) => {
    let saved = 0;
    for (const f of e.target.files) {
      const name = f.name.replace(/\.[^.]+$/, '');
      try {
        let text;
        if (/\.pdf$/i.test(f.name) || f.type === 'application/pdf') {
          ({ text } = await pdfToText(f, (i, n) => toast(`Convirtiendo ${name}: página ${i}/${n}…`, 60000)));
          if (text.length < 50) {
            toast(`"${name}" parece un PDF escaneado (imagen): no tiene texto que extraer.`, 7000);
            continue;
          }
        } else {
          text = await f.text();
        }
        await saveTranscript(name, text);
        saved++;
      } catch (err) {
        showError(new TutorError(`No se pudo leer "${name}": ${err.message}`));
      }
    }
    if (saved) toast(`${saved} transcripción(es) guardada(s)`);
    renderMeeting();
  });
  $('#t-save').addEventListener('click', async () => {
    const text = $('#t-text').value.trim();
    if (!text) return toast('Pega el texto primero');
    await saveTranscript($('#t-name').value.trim() || `Reunión ${new Date().toLocaleDateString()}`, text);
    renderMeeting();
  });
  view.querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => {
      const pv = $(`#pv-${b.dataset.view}`);
      pv.hidden = !pv.hidden;
    }),
  );
  view.querySelectorAll('[data-del]').forEach((b) =>
    b.addEventListener('click', async () => {
      if (!confirm('¿Borrar esta transcripción?')) return;
      await deleteTranscript(b.dataset.del);
      renderMeeting();
    }),
  );

  $('#start').addEventListener('click', async () => {
    const mode = view.querySelector('input[name=mode]:checked').value;
    let transcript = null;
    let scenario = SCENARIOS.find((s) => s.id === $('#scenario').value);
    if (mode === 'transcript') {
      transcript = transcripts.find((t) => t.id === $('#transcript').value);
      if (transcript.text.length > 400000 && !confirm('La transcripción es muy larga (más de ~100 mil tokens): cada turno costará más. ¿Continuar?')) return;
      scenario = { title: transcript.name, desc: 'Based on transcript' };
    }
    meeting.character = characterById(settings.character);
    meeting.config = { scenario, transcript: transcript?.text || null, focusTopic: $('#focus').value || null, myName: settings.myName };
    meeting.history = [];
    meeting.log = [];
    meeting.active = true;
    renderMeetingLive();
    await meetingTurn('[START]', null);
  });
}

function renderMeetingLive() {
  const c = meeting.character;
  view.innerHTML = `
    <section class="stage">
      <div class="avatar" id="avatar">${avatarSVG(c)}</div>
      <div class="stage-info">
        <strong id="speaker">${c.name}</strong>
        <small class="muted">${esc(c.role.split(". ")[0])}</small>
        <small class="muted">${esc(meeting.config.scenario.title)}</small>
      </div>
      <div class="stage-actions">
        <button id="replay" class="mini-btn" title="Repetir">🔁</button>
        <button id="slow" class="mini-btn" title="Más lento">🐢</button>
        <button id="end" class="mini-btn danger" title="Terminar reunión">⏹️</button>
      </div>
    </section>
    <div id="chat" class="chat"></div>
    <div class="composer">
      <button id="mic" class="mic" aria-label="Hablar">🎤</button>
      <textarea id="msg" rows="1" placeholder="Toca 🎤 para hablar o escribe aquí"></textarea>
      <button id="send" class="primary" aria-label="Enviar">➤</button>
    </div>`;

  for (const entry of meeting.log) appendEntry(entry);

  const mouth = animateMouth($('#avatar'));
  meeting.say = (text) =>
    speak(text, { lang: c.lang, pitch: c.pitch, onStart: mouth.start, onEnd: mouth.stop, onWord: mouth.word });

  $('#replay').addEventListener('click', () => meeting.lastReply && meeting.say(meeting.lastReply));
  $('#slow').addEventListener('click', () =>
    meeting.lastReply && speak(meeting.lastReply, { lang: c.lang, pitch: c.pitch, rate: 0.7, onStart: mouth.start, onEnd: mouth.stop, onWord: mouth.word }),
  );
  $('#end').addEventListener('click', async () => {
    if (!confirm('¿Terminar la reunión y ver el resumen?')) return;
    await meetingTurn('[END]', null);
    meeting.active = false;
    $('.composer')?.remove();
    const back = document.createElement('button');
    back.className = 'primary big';
    back.textContent = 'Nueva reunión';
    back.addEventListener('click', () => go('meeting'));
    $('#chat').append(back);
  });

  const input = $('#msg');
  const send = () => {
    const text = input.value.trim();
    if (!text) return;
    const stt = input.dataset.stt ? JSON.parse(input.dataset.stt) : null;
    input.value = '';
    delete input.dataset.stt;
    autoGrow(input);
    meetingTurn(text, stt);
  };
  $('#send').addEventListener('click', send);
  attachMic($('#mic'), input);
}

function appendEntry(entry) {
  const chat = $('#chat');
  if (!chat) return;
  const el = document.createElement('div');
  if (entry.kind === 'me') {
    el.className = 'bubble me';
    el.innerHTML = `<p>${esc(entry.text)}</p>`;
  } else if (entry.kind === 'them') {
    el.className = `bubble them ${settings.hideReplyText ? 'hidden-text' : ''}`;
    el.innerHTML = `<small>${esc(entry.speaker)}</small><p>${esc(entry.text)}</p>`;
    el.addEventListener('click', () => el.classList.remove('hidden-text'));
    el.append(speakBtn(entry.text, meeting.character.lang, meeting.character.pitch));
  } else if (entry.kind === 'feedback') {
    el.className = 'feedback';
    el.innerHTML = feedbackHTML(entry.fb);
    el.querySelectorAll('[data-say]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.say, { lang: 'en-AU' })));
  } else if (entry.kind === 'thinking') {
    el.className = 'bubble them thinking';
    el.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
  }
  chat.append(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return el;
}

function feedbackHTML(fb) {
  const parts = [];
  if (fb.overall_es) parts.push(`<div class="fb-overall">${md(fb.overall_es)}</div>`);
  if (fb.corrected) parts.push(`<div class="fb-row"><b>✅ Corregido:</b> ${esc(fb.corrected)} <button class="mini-btn" data-say="${esc(fb.corrected)}">🔊</button></div>`);
  if (fb.better_native) parts.push(`<div class="fb-row"><b>💬 Más natural:</b> ${esc(fb.better_native)} <button class="mini-btn" data-say="${esc(fb.better_native)}">🔊</button></div>`);
  if (fb.errors?.length)
    parts.push(`<ul class="fb-errors">${fb.errors.map((e) => `<li><s>${esc(e.original)}</s> → <b>${esc(e.correction)}</b><br><small>${esc(e.explanation_es)}</small></li>`).join('')}</ul>`);
  if (fb.new_grammar?.topic_id)
    parts.push(`<div class="fb-new"><b>🆕 Gramática nueva: ${esc(fb.new_grammar.title)}</b>${md(fb.new_grammar.explanation_es)}<ul>${fb.new_grammar.examples.map((x) => `<li>${esc(x)} <button class="mini-btn" data-say="${esc(x)}">🔊</button></li>`).join('')}</ul></div>`);
  if (fb.pronunciation?.length)
    parts.push(`<div class="fb-pron"><b>🎙️ Pronunciación</b><ul>${fb.pronunciation.map((p) => `<li><b>${esc(p.word)}</b> <button class="mini-btn" data-say="${esc(p.word)}">🔊</button> ${esc(p.tip_es)}</li>`).join('')}</ul></div>`);
  return parts.join('') || '<div class="fb-overall">👍 ¡Perfecto!</div>';
}

async function meetingTurn(text, stt) {
  const isControl = text === '[START]' || text === '[END]';
  if (!isControl) {
    const entry = { kind: 'me', text };
    meeting.log.push(entry);
    appendEntry(entry);
  }
  const content = isControl ? text : learnerTurnText(text, stt);
  const messages = [...meeting.history, { role: 'user', content }];
  const thinking = appendEntry({ kind: 'thinking' });
  $('#send') && ($('#send').disabled = true);
  try {
    const { data, assistantContent } = await askJSON({
      system: meetingSystem({ character: meeting.character, ...meeting.config }),
      messages,
      schema: MEETING_SCHEMA,
      effort: 'low',
    });
    // Historial append-only: se guarda el turno del asistente tal como llegó.
    meeting.history = [...messages, { role: 'assistant', content: assistantContent }];
    thinking?.remove();

    const fb = data.feedback;
    const hasFeedback = fb && (fb.overall_es || fb.corrected || fb.errors?.length || fb.new_grammar?.topic_id || fb.pronunciation?.length);
    if (!isControl || text === '[END]') {
      if (hasFeedback) {
        const entry = { kind: 'feedback', fb };
        meeting.log.push(entry);
        appendEntry(entry);
      }
      if (fb?.errors?.length) logErrors(fb.errors);
      if (fb?.new_grammar?.topic_id) markIntroduced(fb.new_grammar.topic_id);
    }
    const reply = { kind: 'them', speaker: data.speaker || meeting.character.name, text: data.reply };
    meeting.log.push(reply);
    appendEntry(reply);
    $('#speaker') && ($('#speaker').textContent = reply.speaker);
    meeting.lastReply = data.reply;
    meeting.say?.(data.reply);
  } catch (e) {
    thinking?.remove();
    showError(e);
  } finally {
    $('#send') && ($('#send').disabled = false);
  }
}

// ================= GRAMÁTICA =================

const lesson = { topic: null, n: 0, data: null, history: [] };

function renderGrammar() {
  const levelName = { 1: 'Prioridad 1 · lo más usado en tus reuniones', 2: 'Prioridad 2 · frecuente', 3: 'Avanzado' };
  view.innerHTML = `
    <section class="card">
      <h2>Módulos de gramática</h2>
      <p class="muted">Cada tema tiene hasta ${MAX_SESSIONS} sesiones: 1) explicación, 2) práctica, 3) traducción, 4) hablar, 5) evaluación. El orden y los ejemplos salen de tus reuniones reales. ⭐ = aparece mucho en tus reuniones.</p>
      <button id="phrases" class="secondary big">💬 Frases de reunión para escuchar y repetir</button>
    </section>
    ${[1, 2, 3].map((lvl) => `
      <section class="card">
        <h3>${levelName[lvl]}</h3>
        <ul class="topics">
          ${GRAMMAR_TOPICS.filter((t) => t.level === lvl).map((t) => {
            const done = progress.modules[t.id]?.sessions || [];
            const intro = progress.introduced.includes(t.id);
            return `<li><button class="topic" data-id="${t.id}">
              <span><strong>${t.star ? '⭐ ' : ''}${esc(t.title)}</strong>${intro ? ' <span class="tag">visto en reunión</span>' : ''}<br><small class="muted">${esc(t.es)}</small></span>
              <span class="dots5">${Array.from({ length: MAX_SESSIONS }, (_, i) => {
                const s = done.find((d) => d.n === i + 1);
                return `<i class="${s ? (s.score >= 70 ? 'ok' : 'meh') : ''}"></i>`;
              }).join('')}</span>
            </button></li>`;
          }).join('')}
        </ul>
      </section>`).join('')}`;
  view.querySelectorAll('.topic').forEach((b) => b.addEventListener('click', () => renderTopic(topicById(b.dataset.id))));
  $('#phrases').addEventListener('click', renderPhrases);
}

function renderPhrases() {
  view.innerHTML = `
    <button class="link" id="back">← Temas</button>
    <section class="card">
      <h2>Frases de reunión</h2>
      <p class="muted">Expresiones que usan tus colegas en reuniones reales. Toca 🔊 para escucharlas con acento australiano y repítelas en voz alta.</p>
    </section>
    ${PHRASE_GROUPS.map((g, gi) => `
      <section class="card">
        <h3>${esc(g.title)}</h3>
        <ul class="examples">${g.items.map(([en, es], i) => `<li data-g="${gi}" data-i="${i}"><span><b>${esc(en)}</b><br><small class="muted">${esc(es)}</small></span></li>`).join('')}</ul>
      </section>`).join('')}`;
  $('#back').addEventListener('click', renderGrammar);
  view.querySelectorAll('.examples li').forEach((li) => li.append(speakBtn(PHRASE_GROUPS[li.dataset.g].items[li.dataset.i][0])));
}

function renderTopic(topic) {
  const done = progress.modules[topic.id]?.sessions || [];
  const names = ['Explicación', 'Práctica', 'Traducción', 'Hablar', 'Evaluación'];
  view.innerHTML = `
    <button class="link" id="back">← Temas</button>
    <section class="card">
      <h2>${esc(topic.title)}</h2>
      <p class="muted">${esc(topic.es)}</p>
      <ol class="sessions">
        ${names.map((name, i) => {
          const s = done.find((d) => d.n === i + 1);
          return `<li><button class="session" data-n="${i + 1}"><span>Sesión ${i + 1}: ${name}</span><span>${s ? `${s.score}%` : '›'}</span></button></li>`;
        }).join('')}
      </ol>
    </section>`;
  $('#back').addEventListener('click', renderGrammar);
  view.querySelectorAll('.session').forEach((b) => b.addEventListener('click', () => startLesson(topic, Number(b.dataset.n))));
}

async function startLesson(topic, n) {
  view.innerHTML = `<button class="link" id="back">← ${esc(topic.title)}</button><section class="card center"><div class="spinner"></div><p>Preparando la sesión ${n}…</p></section>`;
  $('#back').addEventListener('click', () => renderTopic(topic));
  const prev = (progress.modules[topic.id]?.sessions || []).map((s) => `S${s.n}: ${s.score}%`);
  const messages = [{ role: 'user', content: lessonRequest(topic, n, prev) }];
  try {
    const { data, assistantContent } = await askJSON({ system: lessonSystem(), messages, schema: LESSON_SCHEMA, effort: 'medium' });
    Object.assign(lesson, { topic, n, data, history: [...messages, { role: 'assistant', content: assistantContent }] });
    renderLesson();
  } catch (e) {
    showError(e);
    renderTopic(topic);
  }
}

function renderLesson() {
  const { topic, n, data } = lesson;
  view.innerHTML = `
    <button class="link" id="back">← ${esc(topic.title)}</button>
    <section class="card">
      <small class="muted">Sesión ${n}/${MAX_SESSIONS}</small>
      <h2>${esc(data.title)}</h2>
      <p class="objective">🎯 ${esc(data.objective_es)}</p>
      <div class="explanation">${md(data.explanation_es)}</div>
      <h3>Ejemplos</h3>
      <ul class="examples">${data.examples.map((ex, i) => `<li data-i="${i}"><span><b>${esc(ex.en)}</b><br><small class="muted">${esc(ex.es)}</small></span></li>`).join('')}</ul>
    </section>
    <section class="card">
      <h3>Ejercicios</h3>
      <form id="ex-form" class="exercises">
        ${data.exercises.map((ex) => `
          <div class="exercise" data-id="${ex.id}">
            <small class="muted">${esc(ex.instruction_es)}</small>
            <p class="prompt">${esc(ex.prompt)}</p>
            ${ex.type === 'choose' && ex.options.length
              ? `<div class="options">${ex.options.map((o) => `<label><input type="radio" name="${ex.id}" value="${esc(o)}" /> ${esc(o)}</label>`).join('')}</div>`
              : `<div class="answer-row"><textarea name="${ex.id}" rows="${ex.type === 'speak' ? 3 : 1}" placeholder="${ex.type === 'speak' ? 'Responde hablando 🎤' : 'Tu respuesta'}"></textarea><button type="button" class="mini-btn mic-mini">🎤</button></div>`}
            <div class="result"></div>
          </div>`).join('')}
        <button type="submit" class="primary big">Corregir</button>
      </form>
    </section>`;
  $('#back').addEventListener('click', () => renderTopic(topic));
  view.querySelectorAll('.examples li').forEach((li) => li.append(speakBtn(data.examples[li.dataset.i].en)));
  view.querySelectorAll('.exercise').forEach((ex) => {
    const mic = ex.querySelector('.mic-mini');
    if (mic) attachMic(mic, ex.querySelector('textarea'));
    if (data.exercises.find((e) => e.id === ex.dataset.id)?.type === 'speak') {
      ex.querySelector('.prompt').append(speakBtn(ex.querySelector('.prompt').textContent));
    }
  });
  $('#ex-form').addEventListener('submit', gradeLesson);
}

async function gradeLesson(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  const answers = lesson.data.exercises.map((ex) => {
    const el = form.elements[ex.id];
    return { id: ex.id, answer: (el?.value ?? '').trim() };
  });
  btn.disabled = true;
  btn.textContent = 'Corrigiendo…';
  const messages = [...lesson.history, { role: 'user', content: gradeRequest(answers) }];
  try {
    const { data, assistantContent } = await askJSON({ system: lessonSystem(), messages, schema: GRADE_SCHEMA, effort: 'low' });
    lesson.history = [...messages, { role: 'assistant', content: assistantContent }];
    for (const r of data.results) {
      const box = form.querySelector(`.exercise[data-id="${r.id}"]`);
      if (!box) continue;
      box.classList.add(r.correct ? 'correct' : 'wrong');
      box.querySelector('.result').innerHTML = `${r.correct ? '✅' : '❌'} <b>${esc(r.correct_answer)}</b><br><small>${esc(r.explanation_es)}</small>`;
      box.querySelector('.result').append(speakBtn(r.correct_answer));
    }
    recordModuleSession(lesson.topic.id, lesson.n, data.score);
    btn.remove();
    const summary = document.createElement('div');
    summary.className = 'card summary';
    summary.innerHTML = `<h3>Resultado: ${data.score}%</h3>${md(data.summary_es)}<p class="muted">💡 ${esc(data.next_tip_es)}</p>`;
    const next = document.createElement('button');
    next.className = 'primary big';
    if (lesson.n < MAX_SESSIONS) {
      next.textContent = `Siguiente: sesión ${lesson.n + 1} →`;
      next.addEventListener('click', () => startLesson(lesson.topic, lesson.n + 1));
    } else {
      next.textContent = 'Volver a los temas';
      next.addEventListener('click', renderGrammar);
    }
    const retry = document.createElement('button');
    retry.className = 'secondary';
    retry.textContent = 'Repetir esta sesión (nuevos ejercicios)';
    retry.addEventListener('click', () => startLesson(lesson.topic, lesson.n));
    summary.append(next, retry);
    form.after(summary);
    summary.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    showError(err);
    btn.disabled = false;
    btn.textContent = 'Corregir';
  }
}

// ================= PRONUNCIACIÓN =================

const pron = { set: PRON_SETS[0], sentences: [...PRON_SETS[0].sentences], idx: 0, mode: 'speak', accent: 'en-AU' };

function renderPron() {
  const s = pron.set;
  const sentence = pron.sentences[pron.idx];
  view.innerHTML = `
    <section class="card">
      <div class="seg">
        <label><input type="radio" name="pmode" value="speak" ${pron.mode === 'speak' ? 'checked' : ''}/> Hablar</label>
        <label><input type="radio" name="pmode" value="listen" ${pron.mode === 'listen' ? 'checked' : ''}/> Entender acentos</label>
      </div>
      <label>Sonido
        <select id="pset">${PRON_SETS.map((p) => `<option value="${p.id}" ${p.id === s.id ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}</select>
      </label>
      <p class="tip">💡 ${esc(s.tip)}</p>
      <div class="seg small">
        <label><input type="radio" name="acc" value="en-AU" ${pron.accent === 'en-AU' ? 'checked' : ''}/> 🇦🇺 Australiano</label>
        <label><input type="radio" name="acc" value="en-IN" ${pron.accent === 'en-IN' ? 'checked' : ''}/> 🇮🇳 Indio</label>
      </div>
    </section>
    <section class="card">
      <small class="muted">Frase ${pron.idx + 1}/${pron.sentences.length}</small>
      ${pron.mode === 'speak'
        ? `<p class="target" id="target">${esc(sentence)}</p>
           <div class="row">
             <button id="p-play" class="secondary">🔊 Escuchar</button>
             <button id="p-slow" class="secondary">🐢 Lento</button>
             <button id="p-rec" class="primary">🎤 Leer en voz alta</button>
           </div>
           <p id="heard" class="muted"></p>
           <div id="p-result"></div>`
        : `<p class="muted">Escucha la frase y escribe lo que entendiste.</p>
           <div class="row">
             <button id="p-play" class="primary">🔊 Escuchar</button>
             <button id="p-slow" class="secondary">🐢 Lento</button>
           </div>
           <textarea id="dict" rows="2" placeholder="Escribe lo que escuchaste…"></textarea>
           <button id="p-check" class="primary">Comprobar</button>
           <div id="p-result"></div>`}
      <div class="row">
        <button id="p-prev" class="secondary">←</button>
        <button id="p-next" class="secondary">Siguiente →</button>
        <button id="p-more" class="secondary">✨ Más frases</button>
      </div>
    </section>`;

  const pitch = pron.accent === 'en-IN' ? 1.1 : 0.95;
  $('#pset').addEventListener('change', (e) => {
    pron.set = PRON_SETS.find((p) => p.id === e.target.value);
    pron.sentences = [...pron.set.sentences];
    pron.idx = 0;
    renderPron();
  });
  view.querySelectorAll('input[name=pmode]').forEach((r) => r.addEventListener('change', () => ((pron.mode = r.value), renderPron())));
  view.querySelectorAll('input[name=acc]').forEach((r) => r.addEventListener('change', () => (pron.accent = r.value)));
  $('#p-play').addEventListener('click', () => speak(sentence, { lang: pron.accent, pitch }));
  $('#p-slow').addEventListener('click', () => speak(sentence, { lang: pron.accent, pitch, rate: 0.65 }));
  $('#p-prev').addEventListener('click', () => ((pron.idx = (pron.idx - 1 + pron.sentences.length) % pron.sentences.length), renderPron()));
  $('#p-next').addEventListener('click', () => ((pron.idx = (pron.idx + 1) % pron.sentences.length), renderPron()));
  $('#p-more').addEventListener('click', moreSentences);

  if (pron.mode === 'speak') {
    const rec = $('#p-rec');
    if (!canListen) rec.disabled = true;
    rec.addEventListener('click', async () => {
      if (rec.classList.contains('recording')) return listen.stop?.();
      rec.classList.add('recording');
      rec.textContent = '⏹️ Detener';
      try {
        toast('🎤 Lee la frase. Toca ⏹️ Detener cuando termines.', 3000);
        const res = await listen({ onInterim: (t) => ($('#heard').textContent = `Escuché: ${t}`) });
        showPronResult(sentence, res);
      } catch (e) {
        showError(e);
      } finally {
        rec.classList.remove('recording');
        rec.textContent = '🎤 Leer en voz alta';
      }
    });
  } else {
    $('#p-check').addEventListener('click', () => {
      const { result, score } = compareWords(sentence, $('#dict').value);
      $('#p-result').innerHTML = `<p class="score">${score}%</p><p class="words">${result.map((r) => `<span class="${r.ok ? 'ok' : 'bad'}">${esc(r.word)}</span>`).join(' ')}</p>`;
    });
  }
}

function showPronResult(sentence, res) {
  const { result, score } = compareWords(sentence, res.text);
  (progress.pron[pron.set.id] ||= []).push(score);
  saveProgress();
  $('#heard').textContent = `Escuché: "${res.text}"`;
  $('#p-result').innerHTML = `
    <p class="score">${score}%</p>
    <p class="words">${result.map((r) => `<span class="${r.ok ? 'ok' : 'bad'}" title="${esc(r.heard)}">${esc(r.word)}</span>`).join(' ')}</p>
    <p class="muted small">En rojo: palabras que el reconocedor no entendió como esperaba. Es una aproximación (el reconocedor de Android a veces "adivina").</p>
    <button id="p-ai" class="secondary">🤖 ¿Qué estoy pronunciando mal?</button>
    <div id="p-ai-out"></div>`;
  view.querySelectorAll('.words .bad').forEach((el) => el.addEventListener('click', () => speak(el.textContent, { lang: pron.accent })));
  $('#p-ai').addEventListener('click', async (e) => {
    e.target.disabled = true;
    e.target.textContent = 'Analizando…';
    try {
      const { data } = await askJSON({
        system: pronSystem(),
        messages: [{ role: 'user', content: `Target sentence: "${sentence}"\nRecognizer heard: "${res.text}"\nAlternatives: ${res.alternatives.map((a) => `"${a}"`).join(', ')}\nConfidence: ${res.confidence.toFixed(2)}\nSound being practised: ${pron.set.title}` }],
        schema: PRON_FEEDBACK_SCHEMA,
      });
      $('#p-ai-out').innerHTML = `${md(data.summary_es)}<ul>${data.issues.map((i) => `<li><b>${esc(i.word)}</b>: ${esc(i.likely_problem_es)}<br><small>${esc(i.tip_es)}</small></li>`).join('')}</ul>`;
      e.target.remove();
    } catch (err) {
      showError(err);
      e.target.disabled = false;
      e.target.textContent = '🤖 ¿Qué estoy pronunciando mal?';
    }
  });
}

async function moreSentences(e) {
  e.target.disabled = true;
  e.target.textContent = 'Generando…';
  try {
    const { data } = await askJSON({
      system: pronSystem(),
      messages: [{ role: 'user', content: `Write 6 new sentences (8-16 words) to practise "${pron.set.title}" (${pron.set.tip}). Each must contain several words with this sound, in BHP data & technology meeting context (APIs, Snowflake, architecture, vendors, project status)${pron.mode === 'listen' ? ', using natural Australian or Indian-Australian expressions a colleague would say' : ''}. Avoid these: ${pron.sentences.join(' | ')}` }],
      schema: PRON_SENTENCES_SCHEMA,
    });
    pron.sentences.push(...data.sentences);
    pron.idx = pron.sentences.length - data.sentences.length;
    renderPron();
  } catch (err) {
    showError(err);
    e.target.disabled = false;
    e.target.textContent = '✨ Más frases';
  }
}

// ================= PROGRESO =================

function renderProgress() {
  const modulesDone = Object.values(progress.modules).reduce((n, m) => n + m.sessions.length, 0);
  const counts = {};
  for (const e of progress.errors) counts[e.grammar_topic] = (counts[e.grammar_topic] || 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  view.innerHTML = `
    <section class="card stats">
      <div><b>${modulesDone}</b><small>sesiones de gramática</small></div>
      <div><b>${progress.introduced.length}</b><small>temas vistos en reuniones</small></div>
      <div><b>${progress.errors.length}</b><small>errores registrados</small></div>
      <div><b>${usd(progress.usd)}</b><small>gasto estimado (${progress.calls} llamadas)</small></div>
    </section>
    <section class="card">
      <h3>Lo que más te cuesta</h3>
      ${top.length ? `<ul class="bars">${top.map(([id, n]) => `<li><span>${esc(topicById(id)?.title || (id === 'known' ? 'Gramática base' : id === 'vocab' ? 'Vocabulario' : id))}</span><i style="--w:${Math.round((n / top[0][1]) * 100)}%"></i><b>${n}</b></li>`).join('')}</ul>` : '<p class="muted">Haz una reunión para empezar a medir.</p>'}
    </section>
    <section class="card">
      <h3>Últimos errores</h3>
      <ul class="fb-errors">${progress.errors.slice(0, 25).map((e) => `<li><s>${esc(e.original)}</s> → <b>${esc(e.correction)}</b><br><small>${esc(e.explanation_es)}</small></li>`).join('') || '<li class="muted">Nada aún.</li>'}</ul>
    </section>
    <section class="card">
      <h3>Respaldo</h3>
      <div class="row">
        <button id="exp" class="secondary">⬇️ Exportar</button>
        <label class="file-btn secondary">⬆️ Importar<input id="imp" type="file" accept="application/json" hidden /></label>
        <button id="reset" class="secondary danger">Reiniciar progreso</button>
      </div>
    </section>`;
  $('#exp').addEventListener('click', async () => {
    const blob = new Blob([JSON.stringify(await exportAll(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tutor-ingles-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });
  $('#imp').addEventListener('change', async (e) => {
    try {
      await importAll(JSON.parse(await e.target.files[0].text()));
      toast('Respaldo importado');
      renderProgress();
    } catch (err) {
      showError(err);
    }
  });
  $('#reset').addEventListener('click', () => {
    if (confirm('¿Borrar todo tu progreso? (las transcripciones se mantienen)')) {
      resetProgress();
      renderProgress();
    }
  });
}

// ================= AJUSTES =================

function voiceOptions(lang) {
  const vs = englishVoices();
  const current = settings.voiceOverrides?.[lang] || '';
  return `<option value="">Automática</option>${vs.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === current ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}`;
}

function openSettings() {
  $('#set-key').value = settings.apiKey;
  $('#set-model').innerHTML = MODELS.map((m) => `<option value="${m.id}" ${m.id === settings.model ? 'selected' : ''}>${m.label}</option>`).join('');
  $('#set-name').value = settings.myName;
  $('#set-recog').value = settings.recogLang;
  $('#set-rate').value = settings.rate;
  $('#rate-out').textContent = settings.rate;
  $('#set-hide').checked = settings.hideReplyText;
  $('#set-voice-au').innerHTML = voiceOptions('en-AU');
  $('#set-voice-in').innerHTML = voiceOptions('en-IN');
  $('#settings-dialog').showModal();
}

$('#set-rate').addEventListener('input', (e) => ($('#rate-out').textContent = e.target.value));
$('#btn-settings').addEventListener('click', openSettings);
$('#set-save').addEventListener('click', () => {
  settings.apiKey = $('#set-key').value.trim();
  settings.model = $('#set-model').value;
  settings.myName = $('#set-name').value.trim();
  settings.recogLang = $('#set-recog').value;
  settings.rate = Number($('#set-rate').value);
  settings.hideReplyText = $('#set-hide').checked;
  settings.voiceOverrides = { 'en-AU': $('#set-voice-au').value, 'en-IN': $('#set-voice-in').value };
  saveSettings();
  toast('Ajustes guardados');
});

// ================= inicio =================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

go('meeting');
if (!settings.apiKey) {
  setTimeout(() => {
    toast('Primero agrega tu API key en ⚙️ Ajustes', 5000);
    openSettings();
  }, 400);
}
