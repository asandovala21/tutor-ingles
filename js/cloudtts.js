// Voces naturales con Google Cloud Text-to-Speech (Chirp 3 HD / Neural2 / WaveNet).
// - Cada personaje tiene su voz con acento australiano o indio.
// - El audio de cada frase se guarda en el teléfono: repetirla no gasta caracteres.
// - Lleva la cuenta de caracteres del mes y, al acercarse al límite gratis,
//   la app vuelve sola a las voces del celular.
import { settings, progress, saveProgress } from './store.js';

const API = 'https://texttospeech.googleapis.com/v1';
const CACHE_NAME = 'tts-audio-v1';

// Preferencias de voz por personaje (nombres de voces Chirp 3 HD, en orden).
const PREFS = {
  mick: { lang: 'en-AU', gender: 'MALE', names: ['Charon', 'Orus', 'Fenrir', 'Puck'] },
  sarah: { lang: 'en-AU', gender: 'FEMALE', names: ['Aoede', 'Leda', 'Kore', 'Zephyr'] },
  priya: { lang: 'en-IN', gender: 'FEMALE', names: ['Kore', 'Aoede', 'Leda', 'Zephyr'] },
  arjun: { lang: 'en-IN', gender: 'MALE', names: ['Puck', 'Charon', 'Fenrir', 'Orus'] },
};
// Voz por defecto para frases sueltas (ejemplos, pronunciación) según el acento.
const DEFAULT_BY_LANG = { 'en-AU': 'sarah', 'en-IN': 'priya' };

const TIER_ORDER = [/Chirp3-HD/i, /Chirp-HD/i, /Neural2/i, /Wavenet/i, /Standard/i];
const voiceLists = {};

export function cloudEnabled() {
  return !!(settings.googleKey && settings.cloudVoices !== false);
}

function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function monthlyUsage() {
  if (progress.tts?.month !== monthKey()) progress.tts = { month: monthKey(), chars: 0 };
  return progress.tts.chars;
}

export function monthlyLimit() {
  return Number(settings.ttsLimit) || 900000;
}

function addUsage(n) {
  monthlyUsage();
  progress.tts.chars += n;
  saveProgress();
}

async function listVoices(lang) {
  if (!voiceLists[lang]) {
    voiceLists[lang] = fetch(`${API}/voices?languageCode=${lang}&key=${encodeURIComponent(settings.googleKey)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await errorText(r));
        return (await r.json()).voices || [];
      })
      .catch((e) => {
        delete voiceLists[lang];
        throw e;
      });
  }
  return voiceLists[lang];
}

async function errorText(r) {
  try {
    const j = await r.json();
    return j.error?.message || `HTTP ${r.status}`;
  } catch {
    return `HTTP ${r.status}`;
  }
}

/** Elige la mejor voz disponible para un personaje. */
async function voiceFor(characterId, lang) {
  const pref = PREFS[characterId] || PREFS[DEFAULT_BY_LANG[lang]] || PREFS.sarah;
  const lc = pref.lang;
  let voices;
  try {
    voices = (await listVoices(lc)).filter((v) => v.languageCodes?.includes(lc));
  } catch {
    // Si Google no deja listar voces, probamos directo con una voz conocida.
    return `${lc}-Chirp3-HD-${pref.names[0]}`;
  }
  for (const tier of TIER_ORDER) {
    const inTier = voices.filter((v) => tier.test(v.name));
    if (!inTier.length) continue;
    for (const n of pref.names) {
      const v = inTier.find((x) => x.name.endsWith(`-${n}`));
      if (v) return v.name;
    }
    const byGender = inTier.find((v) => v.ssmlGender === pref.gender);
    return (byGender || inTier[0]).name;
  }
  throw new Error(`No hay voces de Google para ${lc}`);
}

async function cacheKey(voice, rate, text) {
  const data = new TextEncoder().encode(`${voice}|${rate}|${text}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
  return new Request(`${location.origin}/__tts/${hex}.ogg`);
}

async function synthesize(voice, lang, rate, text) {
  const body = (withRate) => JSON.stringify({
    input: { text },
    voice: { languageCode: lang, name: voice },
    audioConfig: { audioEncoding: 'OGG_OPUS', ...(withRate ? { speakingRate: rate } : {}) },
  });
  const url = `${API}/text:synthesize?key=${encodeURIComponent(settings.googleKey)}`;
  const opts = (withRate) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body(withRate) });
  let r = await fetch(url, opts(rate !== 1));
  // Algunas voces no aceptan cambiar la velocidad: reintenta sin ella.
  if (!r.ok && r.status === 400 && rate !== 1) r = await fetch(url, opts(false));
  if (!r.ok) throw new Error(await errorText(r));
  const { audioContent } = await r.json();
  const bin = atob(audioContent);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  addUsage(text.length);
  return new Blob([bytes], { type: 'audio/ogg' });
}

/** Devuelve el audio (Blob) de `text`, desde la caché o generándolo. */
export async function cloudAudio(text, { character, lang = 'en-AU', rate = 1 }) {
  const r = Math.round(rate * 100) / 100;
  const voice = await voiceFor(character, lang);
  const voiceLang = voice.split('-').slice(0, 2).join('-');
  const key = await cacheKey(voice, r, text);
  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(key);
    if (hit) return hit.blob();
  } catch {}
  if (monthlyUsage() + text.length > monthlyLimit()) {
    throw new Error('LIMIT');
  }
  const blob = await synthesize(voice, voiceLang, r, text);
  try {
    await cache?.put(key, new Response(blob, { headers: { 'Content-Type': 'audio/ogg' } }));
  } catch {}
  return blob;
}

/** Prueba la clave: devuelve los nombres de las voces elegidas por personaje. */
export async function testCloud() {
  Object.keys(voiceLists).forEach((k) => delete voiceLists[k]);
  let listError = '';
  try {
    await listVoices('en-AU');
  } catch (e) {
    listError = e.message;
  }
  const out = {};
  for (const id of Object.keys(PREFS)) out[id] = await voiceFor(id, PREFS[id].lang);
  // Prueba real de síntesis (texto corto) para confirmar que la clave puede generar audio.
  try {
    await synthesize(out.mick, 'en-AU', 1, 'Test.');
  } catch (e) {
    throw new Error(`Generar audio: ${e.message}${listError ? ` · Listar voces: ${listError}` : ''}`);
  }
  return out;
}
