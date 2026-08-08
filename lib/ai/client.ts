import 'server-only';
import { GoogleGenAI } from '@google/genai';

/**
 * Server-side Gemini client.
 *
 * The key is read from GEMINI_API_KEY (server-only). The legacy
 * NEXT_PUBLIC_GEMINI_API_KEY is accepted as a fallback so existing deploys keep
 * working, but it should be removed — anything NEXT_PUBLIC_ is shipped to the
 * browser and can be lifted straight out of the bundle.
 *
 * PHI handling: the public Gemini API (this client) is not covered by a
 * Google HIPAA BAA — only Vertex AI is, which this is not. Every route that
 * calls into this client must never include a patient name or other
 * identifier in the prompt. This is enforced at each call site (the field is
 * destructured and discarded before the prompt is built), not here, because
 * this module has no way to know what a given caller considers identifying.
 * See the route handlers under app/api/ai for the enforcement points, and
 * lib/ai/api.ts for how a personalised appeal letter is still produced
 * without ever sending the real name over the network.
 */
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const isAiConfigured = Boolean(apiKey);

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!apiKey) {
    throw new AiError('AI is not configured on this server.', 503);
  }
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

/**
 * Models are tried in order. gemini-2.0-* is deliberately absent: it has zero
 * free-tier quota on this project and returns 429 for every request.
 */
const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-flash-latest'];

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'AiError';
    this.status = status;
  }
}

function isRetryable(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err);
  return /429|RESOURCE_EXHAUSTED|503|UNAVAILABLE|500|INTERNAL|quota/i.test(msg);
}

/**
 * Runs a structured-output generation and returns parsed JSON.
 * Falls through MODEL_CHAIN on quota/availability errors.
 */
export async function generateStructured<T>(opts: {
  systemInstruction: string;
  prompt: string;
  schema: Record<string, unknown>;
  temperature?: number;
}): Promise<T> {
  const ai = getClient();
  let lastErr: unknown;

  for (const model of MODEL_CHAIN) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: opts.prompt,
        config: {
          systemInstruction: opts.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: opts.schema as never,
          temperature: opts.temperature ?? 0.2,
        },
      });

      const text = response.text;
      if (!text) throw new AiError('Model returned an empty response.', 502);

      try {
        return JSON.parse(text) as T;
      } catch {
        throw new AiError('Model returned malformed JSON.', 502);
      }
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err)) break;
    }
  }

  if (lastErr instanceof AiError) throw lastErr;
  const msg = String((lastErr as Error)?.message ?? lastErr);
  if (/429|quota|RESOURCE_EXHAUSTED/i.test(msg)) {
    throw new AiError('AI quota exceeded. Please try again shortly.', 429);
  }
  throw new AiError('The AI service is temporarily unavailable.', 502);
}

/** Plain-text generation, for long-form output like appeal letters. */
export async function generateText(opts: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
}): Promise<string> {
  const ai = getClient();
  let lastErr: unknown;

  for (const model of MODEL_CHAIN) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: opts.prompt,
        config: {
          systemInstruction: opts.systemInstruction,
          temperature: opts.temperature ?? 0.4,
        },
      });
      const text = response.text;
      if (!text) throw new AiError('Model returned an empty response.', 502);
      return text.trim();
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err)) break;
    }
  }

  if (lastErr instanceof AiError) throw lastErr;
  const msg = String((lastErr as Error)?.message ?? lastErr);
  if (/429|quota|RESOURCE_EXHAUSTED/i.test(msg)) {
    throw new AiError('AI quota exceeded. Please try again shortly.', 429);
  }
  throw new AiError('The AI service is temporarily unavailable.', 502);
}
