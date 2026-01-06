import { MongoClient } from 'mongodb';
import ollama from 'ollama';
import JSON5 from 'json5';
import { exiftool } from "exiftool-vendored";

//const MONGO_URI = 'process.env.MONGO_URI';
const MONGO_URI = 'process.env.MONGO_URI';
const DB_NAME = 'dev';
const COLLECTION = 'images';

const LLAMA_VISION_IMAGE_MODEL = 'llama3.2-vision:11b';

const INSTRUCT_MODEL = 'mistral:7b-instruct';

const IMAGE_NAME = process.argv[2];

const ASSETS_DIR = '../../assets';

const client = new MongoClient(MONGO_URI);

const getGPSData = async () => {
    const tags = await exiftool.read(`${ASSETS_DIR}/${IMAGE_NAME}`);

    await exiftool.end();

    return  tags.GPSLatitude && tags.GPSLongitude
        ? {
            "type": "Point",
            "coordinates": [
                tags.GPSLongitude,
                tags.GPSLatitude,
                tags.GPSAltitude
            ]
          }
        : null;
};

const generateInfoForImage = async (model) => {

    console.log(`🏃‍♂️ ${model} Processing: ${IMAGE_NAME}`);

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

    const modalResponse = await ollama.chat({
        model: model,
        messages: [{
            role: 'user',
            content: processingPrompt,
            images: [`${ASSETS_DIR}/${IMAGE_NAME}`]
        }]
    });

    console.log(`✅ ${model} Processed: ${IMAGE_NAME}`);
    console.log(modalResponse)

    return {
        prompt: processingPrompt,
        response: modalResponse.message.content.trim()
    };
};

const generateImageDocument = async () => {

    const { prompt: imageInfoPrompt, response: imageInfo } = await generateInfoForImage(LLAMA_VISION_IMAGE_MODEL).then();

    console.log(`🦚 - Generating image document for: ${IMAGE_NAME}`);

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

    const jsonOutput = await ollama.chat({
        model: INSTRUCT_MODEL,
        messages: [{
            role: 'user',
            content: descriptionPrompt,
        }]
    });

    const raw = jsonOutput.message.content.trim();

    console.log(`\n\n[${INSTRUCT_MODEL}] - ${raw}`);

    let cleanish = raw.startsWith('\n') ? raw.slice(1) : raw;
    const jsonStart = cleanish.indexOf('{');
    let jsonEnd = cleanish.lastIndexOf('}') + 1;

    if (!jsonEnd) {
        cleanish = cleanish + '}';
        jsonEnd = cleanish.lastIndexOf('}') + 1;
    }

    const jsonStr = cleanish.slice(jsonStart, jsonEnd);

    const parsed = JSON5.parse(jsonStr);

    console.log(`✨ Generated info for image: "${parsed.title}"`);

    return {
        file: IMAGE_NAME,
        location: await getGPSData(),
        ...parsed,
        raw: [
            { model: LLAMA_VISION_IMAGE_MODEL, prompt: imageInfoPrompt, response: imageInfo },
            //{ model: LAVA_MODEL, prompt: imageTestInfoPrompt, response: imageTestInfo },
            { model: INSTRUCT_MODEL, prompt: descriptionPrompt }
        ]
    };
}

async function main() {
    await client.connect();
    const db = client.db(DB_NAME);
    const images = db.collection(COLLECTION);

    const imageInfo = await generateImageDocument();

    await images.insertOne(imageInfo);

    await client.close();
}

main().catch(console.error);

