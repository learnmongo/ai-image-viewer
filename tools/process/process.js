#!/usr/bin/env node

import { existsSync } from 'fs';
import { join, basename } from 'path';
import { ASSETS_DIR, INSTRUCT_MODEL, LLAMA_VISION_IMAGE_MODEL } from './config.js';
import { connect, close, insertImage } from './services/database.js';
import { generateInfoForImage, generateStructuredMetadata } from './services/ai/index.js';
import { getGPSData } from './services/metadata.js';

const usage = () => `${basename(process.argv[1] || 'process')} <image-name>`;

const assertImageExists = (imageName) => {
  if (!imageName) throw new Error(`Image name is required. Usage: ${usage()}`);
  const imagePath = join(ASSETS_DIR, imageName);
  if (!existsSync(imagePath)) throw new Error(`Image file not found: ${imagePath}`);
};

const buildImageDoc = async (imageName) => {
  const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(
    imageName,
    LLAMA_VISION_IMAGE_MODEL
  );

  const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);
  const location = await getGPSData(imageName);

  return {
    file: imageName,
    location,
    ...parsed,
    raw: [
      { model: LLAMA_VISION_IMAGE_MODEL, prompt: imageInfoPrompt, response: imageInfo },
      { model: INSTRUCT_MODEL, prompt: descriptionPrompt },
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
