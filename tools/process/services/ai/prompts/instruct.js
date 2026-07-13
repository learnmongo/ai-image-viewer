// Prompt version - increment when making changes
export const VERSION = '2.1.0';

/**
 * Prompt template for instruction model to generate structured metadata
 * @param {string} imageInfo - Initial image description from vision model
 * @returns {string} Instruction model prompt
 */
export const getInstructionModelPrompt = (imageInfo) => {
    return `
You are transforming structured image analysis into metadata.

CRITICAL CONSTRAINTS:
- Do NOT add new facts.
- Preserve uncertainty exactly as stated.
- Tone may be refined, but content must remain faithful.

STYLE:
- Elegant, calm, descriptive.
- No dramatic embellishment.

RULES:
- DO NOT use phrases like "this image" or "the photo", remove them if the input includes them.
- Summary should retain as much original phrasing as possible.
- Colors must appear ONLY in the colors field.
- Make sure hex colors never appear in the description, title or summary.

RETURN ONLY VALID JSON.

SCHEMA:

{
  "title": "...",
  "description": "...",
  "summary": "...",
  "feelings": ["...", "..."],
  "hues": ["...", "..."],
  "colors": ["#XXXXXX", "#XXXXXX"],
  "tags": ["...", "..."]
}

INPUT:
[START]

${imageInfo}

[END]
    `.trim();
};

