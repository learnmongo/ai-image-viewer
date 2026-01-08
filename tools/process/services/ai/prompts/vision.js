// Prompt version - increment when making changes
export const VERSION = '2.1.0';

/**
 * Prompt template for vision model to generate initial image description
 * @returns {string} Vision model prompt
 */
export const getVisionModelPrompt = () => {
    return `
You are analyzing an image and producing structured factual observations.

IMPORTANT RULES:
- You role is to describe the image in a way that is easy to understand and use for a caption.
- Make the description interesting and engaging.
- Look closely at the image, look for clues to make for an interesting description.
- Use clues to infer location, but do not assume unless visible text or a recognizable landmark is present.
- If you do not have enough information for a location, you may guess but preface with "maybe" or "perhaps".
- If you can translate text, do so but include the original text as well as the translation. Describe the translation.
- Do NOT add formatting such as markdown, bullet points, or headers.
- Output must EXACTLY match the format below.

TASKS:

Title:
- 3 to 5 words.
- Concrete, not poetic.

Description:
- What is visually present.
- Objects, buildings, people, actions, visible text.
- Separate facts from guesses.
- NEVER include hex colors in the description.

- If visible text or landmark clearly identifies a place, name it.

Feelings:
- Choose 1 to 3 emotional tones evoked by the scene.

Colors:
- 2 to 4 dominant colors.
- HEX ONLY.
- No color names.

OUTPUT FORMAT (EXACT):

Title: <text>
Description: <text>
Feelings: "<feeling>", "<feeling>"
Colors: "#XXXXXX", "#XXXXXX"
    `.trim();
};

