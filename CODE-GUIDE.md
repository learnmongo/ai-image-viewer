# Code Guide

If you've watched the MongoDB tutorial, this guide will help you find the code behind each section of the project.

Rather than documenting every file, this guide focuses on the parts of the repository that illustrate the core ideas.

---

# Repository Overview

The repository is organized into a few major areas.

```
app/
lib/
tools/
```

Each serves a different purpose.

| Directory | Purpose |
|-----------|---------|
| `tools/` | Offline processing and command-line tools. |
| `lib/` | Shared application logic and MongoDB query pipelines. |
| `app/` | Next.js frontend and API routes. |

If you're following the tutorial, we'll move through these in roughly that order.

---

# Image Processing

📺 Video: 4:44

Start here:

```
tools/process/
```

This is where raw images become MongoDB documents.

The processing pipeline performs several steps:

1. Load an image
2. Analyze it with a vision model
3. Generate structured metadata
4. Extract GPS information (if available)
5. Store the document in MongoDB

The nice thing about this design is that every step has a single responsibility.

---

## Configuration

The first file worth opening is:

```
tools/process/config.js
```

This controls things like:

- MongoDB connection
- Ollama models
- Voyage AI
- Processing options

Most of the project can be customized from here.

---

## AI Services

Next, look at:

```
tools/process/services/
```

You'll find the different services responsible for talking to the language models.

Instead of mixing prompts throughout the application, they're isolated into their own files, making experimentation much easier.

---

## Prompt Files

Prompt engineering is an important part of the project.

Rather than hiding prompts inside the code, they're stored as separate files.

That gives you a few advantages:

- easier iteration
- versioning
- better readability
- prompts can be stored alongside generated metadata

See:

```
prompts/
```

The accompanying `PROMPTS.md` document explains the philosophy behind them.

---

# MongoDB

📺 Video: 8:33

Once metadata has been generated, everything revolves around MongoDB.

One of my goals was to avoid scattering information across multiple systems.

Every image becomes a single MongoDB document that gradually grows as more information is added.

Open:

```
lib/image/
```

Most of the application logic starts here.

---

# MongoDB Search

MongoDB Search is the first search capability added to the application.

Look at:

```
lib/image/queries/
```

You'll find aggregation pipelines dedicated to keyword search.

Rather than placing aggregation logic directly inside API routes, the queries live in their own layer.

This makes them easier to test, easier to read, and easier to evolve.

---

# MongoDB Vector Search

📺 Video: 13:09

Embeddings are intentionally generated in a separate process.

Start with:

```
tools/process/generate-embeddings.js
```

This script:

- reads existing MongoDB documents
- creates embeddings with Voyage AI
- stores those embeddings back into MongoDB

Separating this from image analysis means embeddings can always be regenerated later using a newer model.

---

# Hybrid Search

📺 Video: 20:25

Hybrid search combines MongoDB Search with MongoDB Vector Search.

The interesting part isn't that both searches run.

The interesting part is how they're combined.

Look inside:

```
lib/image/queries/
```

You'll see pipelines using MongoDB's `$rankFusion` stage to merge the results into a single ranked list.

This is where the application starts to feel much more natural.

---

# API Routes

The Next.js API routes stay intentionally thin.

Their primary job is to:

- validate requests
- call the appropriate query
- return results

Keeping business logic inside `lib/` makes the routes easy to follow.

See:

```
app/api/
```

---

# React Components

Finally, explore:

```
app/
```

The frontend is intentionally simple.

Its purpose isn't to demonstrate React architecture.

Its purpose is to make it easy to experiment with the different search techniques.

That keeps the focus on MongoDB rather than UI complexity.

---

# Suggested Reading Order

If you're exploring the repository for the first time, I'd recommend this order:

1. README.md
2. ARCHITECTURE.md
3. tools/process/
4. MongoDB documents
5. generate-embeddings.js
6. lib/image/queries/
7. SEARCH.md
8. OLLAMA.md
9. PROMPTS.md

That mirrors the progression of the MongoDB tutorial and builds the project one concept at a time.