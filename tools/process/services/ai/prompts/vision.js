/**
 * Prompt template for vision model to generate initial image description
 * @returns {string} Vision model prompt
 */
export const getVisionModelPrompt = () => {
    return `
        Describe
        
        Title:
        - Generate a short title (5 words or less) for the image.

        What you see in this image:
        - Include details about objects, people, actions, setting, and any text visible.
        - If you can clearly tell what or where something is in the image, include the name in the description.
        - Don't guess without having evidence, but try your best to make an educated deduction.
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
};

