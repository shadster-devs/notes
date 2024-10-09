import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNotes } from "@/contexts/NotesProvider"; // Import context hook
import { Note } from "@/utils/types";
import {
    AlertDialog,
    AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const { deleteNote } = useNotes();

    const router = useRouter();

    const handleDelete = () => {
        deleteNote(note.id);
    };

    return (
        <Card key={note.id}>
            <CardHeader className={'p-3'}>
                <div className={'flex items-center justify-between hover:bg-background'}>
                    <Button
                        variant='ghost'
                        size='lg'
                        title={'Open Note'}
                        className={'flex-1 text-lg font-bold'}
                        onClick={() => {
                            router.push(`/${note.id}`);
                        }}
                    >
                        <span className={'truncate flex-grow text-left'}>
                            {note.title}
                        </span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger className={'p-1'}>
                                <Trash2 size={16} />
                        </AlertDialogTrigger>
                        <AlertDialogContent className={'bg-accent text-primary'}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your note.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className={'hover:bg-destructive'}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
        </Card>
    );
};

export default NoteCard;
