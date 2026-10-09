// Voz: síntesis (el monito habla con acento australiano o indio) y reconocimiento (te escucha).
import { settings } from './store.js';

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

/** Habla `text`. `onWord` se llama en cada palabra (si el motor lo soporta). */
export function speak(text, { lang = 'en-AU', pitch = 1, rate, onStart, onEnd, onWord } = {}) {
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

export function stopSpeaking() {
  synth?.cancel();
}

// ---------------- Reconocimiento de voz ----------------

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!Recognition;

/**
 * Escucha una frase. Devuelve { text, confidence, alternatives }.
 * `onInterim` recibe el texto parcial mientras hablas.
 */
export function listen({ lang, onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) {
      reject(new Error('Este navegador no soporta reconocimiento de voz. Usa Chrome en Android.'));
      return;
    }
    const rec = new Recognition();
    rec.lang = lang || settings.recogLang || 'en-AU';
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = true;
    let finalParts = [];
    let confidences = [];
    let alternatives = [];
    let silenceTimer;

    const finish = () => {
      clearTimeout(silenceTimer);
      try {
        rec.stop();
      } catch {}
    };

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalParts.push(r[0].transcript.trim());
          confidences.push(r[0].confidence);
          if (alternatives.length === 0) alternatives = Array.from(r).map((a) => a.transcript.trim());
        } else {
          interim += r[0].transcript;
        }
      }
      onInterim?.([...finalParts, interim].join(' ').trim());
      clearTimeout(silenceTimer);
      // Cierra solo tras 2,5 s de silencio para que puedas pensar entre frases.
      silenceTimer = setTimeout(finish, 2500);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      reject(new Error(e.error === 'not-allowed' ? 'Permiso de micrófono denegado.' : `Error de micrófono: ${e.error}`));
    };
    rec.onend = () => {
      const text = finalParts.join(' ').trim();
      const valid = confidences.filter((c) => c > 0);
      resolve({
        text,
        confidence: valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0,
        alternatives: finalParts.length === 1 ? alternatives : [text],
      });
    };
    listen.stop = finish;
    rec.start();
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
