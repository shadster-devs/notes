import { Note, Notebook } from '@/utils/types';

export const initializeNotebooks = () : Notebook[]  => {
    if(typeof localStorage === 'undefined'){
        return [];
    }

    const notebooks = localStorage.getItem('notebooks');
    if(notebooks){
        return JSON.parse(notebooks);
    }
    return [
        { id: 1, name: 'Work', categories: ['Meetings', 'Projects'] },
        { id: 2, name: 'Personal', categories: ['Ideas', 'To-Do'] },
    ];
}

export const getNotesList = (notebookId: number, category: string, searchTerm: string) => {
    if(typeof localStorage === 'undefined'){
        return [];
    }

    const notes = localStorage.getItem('notes');
    if(!notes){
        return [];
    }

    const parsedNotes : Note[] = JSON.parse(notes);

    return parsedNotes.filter(note =>
        (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!notebookId || note.notebook === notebookId) &&
        (!category || note.category === category)
    );
}

