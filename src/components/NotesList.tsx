"use client"
import React, { useState } from 'react';

import { Input } from "@/components/ui/input";

import { useNotes } from "@/contexts/NotesProvider";
import NotebookSelector from "./NotebookSelector";
import NoteCard from "./NoteCard";
import AddNote from "@/components/AddNote";
import {ThemeToggle} from "@/components/ThemeToggle";

const NotesList: React.FC = () => {
    const {  currentNotebook, notes } = useNotes(); // Use context functions and state
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredNotes = notes.filter(note =>
        note.notebook === currentNotebook?.id &&
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className={'max-w-7xl mx-auto py-8'}>
            <div className={'flex justify-between items-center mb-6'}>
                <span className={'text-2xl font-bold'}>My Notes <ThemeToggle/></span>
                <div className={'flex gap-2'}>
                    <NotebookSelector />
                    <AddNote />
                </div>
            </div>

            <div className={'flex gap-2 justify-between items-center mb-6'}>
                <Input
                    type="text"
                    value={searchTerm}
                    placeholder="Search notes..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                {filteredNotes.map(note => (
                    <NoteCard key={note.id} note={note}/>
                ))}
            </div>
        </div>
    );
};

export default NotesList;
