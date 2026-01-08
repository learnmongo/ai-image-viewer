import ollama from 'ollama';
import { INSTRUCT_MODEL } from '../../config.js';
import { getInstructionModelPrompt } from './prompts/index.js';
import { parseJsonResponse } from '../utils/json-parser.js';
import { runWithProgress } from '../ui/progress.js';

/**
 * Generates structured image document using instruction model
 * Takes the raw description from vision model and converts it to structured JSON
 * 
 * @param {string} imageInfo - Initial image description from vision model
 * @returns {Promise<{parsed: Object, prompt: string}>} Parsed metadata and prompt used
 * @throws {Error} If metadata generation or parsing fails
 */
export const generateStructuredMetadata = async (imageInfo) => {
    const descriptionPrompt = getInstructionModelPrompt(imageInfo);

    try {
        const jsonOutput = await runWithProgress(
            `${INSTRUCT_MODEL} generating metadata`,
            async () =>
                await ollama.chat({
                    model: INSTRUCT_MODEL,
                    messages: [{
                        role: 'user',
                        content: descriptionPrompt,
                    }]
                })
        );

        const raw = jsonOutput.message.content.trim();
        const parsed = parseJsonResponse(raw);
        
        // Pretty-print the parsed JSON
        console.log(`\n[${INSTRUCT_MODEL}] Response:`);
        console.log(JSON.stringify(parsed, null, 2));
        console.log(`✨ Generated info for image: "${parsed.title}"`);

        return {
            parsed,
            prompt: descriptionPrompt
        };
    } catch (error) {
        console.error(`❌ Error generating structured metadata:`, error.message);
        throw error;
    }
};

