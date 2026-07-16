# Project Architecture

One of the goals of this project was to build an AI-powered search application without introducing unnecessary complexity.

There are certainly many ways to build a system like this. You could split metadata into one database, vectors into another, and search into a third service.

Instead, this project intentionally keeps everything centered around MongoDB.

Every image ultimately becomes a single MongoDB document that grows as the processing pipeline enriches it.

---

## High-Level Architecture

```text
Images
   │
   ▼
Vision Model (Ollama)
   │
   ▼
Image Description
   │
   ▼
Instruction Model
   │
   ▼
Structured Metadata
   │
   ▼
MongoDB Document
   ├──────────────┐
   │              │
   ▼              ▼
MongoDB Search   Voyage AI Embeddings
   │              │
   └──────┬───────┘
          ▼
     Hybrid Search
          │
          ▼
     Next.js Application
```

Rather than thinking about this as "an image search application," it helps to think of it as a data enrichment pipeline.

Every stage adds more useful information to the same MongoDB document.

That enriched document then becomes the foundation for the application.

---

## Step 1: Understanding the Image

The first job is simply understanding what's inside the image.

A locally running vision model analyzes each image and produces a natural language description.

For example, rather than immediately trying to generate JSON, it might describe:

> A rocky coastline during sunset with waves crashing against the shore.

At this point we simply want a good description.

We're not worried about document structure yet.

🎥 **Video:** System Architecture & Local LLM Processing (2:05)

---

## Step 2: Creating Structured Metadata

Natural language is great for people.

Applications generally work better with structured data.

The second model transforms the vision model's response into a consistent JSON document containing fields like:

- title
- description
- summary
- tags
- colors
- feelings
- location hints

This separation turned out to be one of the best architectural decisions in the project.

Vision models are excellent at understanding images.

Instruction models are much better at producing predictable structured output.

Keeping those responsibilities separate makes prompts easier to evolve over time.

🎥 **Video:** Generating Structured Metadata JSON (3:19)

---

## Step 3: Storing Everything in MongoDB

Once the metadata has been generated, the application stores everything in a MongoDB document.

Each document becomes the single source of truth for that image.

As the application evolves, additional fields can simply be added to the document.

Examples include:

- AI-generated metadata
- GPS information extracted from EXIF
- Prompt versions
- Model names
- Embeddings
- Search indexes

One of the nice things about MongoDB's document model is that it naturally accommodates this kind of incremental enrichment.

---

## Step 4: MongoDB Search

With structured metadata stored, the application can immediately support traditional keyword search.

MongoDB Search indexes fields like:

- title
- description
- summary
- tags

Searching for:

```text
beach
```

returns documents containing those words.

Keyword search is extremely fast and extremely precise.

🎥 **Video:** Setting Up Built-In Traditional Text Search (8:33)

---

## Step 5: MongoDB Vector Search

Keyword search only finds words.

Sometimes users search for ideas.

Instead of asking:

```
beach
```

they search for:

```
ocean
```

Even if that word never appears anywhere in the metadata, vector embeddings allow MongoDB Vector Search to compare the meaning of the query with the meaning of each document.

That dramatically expands what users can discover.

Embeddings are intentionally generated in a separate processing step so they can be regenerated later without repeating image analysis.

🎥 **Video:** Creating a Vector Search Index (13:09)

---

## Step 6: Hybrid Search

Each search technique has strengths.

MongoDB Search provides precision.

MongoDB Vector Search provides semantic understanding.

Hybrid search combines both using MongoDB's `$rankFusion` stage.

For many applications, this produces the best overall experience because users benefit from both literal keyword matching and semantic similarity.

🎥 **Video:** Implementing Hybrid Search with Rank Fusion (20:25)

---

# Why This Architecture?

There are a few design decisions that shaped this project.

## Everything Starts With Documents

Rather than treating vectors, metadata, and search as separate systems, everything starts with a MongoDB document.

Every processing step simply enriches that document.

This keeps the architecture surprisingly easy to reason about.

---

## AI Is Part Of The Pipeline

The LLM isn't the application.

It's one stage in a processing pipeline.

Once metadata has been generated, the application behaves like any other MongoDB-backed application.

---

## Embeddings Are Disposable

One important idea is that embeddings can always be regenerated.

That's why they aren't created during the initial image analysis.

Keeping them separate makes it easy to experiment with newer embedding models later.

---

## The Search Experience Evolves

One of the themes throughout the video is that search doesn't become more complicated overnight.

Instead, we gradually build:

1. MongoDB Search
2. MongoDB Vector Search
3. Hybrid Search

Each step adds another capability while building on the previous one.

---

# Applying These Ideas Elsewhere

Although this project focuses on images, the same architecture works well for many other types of data.

Examples include:

- Product catalogs
- Support tickets
- Technical documentation
- Research papers
- Knowledge bases
- RAG applications

The processing pipeline changes slightly.

The overall architecture stays remarkably similar.

Once you understand that pattern, you can apply it almost anywhere AI-generated metadata and search need to work together.
