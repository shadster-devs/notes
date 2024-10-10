import React from 'react';
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {ChevronDown, Move, Star, Trash2} from "lucide-react";
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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const { deleteNote , pinNote, moveNote, notebooks} = useNotes();

    const router = useRouter();

    const handleDelete = () => {
        deleteNote(note.id);
    };

    const [isMoveNoteDialogOpen, setIsMoveNoteDialogOpen] = React.useState<boolean>(false);
    const [moveNotebookId, setMoveNotebookId] = React.useState<number>(0);

    const notebook = notebooks.find((nb)=>nb.id === note.notebook);

    const backgroundColor = notebook?.color || 'var(--bg-secondary)';

    const hexToRgba = (hex: string, alpha = 1) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <Card
            key={note.id}
            style={{ backgroundColor: hexToRgba(backgroundColor, 0.07) }}
        >
            <CardHeader className={'p-3 rounded overflow-hidden'}>
                <div className={'flex items-center justify-between rounded-md overflow-hidden'}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='lg'
                                    title={'Open Note'}
                                    className={'flex-1 text-lg font-bold justify-start px-2 truncate hover:border-2'}
                                    onClick={() => {
                                        router.push(`/${note.id}`);
                                    }}
                                >
                                    <div className={'w-3 h-3 rounded-full mr-2'} style={{backgroundColor: backgroundColor}}/>
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
                    <Button variant='ghost' size='icon' className={`p-1 hover:border-2`} onClick={()=>pinNote(note.id)}>
                        <Star size={16} fill={note.isPinned ? 'hsl(var(--primary))' : 'none'} />
                    </Button>


                    <Dialog open={isMoveNoteDialogOpen} onOpenChange={setIsMoveNoteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-1 hover:border-2">
                                <Move size={16} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-accent text-primary p-6 rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Move Note To</DialogTitle>
                            </DialogHeader>

                            <div className="mt-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full flex justify-between items-center">
                                            {moveNotebookId === 0 ? (
                                                <span className="text-muted-foreground flex items-center justify-between w-full">
                                {'Select Notebook'} <ChevronDown size={16} className="ml-2" />
                            </span>
                                            ) : (
                                                <span className="flex items-center justify-between w-full">
                                {notebooks.find((nb) => nb.id === moveNotebookId)?.name}
                                                    <ChevronDown size={16} className="ml-2" />
                            </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full bg-white rounded-md shadow-md">
                                        {notebooks.filter((nb)=>(
                                            nb.id !== note.notebook
                                        )).map((nb) => (
                                            <DropdownMenuItem
                                                key={nb.id}
                                                className="flex items-center px-4 py-2 hover:bg-accent"
                                                onSelect={() => setMoveNotebookId(nb.id)}
                                            >
                                                {nb.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <DialogFooter>
                                <Button  onClick={() => {
                                    moveNote(note.id, moveNotebookId);
                                    setIsMoveNoteDialogOpen(false);
                                }} className="w-full p-2 mt-4">
                                    Move
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                    <AlertDialog>
                        <AlertDialogTrigger  asChild>
                            <Button variant='ghost' size='icon' className={'p-1 hover:border-2'} >
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
