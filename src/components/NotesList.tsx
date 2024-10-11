"use client"

import React, { useState, useMemo } from 'react'
import {Search, ChevronDown, ChevronUp, ArrowUp, ArrowDown, LogIn} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useNotes } from "@/contexts/NotesProvider"
import NotebookSelector from "./NotebookSelector"
import NoteCard from "./NoteCard"
import AddNote from "@/components/AddNote"
import { ThemeToggle } from "@/components/ThemeToggle"
import {Note} from "@/utils/types";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function NotesList() {
    const { currentNotebook, notes } = useNotes()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isPinnedExpanded, setIsPinnedExpanded] = useState(true)
    const [showAllPinned, setShowAllPinned] = useState(false)
    const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('createdAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const pinnedNotes = useMemo(() => {
        const filtered = showAllPinned
            ? notes.filter(note => note.isPinned)
            : notes.filter(note => note.notebook === currentNotebook?.id && note.isPinned)

        return sortNotes(filtered)
    }, [notes, showAllPinned, currentNotebook, sortBy, sortOrder])

    const filteredNotes = useMemo(() => {
        const filtered = notes.filter(note =>
            note.notebook === currentNotebook?.id &&
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )

        return sortNotes(filtered)
    }, [notes, currentNotebook, searchTerm, sortBy, sortOrder])

    function sortNotes(notesToSort : Note[]) {
        return notesToSort.sort((a, b) => {
            if (sortBy === 'title') {
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            } else {
                return sortOrder === 'asc'
                    ? new Date(a.createdAtUnixTs).getTime() - new Date(b.createdAtUnixTs).getTime()
                    : new Date(b.createdAtUnixTs).getTime() - new Date(a.createdAtUnixTs).getTime()
            }
        })
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold">My Notes</h1>
                    <SignedOut>
                            <SignInButton mode={"modal"}>
                                <Button  >
                                  Sign In  <LogIn className="h-4 w-4 ml-2" />
                                </Button>
                            </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton userProfileMode="modal"/>
                    </SignedIn>
                </div>

                <div className="flex items-center space-x-2">
                    <ThemeToggle/>
                    <NotebookSelector/>
                    <AddNote/>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchTerm}
                        placeholder="Search notes..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'title' | 'createdAt')}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {
                            sortOrder === 'asc'
                                ? <ArrowUp className="h-4 w-4" />
                                : <ArrowDown className="h-4 w-4" />
                        }
                    </Button>
                </div>
            </div>

            {pinnedNotes.length > 0 && searchTerm === "" && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <Button
                            variant="ghost"
                            className="flex items-center"
                            onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                        >
                            <span className="text-xl font-semibold mr-2">Pinned Notes</span>
                            <span className="text-muted-foreground text-sm transform translate-y-0.5">{pinnedNotes.length}</span>
                            {isPinnedExpanded ? <ChevronUp className="h-5 w-5 ml-2"/> : <ChevronDown className="h-5 w-5 ml-2" />}
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="show-all-pinned"
                                checked={showAllPinned}
                                onCheckedChange={setShowAllPinned}
                            />
                            <Label htmlFor="show-all-pinned">{showAllPinned ? "All Notebooks" : "Only " + currentNotebook?.name}</Label>
                        </div>
                    </div>
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
                { searchTerm && (
                    <h2 className="text-xl font-semibold mb-3">
                        {"Search Results"}
                        <span className="text-muted-foreground text-sm ml-2">
                        {filteredNotes.length}
                    </span>
                    </h2>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note}/>
                    ))}
                </div>
            </motion.div>

            {filteredNotes.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">No notes found.</p>
            )}
        </div>
    )
}