#!/usr/bin/env node

import { existsSync } from 'fs';
import { join, basename } from 'path';
import { ASSETS_DIR, INSTRUCT_MODEL, LLAMA_VISION_IMAGE_MODEL } from './config.js';
import { connect, close, insertImage } from './services/database.js';
import { generateInfoForImage, generateStructuredMetadata } from './services/ai/index.js';
import { VISION_VERSION, INSTRUCT_VERSION } from './services/ai/prompts/index.js';
import { getGPSData } from './services/metadata.js';

const usage = () => `${basename(process.argv[1] || 'process')} <image-name>`;

const assertImageExists = (imageName) => {
  if (!imageName) throw new Error(`Image name is required. Usage: ${usage()}`);
  const imagePath = join(ASSETS_DIR, imageName);
  if (!existsSync(imagePath)) throw new Error(`Image file not found: ${imagePath}`);
};

const buildImageDoc = async (imageName) => {
  // First: Use Llama Vision to anylize image
  const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(
    imageName,
    LLAMA_VISION_IMAGE_MODEL
  );

  // Second: Make the output structured using Mistral Instruct
  const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);
  
  const location = await getGPSData(imageName);

  return {
    ...parsed,
    file: imageName,
    location,
    prompt_debug: [
       {
        model: LLAMA_VISION_IMAGE_MODEL,
        version: VISION_VERSION,
        prompt: imageInfoPrompt,
        response: imageInfo,
      },
      {
        model: INSTRUCT_MODEL,
        version: INSTRUCT_VERSION,
        prompt: descriptionPrompt,
        response: parsed,
      },
    ],
  };
};

async function main() {
  const imageName = process.argv[2];
  assertImageExists(imageName);

  await connect();
  try {
    const doc = await buildImageDoc(imageName);
    await insertImage(doc);
    console.log(`Stored: ${imageName}`);
  } finally {
    await close();
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
