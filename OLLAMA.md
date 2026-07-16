# Ollama

This project uses **Ollama** to run local AI models during image processing.

Running models locally makes it easy to experiment with prompts, compare different models, and process images without sending every request to a hosted API.

The overall architecture isn't tied to Ollama, though. It's simply the provider used throughout this project. You could replace it with another service while keeping the rest of the processing pipeline almost exactly the same.

---

# Why Ollama?

There are a few reasons I chose Ollama for this project.

## Easy to Experiment

Prompt engineering usually involves a lot of iteration.

You'll probably:

- tweak prompts
- change models
- process the same images several times
- compare different outputs

Running models locally makes those experiments quick and inexpensive.

---

## No Token Costs

Generating metadata for hundreds or thousands of images can become expensive if every request goes to a hosted API.

With local models you can experiment freely without thinking about token usage.

Once you're happy with the results, you could always move to a hosted provider if it better fits your application.

---

## Privacy

Some projects can't send images to external services.

Running models locally gives you another option.

Whether privacy is important depends entirely on your application, but it's nice to have that flexibility.

---

# The Two-Model Pipeline

One of the most important design decisions in this project is separating image understanding from metadata generation.

Rather than asking one model to do everything, the pipeline looks like this:

```text
Image
   │
   ▼
Vision Model
   │
Natural Language Description
   │
   ▼
Instruction Model
   │
Structured JSON
   │
   ▼
MongoDB Document
```

This approach consistently produced better results during development.

The vision model focuses on understanding the image.

The instruction model focuses on producing predictable, structured output.

Keeping those responsibilities separate also makes prompts much easier to evolve over time.

---

# Models Used

The exact models may change as new versions become available, but the overall architecture remains the same.

Configuration lives in:

```text
tools/process/config.js
```

This makes it easy to swap models without changing the rest of the processing pipeline.

---

# Where Ollama Fits

One thing worth pointing out is that Ollama is only used during processing.

Once metadata has been generated and stored in MongoDB, the application itself doesn't depend on Ollama.

Searching images only uses:

- MongoDB Search
- MongoDB Vector Search
- MongoDB aggregation pipelines

That separation keeps the runtime application lightweight.

---

# Swapping Providers

Although this project uses Ollama, the processing pipeline isn't tied to it.

The same architecture would work with providers such as:

- OpenAI
- Google Gemini
- Anthropic
- Azure OpenAI
- Other local models

The important part isn't the provider.

It's the pipeline:

1. Understand the image.
2. Generate structured metadata.
3. Store the result in MongoDB.
4. Generate embeddings.
5. Build search experiences on top of that data.

---

# Tips

After building this project, here are a few things I'd recommend.

## Separate Responsibilities

Don't ask one prompt to solve every problem.

Breaking the work into smaller, focused prompts generally produces more consistent results.

---

## Store Prompt Versions

Prompt engineering evolves over time.

Storing prompt versions alongside generated metadata makes it much easier to understand where a particular result came from and to compare outputs as your prompts improve.

---

## Keep Models Configurable

Avoid hardcoding model names throughout your application.

Keeping them in a single configuration file makes experimentation much easier.

---

## Think Beyond Images

Although this project focuses on image analysis, the same pattern works well for many other kinds of data.

The input changes.

The architecture stays remarkably similar.

---

# Additional Resources

- Ollama: https://ollama.com
- MongoDB Search: https://www.mongodb.com/products/platform/atlas-search
- MongoDB Vector Search: https://www.mongodb.com/products/platform/atlas-vector-search
- Voyage AI: https://www.voyageai.com

For a complete walkthrough of how Ollama fits into this project, watch the MongoDB tutorial:

https://www.youtube.com/watch?v=yYoxQLufWYw
