# Search

Search is really the heart of this project.

Rather than jumping straight to vector search, the application intentionally builds the search experience one step at a time.

1. MongoDB Search
2. MongoDB Vector Search
3. Hybrid Search

Each step adds another capability while building on the previous one.

That progression mirrors how many real applications evolve over time.

---

# Step 1: MongoDB Search

📺 Video: https://www.youtube.com/watch?v=yYoxQLufWYw&t=513s

The first search capability uses **MongoDB Search**.

After each image has been analyzed, the generated metadata is stored as a MongoDB document.

Fields such as:

- title
- description
- summary
- tags

are indexed using MongoDB Search.

Searching for:

```text
beach
```

works exactly as you would expect.

Documents containing those words receive the highest ranking.

MongoDB Search is extremely fast and works well whenever users already know the words they're looking for.

---

## Why Start Here?

One thing I wanted to emphasize throughout the project is that vector search doesn't replace traditional search.

Keyword search is still incredibly valuable.

It's:

- fast
- predictable
- explainable
- excellent for exact matches

For many applications, this may be all you need.

Vector search becomes interesting when users don't know the exact words.

---

# Step 2: MongoDB Vector Search

📺 Video: https://www.youtube.com/watch?v=yYoxQLufWYw&t=789s

Traditional search compares words.

Vector search compares meaning.

Instead of asking:

```text
beach
```

try searching for:

```text
ocean
```

The word *ocean* may never appear anywhere inside the MongoDB document.

Even so, MongoDB Vector Search can still identify relevant images because both the query and the document have been converted into vector embeddings.

Those embeddings capture the overall meaning of the text rather than the exact words.

---

## Generating Embeddings

Embeddings are intentionally generated as a separate processing step.

See:

```
tools/process/generate-embeddings.js
```

Separating embeddings from image analysis makes the system much easier to maintain.

If a better embedding model becomes available tomorrow, there's no need to analyze every image again.

Simply regenerate the embeddings.

---

## Why Voyage AI?

This project uses Voyage AI because it provides high-quality embedding models that work well for semantic search.

The architecture itself isn't tied to Voyage AI.

The same workflow would work with any embedding provider capable of generating compatible vectors.

---

# Step 3: Hybrid Search

📺 Video: https://www.youtube.com/watch?v=yYoxQLufWYw&t=1225s

Keyword search is excellent.

Vector search is excellent.

Neither is perfect on its own.

Hybrid search combines both approaches.

MongoDB's `$rankFusion` stage merges the results from multiple search pipelines into a single ranked result set.

Instead of choosing between keyword search and vector search, the application benefits from both.

This tends to produce results that feel much more natural to users.

---

## Why Hybrid Works So Well

Imagine searching for:

```text
wild flying animals
```

Keyword search might strongly match:

- wild
- animals

Vector search might recognize:

- birds
- hawks
- eagles
- wildlife

Combining both produces results that neither technique could achieve on its own.

---

# Performance Considerations

One topic covered in the tutorial is tuning vector search.

There isn't a single "correct" configuration.

Instead, you'll typically experiment with values such as:

- `numCandidates`
- similarity thresholds
- result limits

These settings affect both recall and performance.

Finding the right balance depends on your own data and application.

---

# Why The Search Logic Lives In `lib/`

One design decision that may not be immediately obvious is why the aggregation pipelines live in:

```
lib/image/queries/
```

instead of inside the API routes.

Keeping MongoDB queries in their own layer has several advantages.

- API routes remain small.
- Aggregation pipelines become easier to read.
- Search logic can evolve independently.
- Multiple routes can reuse the same queries.

As the application grows, this separation becomes increasingly valuable.

---

# Search Progression

One of my favorite aspects of this project is that each search technique builds naturally on the previous one.

```
MongoDB Search
        │
        ▼
MongoDB Vector Search
        │
        ▼
Hybrid Search
```

Nothing gets thrown away.

Each step simply adds another capability.

That makes the application easy to understand while demonstrating how modern search systems are often built.

---

# Continue Exploring

Want to learn more?

- **ARCHITECTURE.md** explains how the overall processing pipeline fits together.
- **CODE-GUIDE.md** walks through the repository.
- **OLLAMA.md** covers local model setup.
- **PROMPTS.md** explains how prompt engineering is used throughout the project.