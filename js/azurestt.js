// Transcripción precisa con Azure Speech (la misma clave de las voces naturales).
// Graba el micrófono, lo convierte a WAV 16 kHz y lo envía a Azure, que devuelve
// el texto con puntuación, sin ruidos ni suspiros. También puede evaluar la
// pronunciación palabra por palabra contra una frase de referencia.
import { settings } from './store.js';

export function azureSttEnabled() {
  return !!(settings.azureKey && settings.azureRegion && settings.preciseStt !== false);
}

function region() {
  return settings.azureRegion.trim().toLowerCase().replace(/\s+/g, '');
}

// ---------------- Grabación ----------------

/**
 * Empieza a grabar. Devuelve { stop(): Promise<Float32Array 16 kHz>, cancel() }.
 * `onLevel(v)` recibe el volumen (0-1) y `onTime(s)` los segundos grabados.
 */
export async function startRecording({ onLevel, onTime } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
  });
  const ctx = new AudioContext();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const chunks = [];
  const started = Date.now();
  proc.onaudioprocess = (e) => {
    const data = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(data));
    if (onLevel) {
      let sum = 0;
      for (let i = 0; i < data.length; i += 8) sum += data[i] * data[i];
      onLevel(Math.min(1, Math.sqrt(sum / (data.length / 8)) * 5));
    }
    onTime?.((Date.now() - started) / 1000);
  };
  src.connect(proc);
  proc.connect(ctx.destination);
  const close = () => {
    proc.disconnect();
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
    ctx.close();
  };
  return {
    async stop() {
      close();
      const len = chunks.reduce((n, c) => n + c.length, 0);
      const all = new Float32Array(len);
      let o = 0;
      for (const c of chunks) {
        all.set(c, o);
        o += c.length;
      }
      return downsample(all, ctx.sampleRate, 16000);
    },
    cancel: close,
  };
}

function downsample(buf, from, to) {
  if (from === to) return buf;
  const ratio = from / to;
  const out = new Float32Array(Math.floor(buf.length / ratio));
  for (let i = 0; i < out.length; i++) {
    // Promedio del tramo para evitar aliasing.
    const start = Math.floor(i * ratio);
    const end = Math.min(buf.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += buf[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

function toWav(samples, rate = 16000) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + samples.length * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

// ---------------- Azure ----------------

async function recognize(samples, { lang, reference } = {}) {
  const params = new URLSearchParams({ language: lang || settings.recogLang || 'en-US', format: 'detailed', profanity: 'raw' });
  const headers = {
    'Ocp-Apim-Subscription-Key': settings.azureKey,
    'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
    Accept: 'application/json',
  };
  if (reference) {
    const cfg = { ReferenceText: reference, GradingSystem: 'HundredMark', Granularity: 'Word', Dimension: 'Comprehensive', EnableMiscue: true };
    headers['Pronunciation-Assessment'] = btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
  }
  const r = await fetch(`https://${region()}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?${params}`, {
    method: 'POST',
    headers,
    body: toWav(samples),
  });
  if (r.status === 401 || r.status === 403) throw new Error('Clave o región de Azure incorrecta');
  if (r.status === 429) throw new Error('Azure: cuota de transcripción agotada por ahora');
  if (!r.ok) throw new Error(`Azure HTTP ${r.status}`);
  return r.json();
}

/**
 * Transcribe audio 16 kHz. Divide grabaciones largas en tramos de 50 s
 * (el límite de Azure para audio corto es 60 s).
 * Devuelve { text, confidence, alternatives, pauses }.
 */
export async function transcribe(samples, { lang } = {}) {
  const rate = 16000;
  const step = 50 * rate;
  const texts = [];
  const confs = [];
  let alternatives = [];
  for (let i = 0; i < samples.length; i += step) {
    const part = samples.subarray(i, i + step);
    if (part.length < rate * 0.4) continue;
    const res = await recognize(part, { lang });
    if (res.RecognitionStatus !== 'Success') continue;
    const best = res.NBest?.[0];
    texts.push(best?.Display || res.DisplayText || '');
    if (best?.Confidence) confs.push(best.Confidence);
    if (res.NBest?.length > 1) alternatives = res.NBest.map((n) => n.Display);
  }
  const text = texts.filter(Boolean).join(' ').trim();
  return {
    text,
    confidence: confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : 0,
    alternatives: alternatives.length ? alternatives : [text],
    engine: 'azure',
  };
}

/**
 * Evalúa la pronunciación de `reference`. Devuelve
 * { text, accuracy, fluency, completeness, pron, words: [{ word, accuracy, error }] }.
 */
export async function assessPronunciation(samples, reference, { lang } = {}) {
  const res = await recognize(samples.subarray(0, 30 * 16000), { lang, reference });
  if (res.RecognitionStatus !== 'Success') throw new Error('No se entendió el audio. Intenta de nuevo más cerca del micrófono.');
  const best = res.NBest?.[0] || {};
  const pa = best.PronunciationAssessment || best;
  const words = (best.Words || []).map((w) => {
    const wp = w.PronunciationAssessment || w;
    return { word: w.Word, accuracy: Math.round(wp.AccuracyScore ?? 0), error: wp.ErrorType || 'None' };
  });
  return {
    text: best.Display || res.DisplayText || '',
    accuracy: Math.round(pa.AccuracyScore ?? 0),
    fluency: Math.round(pa.FluencyScore ?? 0),
    completeness: Math.round(pa.CompletenessScore ?? 0),
    pron: Math.round(pa.PronScore ?? 0),
    words,
  };
}
