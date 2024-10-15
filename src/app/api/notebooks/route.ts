// src/app/api/notebooks/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Notebook } from '@/utils/types';
import {currentUser} from "@clerk/nextjs/server";

// Fetch all notebooks
export async function GET() {
    try {
        const user = await currentUser();
        const client = await clientPromise;
        const db = client.db("notes-app"); // Replace with your DB name
        const notebooks = await db.collection("notebooks").find({
            userId: user?.id
        }).toArray();
        return NextResponse.json(notebooks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to get notebooks" });
    }
}

// Insert or update a notebook
export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("notes-app");
        const { notebook }: { notebook: Notebook } = await req.json();

        await db.collection("notebooks").updateOne(
            { id: notebook.id },
            { $set: notebook },
            { upsert: true }
        );
        return NextResponse.json({ message: "Notebook updated" });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update notebook' });
    }
}


export async function DELETE(req: Request) {
    try {
        const { id } = await req.json(); // Extract notebook ID from request body

        const client = await clientPromise;
        const db = client.db("notes-app"); // Replace 'yourDB' with your actual DB name
        await db.collection("notebooks").deleteOne({ id });

        // Optionally delete all notes related to this notebook
        await db.collection("notes").deleteMany({ notebook: id });

        return NextResponse.json({ message: 'Notebook and its notes deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete notebook' });
    }
}