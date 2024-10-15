"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notebook, Note } from "@/utils/types";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for unique IDs
import { JSONContent } from "novel";
import {useUser} from "@clerk/nextjs";

// Define the context type
type NotesContextType = {
    notebooks: Notebook[];
    notes: Note[];
    currentNotebook: Notebook | null;
    setCurrentNotebook: (notebook: Notebook | null) => void;
    addNotebook: (name: string, color: string) => void;
    editNotebook: (id: string, name: string, color: string) => void;
    deleteNotebook: (id: string) => void;
    pinNote: (id: string) => void;
    moveNote: (id: string, notebookId: string) => void;
    addNote: (title: string, content: JSONContent, notebookId: string, createdAtUnixTs: number) => void;
    editNote: (id: string, title: string, content: JSONContent) => void;
    deleteNote: (id: string) => void;
};

// Default context state
const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
    children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {

    const {user} = useUser();

    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);

    // Fetch data from MongoDB
    const fetchFromMongoDB = useCallback(async () => {
        try {
            const [notesResponse, notebooksResponse] = await Promise.all([
                fetch('/api/notes'),
                fetch('/api/notebooks')
            ]);

            const notesData = await notesResponse.json();
            const notebooksData = await notebooksResponse.json();

            if (notesData.error || notebooksData.error) {
                console.error("Failed to fetch data from MongoDB");
                return;
            }

            if (notesData.length === 0 && notebooksData.length === 0) {
                return;
            }



            if (notesData.length) setNotes(notesData.map((note: Note) => ({ ...note, syncStatus: 'synced' })));
            if (notebooksData.length) setNotebooks(notebooksData.map((notebook: Notebook) => ({ ...notebook, syncStatus: 'synced' })));

        } catch (error) {
            console.error("Error fetching data from MongoDB", error);
        }
    }, []);

    // Load data from local storage and then sync with MongoDB
    const loadLocalStorageData = () => {
        const storedNotebooks = localStorage.getItem('notebooks');
        const storedNotes = localStorage.getItem('notes');

        if (storedNotebooks && storedNotes) {
            setNotebooks(JSON.parse(storedNotebooks).map((notebook: Notebook) => ({ ...notebook, syncStatus: 'pending' })));
            setNotes(JSON.parse(storedNotes).map((note: Note) => ({ ...note, syncStatus: 'pending' })));
        }
    };

    useEffect(() => {
        // Load local storage data first for fast access
        loadLocalStorageData();

        // Fetch fresh data from MongoDB
        fetchFromMongoDB();
    }, [fetchFromMongoDB]);

    // Sync function to check if any note or notebook needs to be synced
    const syncData = useCallback(() => {
        const unsyncedNotes = notes.filter(note => note.syncStatus === 'pending');
        const unsyncedNotebooks = notebooks.filter(notebook => notebook.syncStatus === 'pending');

        // Sync notes
        unsyncedNotes.forEach(async note => {
            try {
                const response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ note }),
                });

                if (response.ok) {
                    setNotes(notes.map(n => n.id === note.id ? { ...n, syncStatus: 'synced' } : n));
                } else {
                    setNotes(notes.map(n => n.id === note.id ? { ...n, syncStatus: 'failed' } : n));
                }
            } catch (error) {
                setNotes(notes.map(n => n.id === note.id ? { ...n, syncStatus: 'failed' } : n));
            }
        });

        // Sync notebooks
        unsyncedNotebooks.forEach(async notebook => {
            try {
                const response = await fetch('/api/notebooks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ notebook }),
                });

                if (response.ok) {
                    setNotebooks(notebooks.map(n => n.id === notebook.id ? { ...n, syncStatus: 'synced' } : n));
                } else {
                    setNotebooks(notebooks.map(n => n.id === notebook.id ? { ...n, syncStatus: 'failed' } : n));
                }
            } catch (error) {
                setNotebooks(notebooks.map(n => n.id === notebook.id ? { ...n, syncStatus: 'failed' } : n));
            }
        });
    }, [notes, notebooks]);

    // Sync data (notes and notebooks) every second
    useEffect(() => {
        const interval = setInterval(() => {
            syncData();
        }, 1000); // Sync every second
        return () => clearInterval(interval);
    }, [syncData]);

    // Set the current notebook when notebooks are updated
    useEffect(() => {
        setCurrentNotebook(prev => notebooks.find(nb => nb.id === prev?.id) || notebooks[0]);
    }, [notebooks]);

    // Save to local storage whenever notebooks or notes are updated
    useEffect(() => {
        localStorage.setItem('notebooks', JSON.stringify(notebooks));
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notebooks, notes]);

    const addNotebook = (name: string, color: string) => {
        if (!user) return;

        const newNotebook: Notebook = {
            id: uuidv4(),
            userId: user.id,
            name,
            color,
            syncStatus: 'pending',
        };
        setNotebooks([...notebooks, newNotebook]);
    };

    const editNotebook = (id: string, name: string, color: string) => {
        setNotebooks(notebooks.map(nb => (nb.id === id ? { ...nb, name, color, syncStatus: 'pending' } : nb)));
    };

    const deleteNotebook = async (id: string) => {
        // Optimistic UI update: Remove notebook and its related notes
        setNotebooks(notebooks.filter(nb => nb.id !== id));
        setNotes(notes.filter(note => note.notebook !== id));

        try {
            await fetch('/api/notebooks', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
        } catch (error) {
            console.error("Failed to delete notebook", error);
        }
    };


    // Note operations
    const addNote = (title: string, content: JSONContent, notebookId: string, createdAtUnixTs: number) => {
        if (!user) return;

        const newNote: Note = {
            id: uuidv4(),
            title,
            userId: user.id,
            content,
            notebook: notebookId,
            createdAtUnixTs,
            syncStatus: 'pending',
        };
        setNotes([...notes, newNote]);
    };

    const editNote = (id: string, title: string, content: JSONContent) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, title, content, syncStatus: 'pending' } : note)));
    };

    const deleteNote = async (id: string) => {
        // Optimistic UI update
        setNotes(notes.filter(note => note.id !== id));

        try {
            await fetch('/api/notes', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };


    const moveNote = (id: string, notebookId: string) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, notebook: notebookId, syncStatus: 'pending' } : note)));
    };

    const pinNote = (id: string) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, isPinned: !note.isPinned, syncStatus: 'pending' } : note)));
    };

    return (
        <NotesContext.Provider value={{
            notebooks,
            notes,
            currentNotebook,
            setCurrentNotebook,
            addNotebook,
            editNotebook,
            deleteNotebook,
            addNote,
            editNote,
            deleteNote,
            pinNote,
            moveNote
        }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
