/**
 * Voyage AI embeddings helper.
 *
 * Creates vector embeddings for text using Voyage AI.
 * See MongoDB Vector Search — create embeddings: https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
 */

import { VoyageAIClient } from 'voyageai';

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });
const DEFAULT_MODEL = process.env.VOYAGE_EMBED_MODEL || 'voyage-4';
const DEFAULT_INPUT_TYPE = process.env.VOYAGE_EMBED_INPUT_TYPE || 'document';

/**
 * Create an embedding for a text string.
 *
 * @param {string} text - The text to embed
 * @param {{ model?: string, inputType?: 'document' | 'query' }} options
 * @returns {Promise<number[]>} The embedding vector
 */
export const embedText = async (text, options = {}) => {
  const result = await client.embed({
    input: [text],
    model: options.model || DEFAULT_MODEL,
    inputType: options.inputType || DEFAULT_INPUT_TYPE,
  });

  return result.data[0].embedding;
};
