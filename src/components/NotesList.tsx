"use client"

import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import { useNotes } from "@/contexts/NotesProvider"
import NotebookSelector from "./NotebookSelector"
import NoteCard from "./NoteCard"
import AddNote from "@/components/AddNote"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function NotesList() {
    const { currentNotebook, notes, getPinnedNotes } = useNotes()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isPinnedExpanded, setIsPinnedExpanded] = useState(true)

    const filteredNotes = notes.filter(note =>
        note.notebook === currentNotebook?.id &&
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pinnedNotes = getPinnedNotes(currentNotebook)

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">My Notes</h1>
                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <NotebookSelector />
                    <AddNote />
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={searchTerm}
                    placeholder="Search notes..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {pinnedNotes.length > 0 && searchTerm === "" && (
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="flex items-center justify-between w-full mb-3"
                        onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                    >
                        <span className="text-xl font-semibold">Pinned Notes <span className="text-muted-foreground text-sm">{ pinnedNotes.length}</span></span>
                        {isPinnedExpanded ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                    <AnimatePresence>
                        {isPinnedExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {pinnedNotes.map(note => (
                                        <NoteCard key={note.id} note={note} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {pinnedNotes.length > 0 && searchTerm === "" && <Separator className="my-6" />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-xl font-semibold mb-3">
                    {searchTerm ? "Search Results" : ""} <span className="text-muted-foreground text-sm">{searchTerm? filteredNotes.length : ""}</span>
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            </motion.div>

            {filteredNotes.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">No notes found.</p>
            )}
        </div>
    )
}