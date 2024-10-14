// src/utils/types.ts
import { JSONContent } from "novel";

export type Notebook = {
    id: string; // MongoDB ObjectId in string format
    name: string;
    color?: string;
    syncStatus: 'synced' | 'pending' | 'failed'; // To track sync status
};

export type Note = {
    id: string; // MongoDB ObjectId in string format
    isPinned?: boolean;
    title: string;
    content: JSONContent;
    notebook: string; // Refers to Notebook id
    createdAtUnixTs: number;
    syncStatus: 'synced' | 'pending' | 'failed'; // To track sync status
};
