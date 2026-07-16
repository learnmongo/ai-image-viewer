/**
 * Embed a search query for `$vectorSearch` / hybrid search.
 * Uses Voyage `input_type: "query"` vs `"document"` for corpus text (retrieval best practice).
 *
 * @see https://docs.voyageai.com/docs/embeddings (input_type)
 */

const VOYAGE_EMBEDDINGS_URL = 'https://api.voyageai.com/v1/embeddings';

export async function embedSearchQuery(text: string, model: string): Promise<number[]> {
  const res = await fetch(VOYAGE_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model,
      input_type: 'query',
    }),
  });
  const { data } = await res.json();
  return data[0].embedding;
}
