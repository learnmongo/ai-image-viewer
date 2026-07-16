import { MongoClient } from 'mongodb';
import { COLLECTION, DB_NAME, getMongoUri } from '../config.js';

let client = null;

export const getClient = () => {
  if (!client) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return client;
};

/**
 * Connects to MongoDB database
 * @returns {Promise<MongoClient>}
 */
export const connect = async () => {
  if (client) {
    return client;
  }

  const uri = getMongoUri();
  client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

/**
 * Closes MongoDB connection
 */
export const close = async () => {
  if (client) {
    await client.close();
    client = null;
    console.log('✅ MongoDB connection closed');
  }
};

/**
 * Inserts image document into database
 * @param {Object} imageDoc - Image document to insert
 * @returns {Promise<Object>} Insert result
 */
export const insertImage = async (imageDoc) => {
  if (!client) {
    throw new Error('Database not connected. Call connect() first.');
  }

  try {
    const db = client.db(DB_NAME);
    const images = db.collection(COLLECTION);
    const result = await images.insertOne(imageDoc);
    console.log(`✅ Image document inserted with ID: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to insert image document:', error.message);
    throw error;
  }
};
