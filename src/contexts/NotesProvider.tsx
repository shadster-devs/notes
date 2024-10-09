"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {Notebook, Note} from "@/utils/types";
import {JSONContent} from "novel";

type NotesContextType = {
    notebooks: Notebook[];
    notes: Note[];
    source: 'localStorage' | 'mongo';
    setSource: (source: 'localStorage' | 'mongo') => void;

    currentNotebook: Notebook | null;
    setCurrentNotebook: (notebook: Notebook |  null) => void;
    addNotebook: (name: string) => void;
    editNotebook: (id: number, name: string) => void;
    deleteNotebook: (id: number) => void;

    pinNote: (id: number) => void;
    addNote: (title: string, content: JSONContent, notebookId: number) => void;
    editNote: (id: number, title: string, content: JSONContent) => void;
    deleteNote: (id: number) => void;
};

// Default context state
const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
    children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = (props) => {

    const {children} = props;

    const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
        if (typeof localStorage !== 'undefined') {
            return JSON.parse(localStorage.getItem('notebooks') || '[]');
        }
        return [];
    });

    const [notes, setNotes] = useState<Note[]>(() => {
        if (typeof localStorage !== 'undefined') {
            return JSON.parse(localStorage.getItem('notes') || '[]');
        }
        return [];
    });

    const [source, setSource] = useState<'localStorage' | 'mongo'>('localStorage');

    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);

    const pinNote = (id: number) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)));
    }

    // Function to load data based on source setting
    const loadData = useCallback(() => {
        if (source === 'localStorage') {

            if (typeof localStorage === 'undefined') {
                return;
            }
            // Load data from localStorage
            const storedNotebooks = JSON.parse(localStorage.getItem('notebooks') || '[]');
            const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');

            setNotebooks(storedNotebooks);
            setNotes(storedNotes);
        }
    }, [source]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setCurrentNotebook((prev) => {
            return notebooks.find((nb) => nb.id === prev?.id) || notebooks[0];
        })
    }, [notebooks]);

    // Helper function to save data to localStorage if source is localStorage
    const saveDataToLocalStorage = () => {
        if (source === 'localStorage') {
            if (typeof localStorage === 'undefined') {
                return;
            }
            localStorage.setItem('notebooks', JSON.stringify(notebooks));
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    };

    useEffect(() => {
        saveDataToLocalStorage();
    }, [notebooks, notes,saveDataToLocalStorage]);

    // Notebook operations
    const addNotebook = (name: string) => {
        const newNotebook = { id: notebooks.length + 1, name };
        setNotebooks([...notebooks, newNotebook]);
    };

    const editNotebook = (id: number, name: string) => {
        setNotebooks(notebooks.map(nb => (nb.id === id ? { ...nb, name } : nb)));
    };

    const deleteNotebook = (id: number) => {
        setNotebooks(notebooks.filter(nb => nb.id !== id));
        setNotes(notes.filter(note => note.notebook !== id));
    };

    // Note operations
    const addNote = (title: string, content:JSONContent, notebookId: number) => {
        const newNote = { id: notes.length + 1, title, content, notebook: notebookId};
        setNotes([...notes, newNote]);
    };

    const editNote = (id: number, title: string, content: JSONContent) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, title, content } : note)));
    };

    const deleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <NotesContext.Provider value={{
        notebooks,
            notes,
            source,
            currentNotebook,
            setCurrentNotebook,
            setSource,
            addNotebook,
            editNotebook,
            deleteNotebook,
            addNote,
            editNote,
            deleteNote,
            pinNote
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
