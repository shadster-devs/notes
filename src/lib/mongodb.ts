// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string; // Store MongoDB URI in .env.local
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

client = new MongoClient(uri);
clientPromise = client.connect();

export default clientPromise;
