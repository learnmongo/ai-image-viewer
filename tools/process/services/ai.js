import ollama from 'ollama';
import JSON5 from 'json5';
import { join } from 'path';
import { ASSETS_DIR, LLAMA_VISION_IMAGE_MODEL, INSTRUCT_MODEL } from '../config.js';

/**
 * Generates initial image description using vision model
 * @param {string} imageName - Name of the image file
 * @param {string} model - Model name to use (defaults to LLAMA_VISION_IMAGE_MODEL)
 * @returns {Promise<{prompt: string, response: string}>}
 */
export const generateInfoForImage = async (imageName, model = LLAMA_VISION_IMAGE_MODEL) => {
    console.log(`🏃‍♂️ ${model} Processing: ${imageName}`);

    const processingPrompt = `
        Describe
        
        Title:
        - Generate a short title (5 words or less) for the image.

        What you see in this image:
        - Include details about objects, people, actions, setting, and any text visible.
        - If you can clearly tell what or where something is in the image, include the name in the description.
        - If you can tell the location the image was taken, include it in the description.

        Feelings:
        - Return 1 to 3 feelings the image evokes, such as: "happy", "chill", "exciting"

        Colors:
        - Return 2 to 4 primary colors in the image, in hex format like: "#FF5733", "#33FF57", "#3357FF" these should be the most dominant colors.
        
        The output will be sent to another model for further processing and should be returned in the following format:

        ### Example Response Format:
        Title: ...
        Description: ...
        Feelings: "...", "...", "..."
        Colors: "#.......", "#......", "#......"
    `.trim();

    try {
        const imagePath = join(ASSETS_DIR, imageName);
        const modalResponse = await ollama.chat({
            model: model,
            messages: [{
                role: 'user',
                content: processingPrompt,
                images: [imagePath]
            }]
        });

        console.log(`✅ ${model} Processed: ${imageName}`);

        return {
            prompt: processingPrompt,
            response: modalResponse.message.content.trim()
        };
    } catch (error) {
        console.error(`❌ Error processing image with ${model}:`, error.message);
        throw error;
    }
};

/**
 * Parses and cleans JSON response from AI model
 * @param {string} raw - Raw JSON string from model
 * @returns {Object} Parsed JSON object
 */
const parseJsonResponse = (raw) => {
    let cleanish = raw.startsWith('\n') ? raw.slice(1) : raw;
    const jsonStart = cleanish.indexOf('{');
    let jsonEnd = cleanish.lastIndexOf('}') + 1;

    if (!jsonEnd) {
        cleanish = cleanish + '}';
        jsonEnd = cleanish.lastIndexOf('}') + 1;
    }

    const jsonStr = cleanish.slice(jsonStart, jsonEnd);

    try {
        return JSON5.parse(jsonStr);
    } catch (error) {
        throw new Error(`Failed to parse JSON response: ${error.message}\nRaw response: ${raw}`);
    }
};

/**
 * Generates structured image document using instruction model
 * @param {string} imageInfo - Initial image description from vision model
 * @returns {Promise<Object>} Structured image metadata
 */
export const generateStructuredMetadata = async (imageInfo) => {
    console.log(`🦚 Generating structured metadata...`);

    const descriptionPrompt = `
        You are an AI model that processes image descriptions from another model and generates structured metadata.
    
        ### Keep these important instructions in mind:

        - Do not add any additional information.
        - You are reviewing image processing done by another model.
        - Describe the image as a scene: in a classy, slightly dramatic or artistic tone.
        - Do not use the phrases "this image" or "the photo", describe the scene as if you were describing it to a friend.
        - Generate a short title (5 words or less), description, retain a detailed summary of notable details, and relevant tags.
        - Keep as much of the original models' description in the **summary** as possible (ideally multiple sentences if not paragraphs), exclude exact hex colors. 
        - Generate hues or hex colors based on the description provided if not already present.
        - Do not return the hex colors in your description or summary, those are for humans. Instead include them in the "colors" field.
    
        
        ### Return in a JSON object like this example:
        
        {
          title: "...short title of the image...",
          description: "... shorter image description.",
          summary: "... longer, detailed summary.",
          feelings: ["happy", "chill", "exciting"],
          hues: ["red", "blue", "green", "yellow"],
          colors: ["#FF5733", "#33FF57", "#3357FF"],
          tags: ["water", "trees", "people", "red"]
        }
                
        ### Instructions:
        
        Only return valid JSON in this format:
        
        {
          title: "...",
          description: "...",
          summary: "...",
          feelings: ["...", "...", "..."],
          hues: ["...", "...", "...", "..."],
          colors: ["...", "...", "...", "..."],
          tags: ["...", "...", "...", "..."]
        }

        ### Image Description from other models:
        [START OF IMAGE DESCRIPTION]
        
        ${imageInfo}
        
        [END OF IMAGE DESCRIPTION]
        
    `.trim();

    try {
        const jsonOutput = await ollama.chat({
            model: INSTRUCT_MODEL,
            messages: [{
                role: 'user',
                content: descriptionPrompt,
            }]
        });

        const raw = jsonOutput.message.content.trim();
        console.log(`\n\n[${INSTRUCT_MODEL}] - ${raw}`);

        const parsed = parseJsonResponse(raw);
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

