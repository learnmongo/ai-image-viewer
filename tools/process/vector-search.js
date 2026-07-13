#!/usr/bin/env node

/**
 * Demo: `$vectorSearch` on `embedding`, then a min score. 
 * 
 * Prerequisites: `embedding` on documents (`npx generate-embeddings`) and an
 * Atlas vector index on `embedding` (here: name `vector_index`).
 */

import { connect, close, getClient } from './services/database.js';
import { DB_NAME, COLLECTION } from './config.js';
import { embedText } from './services/ai/embeddings.js';

async function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.error('Usage: npx vector-search "<search text>"');
    process.exit(1);
  }

  console.log(`Query: "${query}"`);
  console.log('index: vector_index  minScore: 0.6  limit: 80  numCandidates: 200  maxPrint: 15\n');

  const queryVector = await embedText(query, {
    model: 'voyage-4',
    inputType: 'query',
  });

  await connect();
  try {
    const coll = getClient().db(DB_NAME).collection(COLLECTION);

    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector,
          numCandidates: 100,
          limit: 80,
        },
      },
      {
        $addFields: {
          vectorSearchScore: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $match: {
          vectorSearchScore: { $gte: 0.6 },
        },
      },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          file: 1,
          summary: 1,
          vectorSearchScore: 1,
        },
      },
    ];

    const rows = await coll.aggregate(pipeline).toArray();

    if (rows.length === 0) {
      console.log(
        'No results above the score min.'
      );
      return;
    }

    rows.forEach((doc, i) => {
      const score =
        typeof doc.vectorSearchScore === 'number'
          ? doc.vectorSearchScore.toFixed(4)
          : String(doc.vectorSearchScore);
      const oneLine =
        (doc.summary && String(doc.summary).replace(/\s+/g, ' ').slice(0, 120)) || '';
      console.log(`${i + 1}. [${score}] ${doc.title || '(no title)'}`);
      if (doc.file) console.log(`   file: ${doc.file}`);
      if (oneLine) console.log(`   ${oneLine}${doc.summary && doc.summary.length > 120 ? '…' : ''}`);
      console.log('');
    });
  } finally {
    await close();
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
