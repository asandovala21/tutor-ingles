// Voz: síntesis (el monito habla con acento australiano o indio) y reconocimiento (te escucha).
import { settings } from './store.js';
import { cloudAudio, cloudEnabled } from './cloudtts.js';

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth ? synth.getVoices() : [];
}
if (synth) {
  loadVoices();
  synth.addEventListener?.('voiceschanged', loadVoices);
}

export function englishVoices() {
  loadVoices();
  return voices.filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith('en'));
}

function pickVoice(lang) {
  const all = englishVoices();
  const override = settings.voiceOverrides?.[lang];
  if (override) {
    const v = all.find((x) => x.voiceURI === override);
    if (v) return v;
  }
  const norm = (l) => l.toLowerCase().replace('_', '-');
  const exact = all.filter((v) => norm(v.lang) === lang.toLowerCase());
  return exact.find((v) => /google|natural|enhanced/i.test(v.name)) || exact[0] || null;
}

export function hasVoiceFor(lang) {
  return !!pickVoice(lang);
}

/** Voz del celular (Web Speech API). */
function deviceSpeak(text, { lang = 'en-AU', pitch = 1, rate, onStart, onEnd, onWord } = {}) {
  return new Promise((resolve) => {
    if (!synth) {
      onEnd?.();
      resolve();
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || lang;
    u.pitch = pitch;
    u.rate = rate ?? settings.rate ?? 1;
    u.onstart = () => onStart?.();
    u.onboundary = (e) => {
      if (e.name === 'word' || e.name === undefined) onWord?.(e);
    };
    const done = () => {
      onEnd?.();
      resolve();
    };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  });
}

// ---- Voces naturales (Google Cloud) con la boca sincronizada al volumen ----
const audioEl = new Audio();
let audioCtx;
let analyser;
let playToken = 0;
let warned = false;

// El audio pasa por el analizador solo si el AudioContext puede correr;
// si el navegador lo bloquea, el audio suena directo y la boca se mueve al azar.
async function setupAnalyser() {
  if (analyser || audioCtx || !window.AudioContext) return;
  try {
    audioCtx = new AudioContext();
    await audioCtx.resume();
    if (audioCtx.state !== 'running') {
      audioCtx.close();
      audioCtx = null;
      return;
    }
    const src = audioCtx.createMediaElementSource(audioEl);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
  } catch {
    analyser = null;
  }
}

function cloudSpeak(text, { character, lang, rate, onStart, onEnd, onLevel }) {
  const token = ++playToken;
  return cloudAudio(text, { character, lang, rate: rate ?? settings.rate ?? 1 }).then(
    (blob) =>
      new Promise(async (resolve, reject) => {
        if (token !== playToken) return resolve();
        await setupAnalyser();
        await audioCtx?.resume?.();
        if (token !== playToken) return resolve();
        const url = URL.createObjectURL(blob);
        audioEl.src = url;
        let raf;
        const buf = analyser ? new Uint8Array(analyser.fftSize) : null;
        const tick = () => {
          if (analyser && onLevel) {
            analyser.getByteTimeDomainData(buf);
            let sum = 0;
            for (const v of buf) sum += ((v - 128) / 128) ** 2;
            onLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
          }
          raf = requestAnimationFrame(tick);
        };
        let started = false;
        const done = (err) => {
          cancelAnimationFrame(raf);
          URL.revokeObjectURL(url);
          audioEl.onended = audioEl.onerror = audioEl.onpause = null;
          // Si el audio no pudo reproducirse, se avisa para usar la voz del celular.
          if (err && !started) return reject(new Error('no se pudo reproducir el audio'));
          onEnd?.();
          resolve();
        };
        audioEl.onended = () => done();
        audioEl.onerror = () => done(true);
        audioEl.onpause = () => done();
        audioEl
          .play()
          .then(() => {
            started = true;
            onStart?.();
            tick();
          })
          .catch(() => done(true));
      }),
  );
}

/**
 * Habla `text`. Usa voces naturales de Google Cloud si hay clave; si falla,
 * no hay internet o se llegó al límite del mes, usa la voz del celular.
 * `character` elige la voz del personaje; `onLevel` recibe el volumen (0-1)
 * para mover la boca; `onWord` se llama por palabra con la voz del celular.
 */
export async function speak(text, opts = {}) {
  stopSpeaking();
  if (cloudEnabled()) {
    try {
      await cloudSpeak(text, opts);
      return;
    } catch (e) {
      if (!warned) {
        warned = true;
        const msg = e.message === 'LIMIT'
          ? 'Llegaste al límite mensual de voces naturales: uso la voz del celular.'
          : `Voces naturales no disponibles (${e.message}). Uso la voz del celular.`;
        window.dispatchEvent(new CustomEvent('tts-warning', { detail: msg }));
      }
    }
  }
  return deviceSpeak(text, opts);
}

export function stopSpeaking() {
  playToken++;
  synth?.cancel();
  if (!audioEl.paused) audioEl.pause();
}

/** Permite volver a avisar si las voces naturales fallan (p. ej., tras cambiar la clave). */
export function resetCloudWarning() {
  warned = false;
}

// ---------------- Reconocimiento de voz ----------------

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!Recognition;

// Chrome en Android repite resultados ("hello", "hello hello"…) en modo continuo.
// Unimos los fragmentos descartando los que ya están contenidos en el anterior.
function collapse(parts) {
  const out = [];
  for (const raw of parts) {
    const t = raw.trim();
    if (!t) continue;
    const last = out[out.length - 1];
    const lt = t.toLowerCase();
    const ll = last?.toLowerCase();
    if (ll && (lt === ll || ll.endsWith(lt))) continue;
    if (ll && lt.startsWith(ll)) {
      out[out.length - 1] = t;
      continue;
    }
    out.push(t);
  }
  return out;
}

/** Quita repeticiones que mete el reconocedor: "hello hello hello" → "hello". */
export function cleanRepeats(text) {
  return text
    .replace(/\b(\w+(?:\s+\w+)+?)(?:\s+\1\b)+/gi, '$1')
    .replace(/\b(\w+(?:'\w+)?)(?:\s+\1\b)+/gi, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ---------------- Puntuación automática del transcript ----------------
// El reconocedor de Android no pone puntuación. Cada pausa corta un segmento;
// con eso aplicamos reglas básicas de transcripción:
//   - pausa a mitad de frase → "..."
//   - pregunta → "?"
//   - frase completa → "."
//   - mayúscula al inicio de cada oración y "I" siempre en mayúscula.

const AUX = 'is|are|am|was|were|do|does|did|can|could|would|should|shall|will|have|has|had|may|might|must|isn\'t|aren\'t|wasn\'t|weren\'t|don\'t|doesn\'t|didn\'t|can\'t|couldn\'t|wouldn\'t|shouldn\'t|won\'t|haven\'t|hasn\'t';
const WH = 'what|why|how|when|where|who|whom|whose|which';
const SUBJECT = 'i|we|you|they|he|she|it|i\'m|we\'re|you\'re|they\'re|he\'s|she\'s|it\'s|i\'ve|we\'ve|i\'d|we\'d|i\'ll|we\'ll';
const AUX_START = new RegExp(`^(${AUX})\\b`, 'i');
const WH_START = new RegExp(`^(${WH})\\b(\\s+(\\S+))?`, 'i');
const SUBJECT_WORD = new RegExp(`^(${SUBJECT})$`, 'i');
const TAG_END = /\b(right|isn't it|aren't they|don't you|doesn't it|didn't you|is it|are you|correct|or not|yeah)$/i;
const NOT_QUESTION = /^(have a|do one thing|will do|could be|must be|may be|might be)\b/i;
const INCOMPLETE_END = /\b(and|but|or|so|because|the|a|an|to|of|for|with|in|on|at|from|by|that|which|who|if|when|then|like|um|uh|eh|is|are|was|were|be|my|our|your|their|this|these|those|i|we|they|it's|i'm|we're|going|want|need|think|about|also|than|as|into|about|um|er)$/i;
const CONTINUATION_START = /^(and|but|or|so|because|which|that|then|also|to|with|for|than|as|if)\b/i;

function isQuestion(seg) {
  if (NOT_QUESTION.test(seg)) return false;
  if (TAG_END.test(seg)) return true;
  if (AUX_START.test(seg)) return true;
  const m = seg.match(WH_START);
  // "What I'm saying is…" o "When we finish…" no son preguntas.
  if (m) return !(m[3] && SUBJECT_WORD.test(m[3]));
  return /^how about\b/i.test(seg);
}

function capitalize(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Une los segmentos (separados por pausas) con puntuación de transcript. */
export function formatTranscript(segments) {
  const segs = segments.map((x) => cleanRepeats(x).replace(/\bi\b/g, 'I')).filter(Boolean);
  let out = '';
  let newSentence = true;
  segs.forEach((seg, i) => {
    let s = seg.trim();
    const next = segs[i + 1];
    if (newSentence) s = capitalize(s);
    if (!/[.?!…,;:]$/.test(s)) {
      const incomplete = INCOMPLETE_END.test(s) || (next && CONTINUATION_START.test(next));
      // La pregunta se detecta sobre la oración completa, no solo el último tramo.
      const sentenceStart = newSentence ? s : (out.split(/[.?!]\s+/).pop() + ' ' + s).replace(/\.\.\./g, ' ');
      s += incomplete ? '...' : isQuestion(sentenceStart.trim()) ? '?' : '.';
    }
    newSentence = /[.?!]$/.test(s) && !s.endsWith('...');
    out += (out ? ' ' : '') + s;
  });
  return out;
}

/**
 * Escucha hasta que llames a `listen.stop()` (tocar de nuevo el micrófono).
 * Las pausas no cortan la grabación: si el reconocedor se detiene por un
 * silencio, se reinicia solo y sigue sumando lo que dices.
 * Devuelve { text, confidence, alternatives }. `onInterim` recibe el texto parcial.
 */
export function listen({ lang, onInterim, maxMs = 180000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) {
      reject(new Error('Este navegador no soporta reconocimiento de voz. Usa Chrome en Android.'));
      return;
    }
    const segments = [];
    const confidences = [];
    let alternatives = [];
    let stopped = false;
    let failed = false;
    let rec;

    const joined = (extra = '') => {
      const done = formatTranscript(collapse(segments));
      const live = cleanRepeats(extra);
      return [done, live].filter(Boolean).join(' ');
    };

    const finish = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(maxTimer);
      try {
        rec?.stop();
      } catch {}
    };

    const start = () => {
      rec = new Recognition();
      rec.lang = lang || settings.recogLang || 'en-AU';
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      // Sesiones cortas que se reinician: en Android es más estable que continuous = true.
      rec.continuous = false;
      let sessionFinal = '';
      let current = '';
      let sessionConf = 0;
      let sessionAlts = [];

      rec.onresult = (e) => {
        const finals = [];
        let interim = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            finals.push(r[0].transcript);
            sessionConf = r[0].confidence;
            sessionAlts = Array.from(r).map((x) => x.transcript.trim());
          } else {
            interim = r[0].transcript;
          }
        }
        sessionFinal = collapse(finals).join(' ');
        current = collapse([sessionFinal, interim]).join(' ');
        onInterim?.(joined(current));
      };
      rec.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        failed = true;
        stopped = true;
        clearTimeout(maxTimer);
        reject(new Error(e.error === 'not-allowed' ? 'Permiso de micrófono denegado.' : `Error de micrófono: ${e.error}`));
      };
      rec.onend = () => {
        if (failed) return;
        const piece = sessionFinal || current;
        if (piece) {
          segments.push(piece);
          if (sessionConf > 0) confidences.push(sessionConf);
          if (sessionAlts.length) alternatives = sessionAlts;
        }
        if (!stopped) {
          // Hiciste una pausa: seguimos escuchando.
          try {
            start();
            return;
          } catch {}
        }
        const text = joined();
        resolve({
          text,
          confidence: confidences.length ? confidences.reduce((x, y) => x + y, 0) / confidences.length : 0,
          alternatives: segments.length === 1 ? alternatives : [text],
        });
      };
      rec.start();
    };

    const maxTimer = setTimeout(finish, maxMs);
    listen.stop = finish;
    start();
  });
}

// ---------------- Avatar ("monito que mueve la boquita") ----------------

export function avatarSVG(character) {
  const { skin, hair, shirt } = character.look;
  return `
<svg viewBox="0 0 200 200" class="avatar-svg" role="img" aria-label="${character.name}">
  <circle cx="100" cy="100" r="98" fill="var(--avatar-bg)"/>
  <path d="M30 200 Q30 150 100 145 Q170 150 170 200 Z" fill="${shirt}"/>
  <rect x="88" y="120" width="24" height="30" rx="8" fill="${skin}"/>
  <ellipse cx="100" cy="92" rx="50" ry="56" fill="${skin}"/>
  <path d="M50 85 Q50 32 100 32 Q150 32 150 85 Q140 55 100 55 Q62 55 50 85 Z" fill="${hair}"/>
  <ellipse cx="50" cy="96" rx="7" ry="11" fill="${skin}"/>
  <ellipse cx="150" cy="96" rx="7" ry="11" fill="${skin}"/>
  <g class="eyes">
    <ellipse cx="80" cy="88" rx="6" ry="7" fill="#222"/>
    <ellipse cx="120" cy="88" rx="6" ry="7" fill="#222"/>
    <circle cx="82" cy="86" r="2" fill="#fff"/>
    <circle cx="122" cy="86" r="2" fill="#fff"/>
  </g>
  <path d="M70 74 Q80 69 90 74" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M110 74 Q120 69 130 74" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M100 95 Q96 108 102 110" stroke="rgba(0,0,0,.25)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth" cx="100" cy="124" rx="14" ry="2.5" fill="#7a2e2e"/>
  <path class="smile" d="M86 122 Q100 130 114 122" stroke="#7a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;
}

/** Controla la boca del avatar dentro de `container`. */
export function animateMouth(container) {
  let timer;
  let lastWord = 0;
  const mouth = () => container.querySelector('.mouth');
  const smile = () => container.querySelector('.smile');
  const set = (open) => {
    const m = mouth();
    if (!m) return;
    m.setAttribute('ry', String(2.5 + open * 11));
    m.setAttribute('rx', String(14 - open * 3));
    smile()?.setAttribute('opacity', open > 0.1 ? '0' : '1');
  };
  return {
    start() {
      container.classList.add('speaking');
      clearInterval(timer);
      // Si el motor no avisa palabra por palabra (frecuente en Android), simulamos el ritmo.
      timer = setInterval(() => {
        if (Date.now() - lastWord > 250) set(Math.random() * 0.9 + (Math.random() < 0.25 ? 0 : 0.1));
      }, 110);
    },
    level(v) {
      lastWord = Date.now();
      set(v < 0.06 ? 0 : Math.min(1, 0.15 + v));
    },
    word() {
      lastWord = Date.now();
      set(0.6 + Math.random() * 0.4);
      setTimeout(() => set(0.15), 140);
    },
    stop() {
      clearInterval(timer);
      container.classList.remove('speaking');
      set(0);
    },
  };
}

// ---------------- Comparación palabra a palabra ----------------

const normWord = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

export function words(s) {
  return s.split(/\s+/).map(normWord).filter(Boolean);
}

/** Alinea la frase objetivo con lo reconocido (Levenshtein por palabras). */
export function compareWords(target, heard) {
  const raw = target.split(/\s+/).filter((w) => normWord(w));
  const a = raw.map(normWord);
  const b = words(heard);
  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  const result = [];
  let i = a.length;
  let j = b.length;
  while (i > 0) {
    if (j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      result.unshift({ word: raw[i - 1], ok: a[i - 1] === b[j - 1], heard: b[j - 1] });
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j] + 1) {
      result.unshift({ word: raw[i - 1], ok: false, heard: '' });
      i--;
    } else {
      j--;
    }
  }
  const okCount = result.filter((r) => r.ok).length;
  return { result, score: a.length ? Math.round((okCount / a.length) * 100) : 0 };
}
