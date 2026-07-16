#!/usr/bin/env node

/**
 * Generate embeddings for images that don't have them yet.
 *
 * Usage:
 *   npx generate-embeddings
 *   npx generate-embeddings --limit 50
 *
 * See MongoDB Vector Search — create embeddings: https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
 */

import { COLLECTION, DB_NAME, VOYAGE_EMBED_INPUT_TYPE, VOYAGE_EMBED_MODEL } from './config.js';
import { embedText } from './services/ai/embeddings.js';
import { close, connect, getClient } from './services/database.js';

// Parse --limit argument
const getLimit = () => {
  const idx = process.argv.indexOf('--limit');
  return idx !== -1 ? Number(process.argv[idx + 1]) : null;
};

// Combine all text fields for embedding
const buildText = (doc) => {
  const parts = [doc?.title, doc?.description, doc?.summary, ...(doc?.tags || [])].filter(Boolean);

  return parts.join(' ');
};

async function main() {
  const limit = getLimit();
  await connect();

  const db = getClient().db(DB_NAME);
  const images = db.collection(COLLECTION);

  // Find documents without embeddings
  const query = { embedding: { $exists: false } };
  const cursor = images.find(query, {
    projection: { _id: 1, title: 1, description: 1, summary: 1, tags: 1 },
    ...(limit && { limit }),
  });

  const model = VOYAGE_EMBED_MODEL;
  const inputType = VOYAGE_EMBED_INPUT_TYPE;
  let count = 0;

  for await (const doc of cursor) {
    const text = buildText(doc);
    if (!text) continue;

    const embedding = await embedText(text, { model, inputType });

    await images.updateOne(
      { _id: doc._id },
      {
        $set: {
          embedding,
          embedding_model: model,
          embedding_date: new Date(),
        },
      },
    );

    count++;
    console.log(`✅ [${doc._id}] ${doc.title}`);
  }

  console.log(`\nDone! Embedded ${count} documents.`);
  await close();
}

main();
