#!/usr/bin/env node

/**
 * Demo: keyword search with Atlas `$search` (same idea as `lib/image/queries/search.ts`).
 * No vectors — just `text` on the paths your Search index maps (here: title, description,
 * summary, tags). Index name must match Atlas (here: `ix_text`, same default as the app).
 */

import { connect, close, getClient } from './services/database.js';
import { DB_NAME, COLLECTION } from './config.js';

async function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.error('Usage: npx text-search "<search text>"');
    process.exit(1);
  }

  console.log(`Query: "${query}"`);
  console.log('index: ix_text  paths: title, description, summary, tags  limit: 15\n');

  await connect();
  try {
    const coll = getClient().db(DB_NAME).collection(COLLECTION);

    const pipeline = [
      {
        $search: {
          index: 'ix_text',
          text: {
            query,
            path: ['title', 'description', 'summary', 'tags'],
          },
        },
      },
      { $addFields: { score: { $meta: 'searchScore' } } },
      { $sort: { score: -1, _id: -1 } },
      { $limit: 15 },
      {
        $project: {
          title: 1,
          file: 1,
          summary: 1,
          score: 1,
        },
      },
    ];

    const rows = await coll.aggregate(pipeline).toArray();

    if (rows.length === 0) {
      console.log('No results. Check Atlas Search index name and mapped fields match this pipeline.');
      return;
    }

    rows.forEach((doc, i) => {
      const score =
        typeof doc.score === 'number' ? doc.score.toFixed(4) : String(doc.score);
      const oneLine =
        (doc.summary && String(doc.summary).replace(/\s+/g, ' ').slice(0, 120)) || '';
      console.log(`${i + 1}. [score: ${score}] ${doc.title || '(no title)'}`);
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
