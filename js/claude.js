// Llamadas a la API de Claude directamente desde el navegador con tu propia API key.
import Anthropic from '../vendor/anthropic-sdk.js';
import { settings, progress, saveProgress } from './store.js';

export const MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (mejor calidad)', inUsd: 4, outUsd: 20, cacheReadUsd: 0.2, fallback: true },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (equilibrado)', inUsd: 2, outUsd: 10, cacheReadUsd: 0.2, fallback: true },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5 (más barato y rápido)', inUsd: 0.1, outUsd: 0.5, cacheReadUsd: 0.01, fallback: false },
];

export class TutorError extends Error {}

function modelInfo() {
  return MODELS.find((m) => m.id === settings.model) || MODELS[0];
}

function trackUsage(usage) {
  if (!usage) return 0;
  const m = modelInfo();
  const usd =
    ((usage.input_tokens || 0) * m.inUsd +
      (usage.cache_creation_input_tokens || 0) * m.inUsd * 1.25 +
      (usage.cache_read_input_tokens || 0) * m.cacheReadUsd +
      (usage.output_tokens || 0) * m.outUsd) /
    1e6;
  progress.usd += usd;
  progress.calls += 1;
  saveProgress();
  return usd;
}

/**
 * Pide a Claude una respuesta. Con `schema` devuelve `data` (JSON que cumple el
 * esquema, vía structured outputs); sin `schema` devuelve `text` libre.
 * `history` se devuelve con el turno del asistente agregado tal cual vino
 * (incluye bloques de thinking), para mantener el historial append-only.
 */
export async function askJSON({ system, messages, schema, effort = 'low', maxTokens = 16000 }) {
  if (!settings.apiKey) throw new TutorError('Falta tu API key de Anthropic. Ábrela en ⚙️ Ajustes.');
  const client = new Anthropic({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
  const m = modelInfo();

  const params = {
    model: m.id,
    max_tokens: maxTokens,
    system,
    messages,
    cache_control: { type: 'ephemeral' },
    output_config: { effort, ...(schema ? { format: { type: 'json_schema', schema } } : {}) },
  };
  if (m.fallback) {
    // Si un clasificador de seguridad rechaza la petición, la API la reintenta en otro modelo.
    params.betas = ['server-side-fallback-2026-07-01'];
    params.fallbacks = 'default';
  }

  let resp;
  try {
    resp = await client.beta.messages.create(params);
  } catch (err) {
    if (params.fallbacks && err instanceof Anthropic.BadRequestError && /fallback/i.test(err.message)) {
      delete params.fallbacks;
      delete params.betas;
      resp = await client.beta.messages.create(params);
    } else if (err instanceof Anthropic.AuthenticationError) {
      throw new TutorError('La API key no es válida. Revísala en ⚙️ Ajustes.');
    } else if (err instanceof Anthropic.RateLimitError) {
      throw new TutorError('Límite de uso alcanzado. Espera un momento y vuelve a intentar.');
    } else if (err instanceof Anthropic.APIConnectionError) {
      throw new TutorError('Sin conexión con la API. Revisa tu internet.');
    } else {
      throw err;
    }
  }

  const usd = trackUsage(resp.usage);
  if (resp.stop_reason === 'refusal') {
    throw new TutorError('Claude no pudo responder a esta petición. Reformula e intenta de nuevo.');
  }
  if (resp.stop_reason === 'max_tokens') {
    throw new TutorError('La respuesta quedó cortada. Intenta de nuevo.');
  }
  const text = resp.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  if (!schema) return { text, assistantContent: resp.content, usd };
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new TutorError('Respuesta inesperada del modelo. Intenta de nuevo.');
  }
  return { data, assistantContent: resp.content, usd };
}
