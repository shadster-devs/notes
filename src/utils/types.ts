import {JSONContent} from "novel";

export type Notebook = {
    id: number;
    name: string;
}

export type Note = {
    id: number
    isPinned?: boolean
    title: string
    content:JSONContent
    notebook: number
    createdAtUnixTs: number
}