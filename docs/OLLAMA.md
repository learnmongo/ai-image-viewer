# Using Ollama

This project uses Ollama to run the image-analysis models locally.

The specific models may change over time. The important pattern remains the same:

1. Use a vision-capable model to understand the image
2. Use an instruction model to convert that response into structured metadata
3. Store the result as a MongoDB document

Ollama is useful here because it makes prompt experimentation local and inexpensive. The rest of the architecture does not depend on Ollama. A hosted provider could replace either model pass without changing the MongoDB document or search layers.

## Install Ollama

Use the official Ollama download page:

- [Download Ollama](https://ollama.com/download)

Ollama provides installers for macOS, Windows, and Linux.

## Models used by this project

The defaults are defined in [`../tools/process/config.js`](../tools/process/config.js):

```js
export const LLAMA_VISION_IMAGE_MODEL = process.env.LLAMA_VISION_IMAGE_MODEL || 'llama3.2-vision:11b';
export const INSTRUCT_MODEL = process.env.INSTRUCT_MODEL || 'mistral:7b-instruct';
```

Pull the default models:

```bash
ollama pull llama3.2-vision:11b
ollama pull mistral:7b-instruct
```

The Llama 3.2 Vision model is designed for tasks such as visual recognition, image reasoning, and captioning. See the [Ollama model page](https://ollama.com/library/llama3.2-vision).

## Confirm Ollama is working

Run a model directly:

```bash
ollama run mistral:7b-instruct
```

You can also list installed models:

```bash
ollama list
```

## How the project calls Ollama

The vision pass sends an image path in the message payload:

```js
await ollama.chat({
  model: model,
  messages: [{
    role: 'user',
    content: processingPrompt,
    images: [imagePath]
  }]
})
```

Source: [`../tools/process/services/ai/vision.js`](../tools/process/services/ai/vision.js)

The instruction pass sends only text:

```js
await ollama.chat({
  model: INSTRUCT_MODEL,
  messages: [{
    role: 'user',
    content: descriptionPrompt,
  }]
})
```

Source: [`../tools/process/services/ai/instruct.js`](../tools/process/services/ai/instruct.js)

## Why two passes?

The vision model is asked to observe and describe. The instruction model is asked to preserve those facts while formatting them into a known JSON schema.

This approach avoids asking one model call to be equally good at:

- Looking closely at the image
- Writing engaging descriptions
- Following strict formatting rules
- Returning parseable JSON

The first response can also be retained for debugging and prompt comparison.

## Change the models

Set either value in [`../tools/process/.env`](../tools/process/.env.example):

```env
LLAMA_VISION_IMAGE_MODEL=llama3.2-vision:11b
INSTRUCT_MODEL=mistral:7b-instruct
```

The rest of the processing code reads these values from [`../tools/process/config.js`](../tools/process/config.js).

When changing models, review the generated metadata before processing a large collection. Different models may interpret prompt instructions and JSON formatting differently.

## Process an image

Images are resolved from the repository's `assets/` directory.

```bash
cd tools/process
npm install
npx process 001.jpg
```

The processing script:

1. Confirms the image exists
2. Sends it to the vision model
3. Sends the response to the instruction model
4. Extracts EXIF GPS metadata
5. Inserts the combined document into MongoDB

## Hosted alternatives

The same architecture can be implemented with hosted multimodal and instruction models. The main integration points to replace are:

- [`../tools/process/services/ai/vision.js`](../tools/process/services/ai/vision.js)
- [`../tools/process/services/ai/instruct.js`](../tools/process/services/ai/instruct.js)

The MongoDB persistence, embedding generation, query layer, and Next.js application do not need to know which provider generated the metadata.

## Practical notes

- Start with a small set of images while refining prompts
- Keep model names and prompt versions with the generated document
- Expect non-deterministic output between runs
- Review generated metadata before using it in a production workflow
- Separate image understanding from strict output formatting

## Resources

- [Ollama download](https://ollama.com/download)
- [Ollama GitHub repository](https://github.com/ollama/ollama)
- [Llama 3.2 Vision on Ollama](https://ollama.com/library/llama3.2-vision)
