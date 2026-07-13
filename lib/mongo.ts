import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
if (!uri) {
  throw new Error(
    'Missing MongoDB URI: set MONGODB_URI or MONGO_URI (e.g. in .env.local).'
  );
}
const options = {};

let client: MongoClient;
const clientPromise: Promise<MongoClient> = (() => {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
})();

export default clientPromise;

