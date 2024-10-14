'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { useNotes } from "@/contexts/NotesProvider";
import { Note } from "@/utils/types";
import Editor from "@/components/editor/editor";

export default function NotePage() {
    const router = useRouter();
    const params = useParams(); // Get the route parameters
    const { notes, editNote } = useNotes();

    const [note, setNote] = useState<Note | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isModified, setIsModified] = useState(false); // Track if the note has been modified
    const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);

    // Parse noteId from params (assuming it's a string)
    const noteId = params.noteId as string;

    // Find the note based on the noteId in params and notes context
    useEffect(() => {
        const foundNote = notes.find(note => note.id === noteId) || null;
        if (foundNote) {
            setNote(foundNote);  // Only set the note if found
        }
    }, [noteId, notes]);  // Effect depends on noteId and notes

    // Save note with debounce
    const handleSaveNote = useCallback(async () => {
        if (note && !isSaving && isModified) {  // Only save if there's a modification
            setIsSaving(true);
            await editNote(note.id, note.title, note.content);
            setIsSaving(false);
            setIsModified(false); // Reset the modification flag after saving
        }
    }, [note, isSaving, isModified, editNote]);

    // Handle title changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (note) {
            setNote({ ...note, title: e.target.value });
            setIsModified(true); // Mark note as modified
            debounceSave(); // Debounce save when user types
        }
    };

    // Handle content changes from the editor
    const handleContentChange = (content: any) => {
        if (note) {
            setNote({ ...note, content });
            setIsModified(true); // Mark note as modified
            debounceSave(); // Debounce save when user edits content
        }
    };

    // Debounce save to avoid continuous updates
    const debounceSave = () => {
        if (debounceSaveRef.current) {
            clearTimeout(debounceSaveRef.current!);
        }
        debounceSaveRef.current = setTimeout(() => {
            handleSaveNote();  // Save after 1 second of inactivity
        }, 1000);
    };

    // Save the note when the user navigates away from the page
    useEffect(() => {
        return () => {
            if (note && isModified) {
                handleSaveNote();  // Save the note on unmount if modified
            }
        };
    }, [note, isModified, handleSaveNote]);

    // If no note is found, display a loader
    if (!note) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
    );

    return (
        <div className="flex flex-col h-screen max-w-7xl mx-auto pb-8">
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
                    <Button variant="outline" onClick={handleSaveNote} disabled={isSaving || !isModified}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                </div>
            </div>
            <div className="w-full px-4 pb-4">
                <Editor initialValue={note.content} onChange={handleContentChange} />
            </div>
        </div>
    );
}
