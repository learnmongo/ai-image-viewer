/**
 * Prompt template for instruction model to generate structured metadata
 * @param {string} imageInfo - Initial image description from vision model
 * @returns {string} Instruction model prompt
 */
export const getInstructionModelPrompt = (imageInfo) => {
    return `
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
};

