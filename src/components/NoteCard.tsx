import React from 'react';
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Star, Trash2} from "lucide-react";
import { useNotes } from "@/contexts/NotesProvider"; // Import context hook
import { Note } from "@/utils/types";
import {
    AlertDialog,
    AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"; // Use 'next/navigation' for App Router

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const { deleteNote , pinNote} = useNotes();

    const router = useRouter();

    const handleDelete = () => {
        deleteNote(note.id);
    };

    return (
        <Card key={note.id}>
            <CardHeader className={'p-3'}>
                <div className={'flex items-center justify-between hover:bg-background'}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='lg'
                                    title={'Open Note'}
                                    className={'flex-1 text-lg font-bold justify-start px-2 truncate'}
                                    onClick={() => {
                                        router.push(`/${note.id}`);
                                    }}
                                >
                                    <span className={'truncate flex-grow text-left'}>
                                        {note.title}
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{note.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button variant='ghost' size='icon' className={'p-1'} onClick={()=>pinNote(note.id)}>
                        <Star size={16} fill={note.isPinned ? 'hsl(var(--primary))' : 'none'} />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger  asChild>
                            <Button variant='ghost' size='icon' className={'p-1'} >
                                <Trash2 size={16}/>
                            </Button>
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
            <CardFooter className="p-3 justify-end">
                <p className="text-muted-foreground text-sm">
                    {new Date(note.createdAtUnixTs).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}{" "}
                    {new Date(note.createdAtUnixTs).toLocaleDateString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })}
                </p>
            </CardFooter>

        </Card>
    );
};

export default NoteCard;
