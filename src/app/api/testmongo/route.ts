import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET handler to test MongoDB connection
export const GET = async () => {
    try {
        const client = await clientPromise;
        const db = client.db('notes-app');
        const collections = await db.listCollections().toArray(); // List all collections in the database

        return NextResponse.json({
            message: 'MongoDB connection is successful!',
            collections: collections.map(collection => collection.name),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to connect to MongoDB', error: error.message });
    }
};
