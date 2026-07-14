# Prompts

The project uses two versioned prompts rather than one model call.

- [`../tools/process/services/ai/prompts/vision.js`](../tools/process/services/ai/prompts/vision.js) controls image analysis
- [`../tools/process/services/ai/prompts/instruct.js`](../tools/process/services/ai/prompts/instruct.js) converts that analysis into JSON

## Vision prompt

The vision prompt asks for factual observation while still producing useful, readable metadata.

Its tasks include:

- A short title
- A direct description
- A longer summary
- Feelings
- Dominant colors
- Tags

The prompt also contains constraints such as:

```text
- Separate facts from guesses.
- DO NOT use phrases like "this image" or "the photo"
- NEVER include hex colors in the description.
```

Source: [`../tools/process/services/ai/prompts/vision.js`](../tools/process/services/ai/prompts/vision.js)

The prompt version is stored as a constant:

```js
export const VERSION = '2.1.1';
```

## Instruction prompt

The second prompt receives the vision model's text and returns a strict schema:

```json
{
  "title": "...",
  "description": "...",
  "summary": "...",
  "feelings": ["...", "..."],
  "hues": ["...", "..."],
  "colors": ["#XXXXXX", "#XXXXXX"],
  "tags": ["...", "..."]
}
```

Source: [`../tools/process/services/ai/prompts/instruct.js`](../tools/process/services/ai/prompts/instruct.js)

Important constraints include:

```text
- Do NOT add new facts.
- Preserve uncertainty exactly as stated.
- Return only valid JSON.
```

The second model is not supposed to reinterpret the image. It should normalize the first model's analysis into fields the application can query and display.

## Prompt version tracking

Both version numbers are imported into [`../tools/process/process.js`](../tools/process/process.js):

```js
import { VISION_VERSION, INSTRUCT_VERSION } from './services/ai/prompts/index.js';
```

They are then stored with each model trace:

```js
{
  model: LLAMA_VISION_IMAGE_MODEL,
  version: VISION_VERSION,
  prompt: imageInfoPrompt,
  response: imageInfo,
}
```

This provides context when prompts or models change over time.

## Inspecting prompts in the viewer

The application supports both the newer `prompt_debug` array and the older `raw` array:

```ts
export function getModelResponseEntries(
  doc: Pick<ImageDoc, 'raw' | 'prompt_debug'>,
): RawModelResponse[] {
  const { prompt_debug: debug, raw } = doc;
  if (debug != null && debug.length > 0) return debug;
  return raw ?? [];
}
```

Source: [`../types/image.ts`](../types/image.ts)

[`../components/ModelResponsesModal.tsx`](../components/ModelResponsesModal.tsx) displays the response and prompt in separate model tabs.

## Editing prompts

When changing a prompt:

1. Update the prompt text
2. Increment its `VERSION`
3. Process a small set of representative images
4. Compare the stored prompt and response traces
5. Review both factual accuracy and JSON consistency

Because model output is non-deterministic, one result is not enough to evaluate a prompt change.

## Why keep the prompts separate?

The separation makes experimentation easier:

- Improve image observation without changing the JSON schema
- Improve schema compliance without repeating image analysis
- Swap one model without replacing both
- Compare failures from the vision and formatting stages independently
