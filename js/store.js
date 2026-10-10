// Persistencia local: ajustes y progreso en localStorage, transcripciones en IndexedDB
// (pueden ser largas y localStorage tiene ~5 MB).

const SETTINGS_KEY = 'tutor.settings.v1';
const PROGRESS_KEY = 'tutor.progress.v1';

const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'claude-opus-5-5',
  character: 'mick',
  recogLang: 'en-AU',
  rate: 0.95,
  hideReplyText: false,
  myName: '',
  voiceOverrides: {}, // { 'en-AU': voiceURI, 'en-IN': voiceURI }
};

const DEFAULT_PROGRESS = {
  modules: {}, // topicId -> { sessions: [{ n, score, date }] }
  introduced: [], // topicIds que el tutor ya presentó en reuniones
  errors: [], // { date, original, correction, explanation_es, grammar_topic }
  pron: {}, // setId -> [scores]
  usd: 0,
  calls: 0,
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...structuredClone(fallback), ...JSON.parse(raw) } : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('No se pudo guardar', key, e);
  }
}

export const settings = readJSON(SETTINGS_KEY, DEFAULT_SETTINGS);
export const progress = readJSON(PROGRESS_KEY, DEFAULT_PROGRESS);

export function saveSettings() {
  writeJSON(SETTINGS_KEY, settings);
}

export function saveProgress() {
  writeJSON(PROGRESS_KEY, progress);
}

export function resetProgress() {
  Object.keys(progress).forEach((k) => delete progress[k]);
  Object.assign(progress, structuredClone(DEFAULT_PROGRESS));
  saveProgress();
}

export function logErrors(errors) {
  const date = new Date().toISOString();
  for (const e of errors) progress.errors.unshift({ date, ...e });
  progress.errors = progress.errors.slice(0, 300);
  saveProgress();
}

export function markIntroduced(topicId) {
  if (topicId && !progress.introduced.includes(topicId)) {
    progress.introduced.push(topicId);
    saveProgress();
  }
}

export function recordModuleSession(topicId, n, score) {
  const m = (progress.modules[topicId] ||= { sessions: [] });
  m.sessions = m.sessions.filter((s) => s.n !== n);
  m.sessions.push({ n, score, date: new Date().toISOString() });
  m.sessions.sort((a, b) => a.n - b.n);
  saveProgress();
}

// ---------- IndexedDB para transcripciones ----------
const DB_NAME = 'tutor-ingles';
let dbPromise;

function db() {
  dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains('transcripts')) d.createObjectStore('transcripts', { keyPath: 'id' });
      // Lecciones generadas, para no volver a pedirlas a Claude.
      if (!d.objectStoreNames.contains('lessons')) d.createObjectStore('lessons', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(mode, fn, store = 'transcripts') {
  const d = await db();
  return new Promise((resolve, reject) => {
    const t = d.transaction(store, mode);
    const result = fn(t.objectStore(store));
    t.oncomplete = () => resolve(result instanceof IDBRequest ? result.result : result);
    t.onerror = () => reject(t.error);
  });
}

export function listTranscripts() {
  return tx('readonly', (s) => s.getAll());
}

export function saveTranscript(name, text) {
  const item = { id: crypto.randomUUID(), name, text, addedAt: new Date().toISOString() };
  return tx('readwrite', (s) => s.put(item)).then(() => item);
}

export function deleteTranscript(id) {
  return tx('readwrite', (s) => s.delete(id));
}

// ---------- Lecciones en caché ----------
export function getLesson(key) {
  return tx('readonly', (s) => s.get(key), 'lessons');
}

export function putLesson(key, value) {
  return tx('readwrite', (s) => s.put({ key, ...value, savedAt: new Date().toISOString() }), 'lessons');
}

export async function exportAll() {
  return { settings: { ...settings, apiKey: '' }, progress, transcripts: await listTranscripts() };
}

export async function importAll(data) {
  if (data.progress) {
    Object.assign(progress, data.progress);
    saveProgress();
  }
  for (const t of data.transcripts || []) {
    await tx('readwrite', (s) => s.put(t));
  }
}
