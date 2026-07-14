// Prompt version - increment when making changes
export const VERSION = '2.1.1';

/**
 * Prompt template for vision model to generate initial image description
 * @returns {string} Vision model prompt
 */
export const getVisionModelPrompt = () => {
    return `
You are analyzing an image and producing structured factual observations.

IMPORTANT RULES:
- Your role is to describe the image in a way that is easy to understand.
- Make the description interesting and engaging.
- Look closely at the image, look for clues to make for a highly accurate description.
- Use clues to infer location, and state it when it is clear but do not assume. You may guess location but preface with "maybe" or "perhaps" if you do.
- If there is non-English text, translate text, but make sure to include the original text as well as the translation.

STYLE:
- Do NOT add formatting such as markdown, bullet points, or headers.
- Output must EXACTLY match the format below.

TASKS:

Title:
- 3 to 5 words.
- Interesting, catchy, unique, but not too obscure.
- Pithy, but with a hint of poetry or metaphor when appropriate.

Description:
- What is visually present.
- Objects, buildings, people, actions, visible text.
- If visible text or landmark clearly identifies a place, name it.
- Separate facts from guesses.
- DO NOT use phrases like "this image" or "the photo"
- NEVER include hex colors in the description.
- NEVER include something like "The image appears to be a photograph of"

Summary:
- A longer, more detailed summary of the image.
- DO NOT repeat the title or description, this should be a different description of the image.
- DO NOT include the feelings or colors.
- DO NOT use phrases like "this image" or "the photo"
- If visible text or landmark clearly identifies a place, name it.
- NEVER include something like "The image appears to be a photograph of"

Feelings:
- Choose 1 to 3 emotional tones evoked by the scene.

Colors:
- 2 to 4 dominant colors.
- HEX ONLY.
- No color names.

Tags:
- 1 to 3 tags that describe the image.
- Tags should be short, descriptive, and not too specific.
- Tags should be unique and not too generic.

OUTPUT FORMAT (EXACT):

Title: <text>
Description: <text>
Summary: <text>
Feelings: "<feeling>", "<feeling>"
Colors: "#XXXXXX", "#XXXXXX"
Tags: "<tag>", "<tag>"
    `.trim();
};

