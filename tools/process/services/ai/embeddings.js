/**
 * Voyage AI embeddings helper.
 * 
 * Creates vector embeddings for text using Voyage AI.
 * See: https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
 */

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const DEFAULT_MODEL = process.env.VOYAGE_EMBED_MODEL || 'voyage-3.5';
const DEFAULT_INPUT_TYPE = process.env.VOYAGE_EMBED_INPUT_TYPE || 'document';

/**
 * Create an embedding for a text string.
 * 
 * @param {string} text - The text to embed
 * @param {{ model?: string, inputType?: 'document' | 'query' }} options
 * @returns {Promise<number[]>} The embedding vector
 */
export const embedText = async (text, options = {}) => {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: [text],
      model: options.model || DEFAULT_MODEL,
      input_type: options.inputType || DEFAULT_INPUT_TYPE,
    }),
  });

  const json = await res.json();
  return json.data[0].embedding;
};
