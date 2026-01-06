#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';
import { ASSETS_DIR, LLAMA_VISION_IMAGE_MODEL, INSTRUCT_MODEL } from './config.js';
import { connect, close, insertImage } from './services/database.js';
import { generateInfoForImage, generateStructuredMetadata } from './services/ai.js';
import { getGPSData } from './services/metadata.js';

/**
 * Validates that the image file exists
 * @param {string} imageName - Name of the image file
 * @throws {Error} If image file doesn't exist
 */
const validateImageFile = (imageName) => {
    if (!imageName) {
        throw new Error('Image name is required. Usage: <script> <image-name>');
    }

    const imagePath = join(ASSETS_DIR, imageName);
    if (!existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
    }
};

/**
 * Generates complete image document with all metadata
 * @param {string} imageName - Name of the image file
 * @returns {Promise<Object>} Complete image document
 */
const generateImageDocument = async (imageName) => {
    // Generate initial image description using vision model
    const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(imageName, LLAMA_VISION_IMAGE_MODEL);

    // Generate structured metadata using instruction model
    const { parsed, prompt: descriptionPrompt } = await generateStructuredMetadata(imageInfo);

    // Get GPS data from EXIF
    const location = await getGPSData(imageName);

    // Combine all data into final document
    return {
        file: imageName,
        location,
        ...parsed,
        raw: [
            { model: LLAMA_VISION_IMAGE_MODEL, prompt: imageInfoPrompt, response: imageInfo },
            { model: INSTRUCT_MODEL, prompt: descriptionPrompt }
        ]
    };
};

/**
 * Main processing function
 */
async function main() {
    const imageName = process.argv[2];

    try {
        // Validate input
        validateImageFile(imageName);

        // Connect to database
        await connect();

        // Generate image document
        const imageInfo = await generateImageDocument(imageName);

        // Insert into database
        await insertImage(imageInfo);

        console.log(`\n🎉 Successfully processed and stored: ${imageName}`);
    } catch (error) {
        console.error(`\n❌ Error processing image:`, error.message);
        process.exit(1);
    } finally {
        // Always close database connection
        await close();
    }
}

// Run main function
main();
