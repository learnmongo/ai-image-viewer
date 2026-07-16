# Prompt Engineering

One of the goals of this project wasn't simply to analyze images.

It was to build a processing pipeline that was easy to understand, easy to experiment with, and easy to improve over time.

Prompt engineering ended up being a much bigger part of that than I expected.

This document explains some of the design decisions behind the prompts and a few of the lessons I learned while building the project.

---

# Prompts Are Code

One of the biggest mindset shifts when working with LLMs is realizing that prompts deserve the same care as application code.

They evolve.

They get refactored.

They introduce bugs.

They improve over time.

Rather than hiding prompts inside source files, this project keeps them separate, versioned, and easy to modify.

That makes experimentation much easier.

---

# Separate Responsibilities

Early on, I experimented with asking a single vision model to do everything.

Analyze the image.

Generate JSON.

Produce titles.

Generate tags.

Extract colors.

Identify emotions.

It worked... sometimes.

But the results weren't nearly as consistent as I wanted.

Instead, the project eventually settled on two distinct prompts.

```
Image
   │
   ▼
Vision Prompt
   │
Natural Language Description
   │
   ▼
Instruction Prompt
   │
Structured Metadata
```

Each prompt now has one clear responsibility.

The first understands the image.

The second organizes that understanding into a predictable MongoDB document.

That separation made a much bigger difference than changing models.

---

# Structure Beats Creativity

When generating metadata, consistency is usually more valuable than creativity.

For example, these two descriptions both describe the same image.

```
A peaceful beach during sunset.
```

```
Golden sunlight reflects across a calm shoreline as gentle waves reach the sand.
```

Both are correct.

For search, though, we want predictable fields.

Titles.

Descriptions.

Tags.

Colors.

Feelings.

Summaries.

The instruction prompt focuses on creating consistent structure rather than interesting prose.

That makes the resulting MongoDB documents much easier to search.

---

# Keep Prompts Focused

Large prompts often try to solve too many problems.

Instead, I found it helpful to ask one prompt to perform one job well.

Examples include:

- Describe the image.
- Generate structured metadata.
- Create embeddings.

Breaking responsibilities apart also makes it much easier to swap individual pieces later.

---

# Store Prompt Versions

Prompt engineering is iterative.

As prompts improve, results change.

For that reason, this project stores prompt information alongside the generated metadata.

That makes it possible to understand how a document was generated and to compare results between prompt versions.

If you ever need to regenerate metadata later, having that history becomes incredibly valuable.

---

# Don't Chase The Perfect Prompt

One thing I learned while building this project is that there probably isn't a perfect prompt.

Instead, there are prompts that are better suited for a particular task.

Rather than endlessly tweaking wording, it's often more productive to improve the overall pipeline.

Changing the architecture usually had a bigger impact than changing individual sentences.

---

# Models Will Change

The prompts in this project were written for the models available at the time.

Six months from now, you may choose different models.

A year from now, they'll almost certainly be different.

That's perfectly fine.

The architecture stays the same.

Understand the data.

Structure the data.

Store the data.

Search the data.

The specific model becomes an implementation detail.

---

# Experiment

If you clone this repository, one of the first things I'd encourage you to do is experiment.

Try different models.

Rewrite the prompts.

Generate different metadata.

Compare the results.

That's one of the reasons the prompts are kept separate from the application logic.

They're meant to be explored.

---

# Final Thoughts

Prompt engineering is an important part of modern AI applications, but it isn't the entire application.

Good prompts matter.

Good architecture matters even more.

Once the metadata has been generated, the rest of the project is simply a MongoDB application built on top of well-structured documents.

That's really the bigger lesson I hope people take away from this project.
