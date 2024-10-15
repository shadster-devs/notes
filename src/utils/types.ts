// src/utils/types.ts
import { JSONContent } from "novel";

export type Notebook = {
    id: string;
    name: string;
    userId : string;
    color?: string;
    syncStatus: 'synced' | 'pending' | 'failed';
};

export type Note = {
    id: string;
    isPinned?: boolean;
    title: string;
    content: JSONContent;
    userId : string;
    notebook: string;
    createdAtUnixTs: number;
    syncStatus: 'synced' | 'pending' | 'failed';
};
