import ollama from 'ollama';
import { join } from 'path';
import { ASSETS_DIR } from '../../config.js';
import { getVisionModelPrompt } from './prompts/index.js';
import { runWithProgress } from '../ui/progress.js';

/**
 * Generates initial image description using vision model
 * 
 * @param {string} imageName - Name of the image file
 * @param {string} model - Model name to use
 * @returns {Promise<{prompt: string, response: string}>} Prompt and response from vision model
 * @throws {Error} If image processing fails
 */
export const generateImageDescription = async (imageName, model) => {
    const processingPrompt = getVisionModelPrompt();

    try {
        const imagePath = join(ASSETS_DIR, imageName);

        const modalResponse = await runWithProgress(
            `${model} analyzing ${imageName}`,
            async () =>
                await ollama.chat({
                    model: model,
                    messages: [{
                        role: 'user',
                        content: processingPrompt,
                        images: [imagePath]
                    }]
                })
        );

        return {
            prompt: processingPrompt,
            response: modalResponse.message.content.trim()
        };
    } catch (error) {
        console.error(`❌ Error processing image with ${model}:`, error.message);
        throw error;
    }
};

