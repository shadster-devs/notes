"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {Notebook, Note, Category} from "@/utils/types";
import {JSONContent} from "novel";

type NotesContextType = {
    notebooks: Notebook[];
    categories: Category[];
    notes: Note[];
    source: 'localStorage' | 'mongo';
    setSource: (source: 'localStorage' | 'mongo') => void;

    currentNotebook: Notebook | null;
    setCurrentNotebook: (notebook: Notebook |  null) => void;
    addNotebook: (name: string) => void;
    editNotebook: (id: number, name: string) => void;
    deleteNotebook: (id: number) => void;

    currentCategory: Category | null;
    setCurrentCategory: (category: Category | null) => void;
    addCategory: (notebookId: number, name: string) => void;
    editCategory: (id: number, name: string) => void;
    deleteCategory: (id: number) => void;
    addNote: (title: string, content: JSONContent, notebookId: number, categoryId: number) => void;
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

    const [categories, setCategories] = useState<Category[]>(() => {
        if (typeof localStorage !== 'undefined') {
            return JSON.parse(localStorage.getItem('categories') || '[]');
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
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    // Function to load data based on source setting
    const loadData = useCallback(() => {
        if (source === 'localStorage') {

            if (typeof localStorage === 'undefined') {
                return;
            }
            // Load data from localStorage
            const storedNotebooks = JSON.parse(localStorage.getItem('notebooks') || '[]');
            const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
            const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');

            setNotebooks(storedNotebooks);
            setCategories(storedCategories);
            setNotes(storedNotes);
        }
    }, [source]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setCurrentCategory((prev) => {
            return categories.find((cat) => cat.id === prev?.id) || categories[0];
        })
    }, [categories]);

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
            localStorage.setItem('categories', JSON.stringify(categories));
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    };

    useEffect(() => {
        saveDataToLocalStorage();
    }, [notebooks, categories, notes,saveDataToLocalStorage]);

    // Notebook operations
    const addNotebook = (name: string) => {
        const newNotebook = { id: notebooks.length + 1, name, categories: [] };
        setNotebooks([...notebooks, newNotebook]);
    };

    const editNotebook = (id: number, name: string) => {
        setNotebooks(notebooks.map(nb => (nb.id === id ? { ...nb, name } : nb)));
    };

    const deleteNotebook = (id: number) => {
        setNotebooks(notebooks.filter(nb => nb.id !== id));
        setCategories(categories.filter(cat => cat.id !== id));
        setNotes(notes.filter(note => note.notebook !== id));
    };

    // Category operations
    const addCategory = (notebookId: number, name: string) => {
        const newCategory = { id: categories.length + 1, name };
        setCategories([...categories, newCategory]);

        // Update the notebook to include this category
        setNotebooks(
            notebooks.map(nb =>
                nb.id === notebookId ? { ...nb, categories: [...nb.categories, newCategory.id] } : nb
            )
        );
    };

    const editCategory = (id: number, name: string) => {
        setCategories(categories.map(cat => (cat.id === id ? { ...cat, name } : cat)));
    };

    const deleteCategory = (id: number) => {
        setCategories(categories.filter(cat => cat.id !== id));
        setNotes(notes.filter(note => note.category !== id));
    };

    // Note operations
    const addNote = (title: string, content:JSONContent, notebookId: number, categoryId: number) => {
        const newNote = { id: notes.length + 1, title, content, notebook: notebookId, category: categoryId };
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
            categories,
            notes,
            source,
            currentNotebook,
            setCurrentNotebook,
            currentCategory,
            setCurrentCategory,
            setSource,
            addNotebook,
            editNotebook,
            deleteNotebook,
            addCategory,
            editCategory,
            deleteCategory,
            addNote,
            editNote,
            deleteNote
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
