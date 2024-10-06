'use client'

import React, { useState, useEffect } from 'react'
import {useParams, useRouter} from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

import { useNotes } from "@/contexts/NotesContext"
import {Note} from "@/utils/types";
import Editor from "@/components/editor/editor";

export default function NotePage() {
    const router = useRouter();
    const params = useParams(); // Get the route parameters
    const { notes,editNote } = useNotes();




    const [note, setNote] = useState<Note | null>(null);

    // Parse noteId from params (assuming it’s a string)
    const noteId = params.noteId ? parseInt(params.noteId as string) : 1;


    useEffect(() => {
        setNote(notes.find(note => note.id === noteId) || null)
    }, [noteId])

    useEffect(() => {
        if (note) {
            editNote(note.id, note.title, note.content)
        }
    }, [note]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (note) {
            setNote({ ...note, title: e.target.value })
        }
    }

    const handleContentChange = (content: any) => {
        if (note) {
            setNote({ ...note, content })
        }
    }

    if (!note) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
    )

    return (
        <div className="flex flex-col h-screen max-w-7xl  mx-auto pb-8">
            <div className="bg-background z-10 mb-4 flex gap-4 justify-between items-center py-2 border-b px-4">
                <Input
                    type="text"
                    value={note.title}
                    onChange={handleTitleChange}
                    disabled={false}
                    className="text-2xl font-semibold flex-1 border-none focus:ring-0 focus:outline-none"
                    placeholder="Enter your note title..."
                />
                <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => router.back()}>Back</Button>
                </div>
            </div>
            <div className="w-full px-4 pb-4">
                <Editor initialValue={note.content} onChange={handleContentChange}  />
            </div>
        </div>
    )
}