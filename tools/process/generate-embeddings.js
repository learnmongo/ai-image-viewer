#!/usr/bin/env node

/**
 * Generate embeddings for images that don't have them yet.
 * 
 * Usage:
 *   npx generate-embeddings
 *   npx generate-embeddings --limit 50
 * 
 * See: https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
 */

import { connect, close, getClient } from './services/database.js';
import { DB_NAME, COLLECTION } from './config.js';
import { embedText } from './services/ai/embeddings.js';

// Parse --limit argument
const getLimit = () => {
  const idx = process.argv.indexOf('--limit');
  return idx !== -1 ? Number(process.argv[idx + 1]) : null;
};

// Pick the best text field for embedding
const pickText = (doc) => doc?.summary || doc?.description || doc?.title || '';

async function main() {
  const limit = getLimit();
  await connect();

  const db = getClient().db(DB_NAME);
  const images = db.collection(COLLECTION);

  // Find documents without embeddings
  const query = { embedding: { $exists: false } };
  const cursor = images.find(query, {
    projection: { _id: 1, title: 1, description: 1, summary: 1 },
    ...(limit && { limit }),
  });

  const model = process.env.VOYAGE_EMBED_MODEL || 'voyage-3.5';
  const inputType = process.env.VOYAGE_EMBED_INPUT_TYPE || 'document';
  let count = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const text = pickText(doc);
    if (!text) continue;

    const embedding = await embedText(text, { model, inputType });
    await images.updateOne(
      { _id: doc._id },
      { $set: { embedding, embedding_model: model } }
    );

    count++;
    console.log(`✅ ${doc._id}`);
  }

  console.log(`\nDone! Embedded ${count} documents.`);
  await close();
}

main();
