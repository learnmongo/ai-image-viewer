import JSON5 from 'json5';

/**
 * Parses and cleans JSON response from AI model
 * Handles common issues like leading newlines, extra text, or incomplete JSON
 * 
 * @param {string} raw - Raw JSON string from model
 * @returns {Object} Parsed JSON object
 * @throws {Error} If JSON cannot be parsed
 */
export const parseJsonResponse = (raw) => {
    // Remove leading newlines
    let cleanish = raw.startsWith('\n') ? raw.slice(1) : raw;
    
    // Find JSON boundaries
    const jsonStart = cleanish.indexOf('{');
    let jsonEnd = cleanish.lastIndexOf('}') + 1;

    // If no closing brace found, try to add one (handles incomplete JSON)
    if (!jsonEnd || jsonEnd <= jsonStart) {
        cleanish = cleanish + '}';
        jsonEnd = cleanish.lastIndexOf('}') + 1;
    }

    // Extract just the JSON portion
    const jsonStr = cleanish.slice(jsonStart, jsonEnd);

    try {
        return JSON5.parse(jsonStr);
    } catch (error) {
        throw new Error(
            `Failed to parse JSON response: ${error.message}\n` +
            `Raw response: ${raw.substring(0, 200)}...`
        );
    }
};

