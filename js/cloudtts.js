// Voces naturales en la nube: Google Cloud Text-to-Speech o Microsoft Azure Speech.
// - Cada personaje tiene su voz con acento australiano o indio.
// - El audio de cada frase se guarda en el teléfono: repetirla no gasta caracteres.
// - Lleva la cuenta de caracteres del mes y, al llegar al límite configurado,
//   la app vuelve sola a las voces del celular.
import { settings, progress, saveProgress } from './store.js';

const CACHE_NAME = 'tts-audio-v1';
// Voz por defecto para frases sueltas (ejemplos, pronunciación) según el acento.
const DEFAULT_BY_LANG = { 'en-AU': 'sarah', 'en-IN': 'priya' };
const CHAR_LANG = { mick: 'en-AU', sarah: 'en-AU', priya: 'en-IN', arjun: 'en-IN' };

function provider() {
  return settings.ttsProvider === 'google' ? GOOGLE : AZURE;
}

export function cloudEnabled() {
  return settings.cloudVoices !== false && provider().configured();
}

// ---------------- Contador mensual ----------------
function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function monthlyUsage() {
  if (progress.tts?.month !== monthKey()) progress.tts = { month: monthKey(), chars: 0 };
  return progress.tts.chars;
}

export function defaultLimit() {
  return provider().freeChars * 0.9;
}

export function monthlyLimit() {
  return Number(settings.ttsLimit) || defaultLimit();
}

export function freeChars() {
  return provider().freeChars;
}

function addUsage(n) {
  monthlyUsage();
  progress.tts.chars += n;
  saveProgress();
}

async function errorText(r) {
  try {
    const j = await r.json();
    return j.error?.message || j.message || `HTTP ${r.status}`;
  } catch {
    return `HTTP ${r.status}`;
  }
}

function bytesFromBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ---------------- Google Cloud ----------------
const GOOGLE = {
  name: 'Google Cloud',
  freeChars: 1000000,
  api: 'https://texttospeech.googleapis.com/v1',
  prefs: {
    mick: { gender: 'MALE', names: ['Charon', 'Orus', 'Fenrir', 'Puck'] },
    sarah: { gender: 'FEMALE', names: ['Aoede', 'Leda', 'Kore', 'Zephyr'] },
    priya: { gender: 'FEMALE', names: ['Kore', 'Aoede', 'Leda', 'Zephyr'] },
    arjun: { gender: 'MALE', names: ['Puck', 'Charon', 'Fenrir', 'Orus'] },
  },
  tiers: [/Chirp3-HD/i, /Chirp-HD/i, /Neural2/i, /Wavenet/i, /Standard/i],
  lists: {},
  configured: () => !!settings.googleKey,
  key: () => encodeURIComponent(settings.googleKey),

  listVoices(lang) {
    this.lists[lang] ||= fetch(`${this.api}/voices?languageCode=${lang}&key=${this.key()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await errorText(r));
        return (await r.json()).voices || [];
      })
      .catch((e) => {
        delete this.lists[lang];
        throw e;
      });
    return this.lists[lang];
  },

  async voiceFor(id, lang) {
    const pref = this.prefs[id];
    let voices;
    try {
      voices = (await this.listVoices(lang)).filter((v) => v.languageCodes?.includes(lang));
    } catch {
      return `${lang}-Chirp3-HD-${pref.names[0]}`;
    }
    for (const tier of this.tiers) {
      const inTier = voices.filter((v) => tier.test(v.name));
      if (!inTier.length) continue;
      for (const n of pref.names) {
        const v = inTier.find((x) => x.name.endsWith(`-${n}`));
        if (v) return v.name;
      }
      return (inTier.find((v) => v.ssmlGender === pref.gender) || inTier[0]).name;
    }
    throw new Error(`No hay voces de Google para ${lang}`);
  },

  async synthesize(voice, lang, rate, text) {
    const url = `${this.api}/text:synthesize?key=${this.key()}`;
    const opts = (withRate) => ({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: lang, name: voice },
        audioConfig: { audioEncoding: 'OGG_OPUS', ...(withRate ? { speakingRate: rate } : {}) },
      }),
    });
    let r = await fetch(url, opts(rate !== 1));
    // Algunas voces no aceptan cambiar la velocidad: reintenta sin ella.
    if (!r.ok && r.status === 400 && rate !== 1) r = await fetch(url, opts(false));
    if (!r.ok) throw new Error(await errorText(r));
    const { audioContent } = await r.json();
    return new Blob([bytesFromBase64(audioContent)], { type: 'audio/ogg' });
  },
};

// ---------------- Microsoft Azure ----------------
const AZURE = {
  name: 'Azure',
  freeChars: 500000,
  prefs: {
    mick: { gender: 'Male', names: ['en-AU-WilliamNeural', 'en-AU-DarrenNeural', 'en-AU-KenNeural', 'en-AU-DuncanNeural'] },
    sarah: { gender: 'Female', names: ['en-AU-NatashaNeural', 'en-AU-AnnetteNeural', 'en-AU-FreyaNeural', 'en-AU-ElsieNeural'] },
    priya: { gender: 'Female', names: ['en-IN-NeerjaNeural', 'en-IN-AashiNeural', 'en-IN-AnanyaNeural', 'en-IN-KavyaNeural'] },
    arjun: { gender: 'Male', names: ['en-IN-PrabhatNeural', 'en-IN-AaravNeural', 'en-IN-KunalNeural', 'en-IN-RehaanNeural'] },
  },
  list: null,
  configured: () => !!(settings.azureKey && settings.azureRegion),
  base: () => `https://${settings.azureRegion.trim().toLowerCase().replace(/\s+/g, '')}.tts.speech.microsoft.com/cognitiveservices`,

  listVoices() {
    this.list ||= fetch(`${this.base()}/voices/list`, { headers: { 'Ocp-Apim-Subscription-Key': settings.azureKey } })
      .then(async (r) => {
        if (r.status === 401) throw new Error('Clave o región de Azure incorrecta (401)');
        if (!r.ok) throw new Error(await errorText(r));
        return r.json();
      })
      .catch((e) => {
        this.list = null;
        throw e;
      });
    return this.list;
  },

  async voiceFor(id, lang) {
    const pref = this.prefs[id];
    let voices;
    try {
      voices = (await this.listVoices()).filter((v) => v.Locale === lang);
    } catch {
      return pref.names[0];
    }
    for (const n of pref.names) if (voices.some((v) => v.ShortName === n)) return n;
    const v = voices.find((x) => x.Gender === pref.gender) || voices[0];
    if (!v) throw new Error(`No hay voces de Azure para ${lang}`);
    return v.ShortName;
  },

  async synthesize(voice, lang, rate, text) {
    const esc = text.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
    const pct = `${Math.round((rate - 1) * 100) >= 0 ? '+' : ''}${Math.round((rate - 1) * 100)}%`;
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}"><voice name="${voice}"><prosody rate="${pct}">${esc}</prosody></voice></speak>`;
    const r = await fetch(`${this.base()}/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': settings.azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'ogg-24khz-16bit-mono-opus',
      },
      body: ssml,
    });
    if (r.status === 401) throw new Error('Clave o región de Azure incorrecta (401)');
    if (r.status === 429) throw new Error('Azure: demasiadas solicitudes o cuota agotada (429)');
    if (!r.ok) throw new Error(await errorText(r));
    return new Blob([await r.arrayBuffer()], { type: 'audio/ogg' });
  },
};

// ---------------- Común ----------------
async function cacheKey(voice, rate, text) {
  const data = new TextEncoder().encode(`${voice}|${rate}|${text}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
  return new Request(`${location.origin}/__tts/${hex}.ogg`);
}

function resolve(character, lang) {
  const id = CHAR_LANG[character] ? character : DEFAULT_BY_LANG[lang] || 'sarah';
  return { id, lang: CHAR_LANG[id] };
}

/** Devuelve el audio (Blob) de `text`, desde la caché o generándolo. */
export async function cloudAudio(text, { character, lang = 'en-AU', rate = 1 }) {
  const p = provider();
  const r = Math.round(rate * 100) / 100;
  const { id, lang: voiceLang } = resolve(character, lang);
  const voice = await p.voiceFor(id, voiceLang);
  const key = await cacheKey(voice, r, text);
  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(key);
    if (hit) return hit.blob();
  } catch {}
  if (monthlyUsage() + text.length > monthlyLimit()) throw new Error('LIMIT');
  const blob = await p.synthesize(voice, voiceLang, r, text);
  addUsage(text.length);
  try {
    await cache?.put(key, new Response(blob, { headers: { 'Content-Type': 'audio/ogg' } }));
  } catch {}
  return blob;
}

/** Prueba la configuración: devuelve las voces elegidas por personaje. */
export async function testCloud() {
  const p = provider();
  if (!p.configured()) throw new Error(p === AZURE ? 'Falta la clave o la región de Azure.' : 'Falta la API key de Google.');
  GOOGLE.lists = {};
  AZURE.list = null;
  let listError = '';
  try {
    await p.listVoices('en-AU');
  } catch (e) {
    listError = e.message;
  }
  const out = {};
  for (const id of Object.keys(CHAR_LANG)) out[id] = await p.voiceFor(id, CHAR_LANG[id]);
  try {
    await p.synthesize(out.mick, 'en-AU', 1, 'Test.');
    addUsage(5);
  } catch (e) {
    throw new Error(`Generar audio: ${e.message}${listError ? ` · Listar voces: ${listError}` : ''}`);
  }
  return out;
}
