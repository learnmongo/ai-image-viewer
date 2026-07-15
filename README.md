# AI Image Viewer

Turn a folder of ordinary images into an AI-powered search application using **MongoDB Search**, **MongoDB Vector Search**, **Ollama**, **Voyage AI**, and **Next.js**.

Most operating systems still rely heavily on filenames when searching images. Once your collection grows into hundreds or thousands of photos, finding exactly what you're looking for becomes surprisingly difficult.

This project explores a different approach.

Instead of searching filenames, we use a vision model to understand each image, generate structured metadata, store everything in MongoDB, and layer increasingly capable search techniques on top of that data.

By the end, we'll have an application that can search both **literal words** and **meaning**, all while keeping the architecture surprisingly simple.

---

# Start Here

If you'd rather click around before looking at the code, start with the live example. Then come back and we'll build it together.

### 🌐 Live Example

https://images.seemongo.com

---

### 🎥 Complete Tutorial

This repository accompanies the MongoDB tutorial:

**Building an AI-Powered Image Search Application with MongoDB**

https://www.youtube.com/watch?v=yYoxQLufWYw

---

### 💻 Source Code

https://github.com/learnmongo/ai-image-viewer

---

## Who Is This For?

This project is intended for developers interested in modern search applications and practical AI techniques.

You'll probably enjoy it if you're interested in:

- MongoDB Search
- MongoDB Vector Search
- Hybrid Search
- AI application development
- Local LLMs with Ollama
- Embeddings and semantic search
- Next.js

The application itself intentionally stays fairly small so we can focus on understanding the architecture behind it.

---

# What You'll Build

Starting with nothing more than a folder of images, you'll build a complete search application capable of understanding what's actually inside each image.

We'll build the search experience one layer at a time.

## Step 1: MongoDB Search

Search for:

```text
beach
```

MongoDB Search looks across titles, descriptions, summaries, tags, and other metadata to quickly find documents containing those keywords.

---

## Step 2: MongoDB Vector Search

Now search for:

```text
ocean
```

Even if the word *ocean* never appears anywhere in a document, MongoDB Vector Search can still return relevant images because it compares meaning instead of exact words.

---

## Step 3: Hybrid Search

Finally, combine both approaches.

```text
wild flying animals
```

MongoDB Search contributes precise keyword matches.

MongoDB Vector Search contributes semantic understanding.

Using MongoDB's `$rankFusion` stage, we combine both approaches into a single search experience that feels much more natural.

---

# Project Architecture

One of the goals of this project was to keep the overall architecture simple.

Everything revolves around a single MongoDB document.

```text
Images
   │
   ▼
Vision Model (Ollama)
   │
   ▼
Structured Metadata
   │
   ▼
MongoDB Documents
   ├── MongoDB Search
   └── Vector Embeddings
            │
            ▼
       Hybrid Search
            │
            ▼
      Next.js Application
```

Rather than introducing multiple databases or external search systems, MongoDB becomes the central source of truth for the application.

Metadata.

Embeddings.

Search indexes.

Everything lives together.

That simplicity is one of my favorite parts of this architecture.

---

# Why It's Built This Way

As the project grew, a few design decisions ended up making a big difference.

## Two LLMs Are Better Than One

Rather than asking a vision model to produce the final MongoDB document directly, the project separates those responsibilities.

The vision model focuses on understanding the image.

A second instruction model transforms that understanding into structured JSON.

This makes prompts easier to iterate on and produces much more consistent MongoDB documents.

---

## Embeddings Are Generated Separately

Embeddings are generated in their own processing step.

That means they can be regenerated later without analyzing every image again.

It also makes experimenting with different embedding models much easier.

---

## Everything Lives in One MongoDB Document

Each image becomes a single MongoDB document containing:

- Structured metadata
- Titles
- Descriptions
- Tags
- Colors
- Feelings
- Prompt history
- Model information
- Embeddings
- Location data (when available)

As the application grows, the document grows with it.

---

## Hybrid Search Gives You The Best Of Both Worlds

Keyword search is incredibly precise.

Vector search understands meaning.

Hybrid search combines both.

For many real-world applications, that's the experience users are actually looking for.

---

# Repository Guide

If you're exploring the code after watching the video, these are the best places to start.

| Location | Purpose |
|----------|---------|
| `tools/process/` | Image processing pipeline, Ollama integration, metadata generation, and embedding tools. |
| `lib/image/queries/` | MongoDB aggregation pipelines for MongoDB Search, Vector Search, and Hybrid Search. |
| `app/api/` | API routes connecting the frontend to MongoDB. |
| `app/` | Next.js application and user interface. |

## Explore the Project

The README gives you the high-level overview. The documents below take a deeper look at individual parts of the project.

| Guide | Description |
|-------|-------------|
| 📖 [ARCHITECTURE.md](ARCHITECTURE.md) | Understand the overall system, the processing pipeline, and why the project is structured this way. |
| 🧭 [CODE-GUIDE.md](CODE-GUIDE.md) | A guided tour of the repository and where to find the code shown in the tutorial. |
| 🔍 [SEARCH.md](SEARCH.md) | Learn how MongoDB Search, MongoDB Vector Search, and Hybrid Search are implemented. |
| 🤖 [OLLAMA.md](OLLAMA.md) | Learn how Ollama fits into the processing pipeline and how to swap in other providers. |
| 💬 [PROMPTS.md](PROMPTS.md) | Read about the prompt engineering decisions and lessons learned while building the project. |

---

# Video Guide

If you're following along with the tutorial, these sections map directly to the repository.

| Video Section | Repository |
|---------------|------------|
| System Architecture | `ARCHITECTURE.md` |
| Image Processing | `tools/process/` |
| MongoDB Search | `SEARCH.md` |
| MongoDB Vector Search | `generate-embeddings.js` |
| Hybrid Search | `lib/image/queries/` |

---

# Where To Go Next

Image search is really just the beginning.

The same architecture can be applied to:

- Documents
- Knowledge bases
- Product catalogs
- Support tickets
- Internal tools
- Retrieval-Augmented Generation (RAG)
- Recommendation systems

Once your data has been enriched with AI and stored in MongoDB, you can continue building on top of it without introducing additional systems.

That's what makes this pattern so powerful.

---

## Learn More

- 🌐 LearnMongo: https://learnmongo.com
- 🎥 MongoDB Tutorial: https://www.youtube.com/watch?v=yYoxQLufWYw
- 💻 GitHub Repository: https://github.com/learnmongo/ai-image-viewer

If you build something based on this project, or take it in a different direction, I'd genuinely love to see it.