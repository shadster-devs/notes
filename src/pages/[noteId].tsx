'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

import { useNotes } from "@/contexts/NotesContext"
import NoteEditor from "@/components/NoteEditor";
import {JSONContent} from "novel";
import {Note} from "@/utils/types";

export default function NotePage({ noteId = 1 }: { noteId?: number }) {
    const router = useRouter()
    const { notes } = useNotes()

    const [note, setNote] = useState<Note | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    useEffect(() => {
        setNote(notes.find(note => note.id === noteId) || null)
    }, [noteId, notes])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (note) {
            setNote({ ...note, title: e.target.value })
            setHasUnsavedChanges(true)
        }
    }

    const handleContentChange = (content: JSONContent) => {
        if (note) {
            setNote({ ...note, content })
            setHasUnsavedChanges(true)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Simulating an API call to save the note
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setIsEditing(false)
        setHasUnsavedChanges(false)
    }

    const handleBack = () => {
        if (hasUnsavedChanges) {
            // Show alert dialog
        } else {
            router.back()
        }
    }

    if (!note) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
    )

    return (
        <div className="flex flex-col h-screen">
            <div className="sticky top-0 bg-background z-10 mb-4 flex gap-4 justify-between items-center py-2 border-b px-4">
                <Input
                    type="text"
                    value={note.title}
                    onChange={handleTitleChange}
                    disabled={!isEditing}
                    className="text-2xl font-semibold flex-1 border-none focus:ring-0 focus:outline-none"
                    placeholder="Enter your note title..."
                />
                <div className="flex space-x-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have unsaved changes. Are you sure you want to leave this page?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.back()}>Leave</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {isEditing ? (
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    )}
                </div>
            </div>
            <div className="flex-grow overflow-auto px-4 pb-4">
                <NoteEditor content={note.content} handleContentUpdate={handleContentChange}/>
            </div>
        </div>
    )
}