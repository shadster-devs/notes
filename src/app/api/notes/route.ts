// src/app/api/notes/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Note } from '@/utils/types';

// Fetch all notes
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("notes-app"); // Replace with your DB name
        const notes = await db.collection("notes").find({}).toArray();
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notes' });
    }
}

// Insert or update a note
export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("notes-app");
        const { note }: { note: Note } = await req.json();

        await db.collection("notes").updateOne(
            { id: note.id },
            { $set: note },
            { upsert: true }
        );
        return NextResponse.json({ message: "Note updated" });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update note' });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json(); // Extract note ID from request body

        const client = await clientPromise;
        const db = client.db("notes-app"); // Replace 'yourDB' with your actual DB name
        await db.collection("notes").deleteOne({ id });

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete note' });
    }
}
