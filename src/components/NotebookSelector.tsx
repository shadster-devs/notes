import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, Plus, Trash2, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesContext"; // Import the context hook
import { Notebook } from "@/utils/types";

const NotebookSelector: React.FC = () => {
    const { toast } = useToast();
    const { notebooks, addNotebook, editNotebook, deleteNotebook, setCurrentNotebook, currentNotebook } = useNotes();

    const [editNotebookId, setEditNotebookId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const [newNotebookName, setNewNotebookName] = useState<string>('');
    const [isNewNotebookDialogOpen, setIsNewNotebookDialogOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const editInputRef = useRef<HTMLInputElement>(null!);

    const handleAddNotebook = useCallback(() => {
        if (newNotebookName.trim() === '') {
            toast({
                title: "Invalid Name",
                description: "Notebook name can't be empty.",
                variant: "destructive"
            });
            return;
        }
        if (notebooks.some(nb => nb.name.toLowerCase() === newNotebookName.trim().toLowerCase())) {
            toast({
                title: "Duplicate Name",
                description: "A notebook with this name already exists.",
                variant: "destructive"
            });
            return;
        }

        addNotebook(newNotebookName.trim()); // Use context function
        setNewNotebookName('');
        setIsNewNotebookDialogOpen(false);
        toast({
            title: "Notebook Created",
            description: `"${newNotebookName.trim()}" has been added.`,
            variant: "default"
        });
    }, [newNotebookName, notebooks, addNotebook, toast]);

    const handleEditNotebook = useCallback((notebook: Notebook, newName: string) => {
        if (newName.trim() === '') {
            toast({
                title: "Invalid Name",
                description: "Notebook name can't be empty.",
                variant: "destructive"
            });
            return;
        }
        if (notebooks.some(nb => nb.id !== notebook.id && nb.name.toLowerCase() === newName.trim().toLowerCase())) {
            toast({
                title: "Duplicate Name",
                description: "A notebook with this name already exists.",
                variant: "destructive"
            });
            return;
        }

        editNotebook(notebook.id, newName.trim()); // Use context function
        setEditNotebookId(null);
        toast({
            title: "Notebook Updated",
            description: `Notebook renamed to "${newName.trim()}".`,
            variant: "default"
        });
    }, [notebooks, editNotebook, toast]);

    const handleDeleteNotebook = useCallback((notebookId: number) => {
        deleteNotebook(notebookId); // Use context function
        toast({
            title: "Notebook Deleted",
            description: "The notebook has been removed.",
            variant: "default"
        });
    }, [deleteNotebook, toast]);

    const startEditing = useCallback((notebook: Notebook) => {
        setEditNotebookId(notebook.id);
        setEditedName(notebook.name);
        setTimeout(() => editInputRef.current?.focus(), 0);
    }, []);

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {currentNotebook ? currentNotebook.name : 'Select Notebook'}
                    <ChevronDown className="ml-2" size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                <Dialog open={isNewNotebookDialogOpen} onOpenChange={setIsNewNotebookDialogOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2" size={16} />
                            Add New Notebook
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className={"bg-accent text-primary"}>
                        <DialogHeader>
                            <DialogTitle>Create New Notebook</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            value={newNotebookName}
                            onChange={(e) => setNewNotebookName(e.target.value)}
                            placeholder="Enter notebook name"
                            className="mt-2"
                        />
                        <Button onClick={handleAddNotebook} className="mt-4">Create Notebook</Button>
                    </DialogContent>
                </Dialog>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[300px]">
                    {notebooks.map(notebook => (
                        <DropdownMenuItem
                            key={notebook.id}
                            className="flex items-center justify-between p-2 hover:bg-background"
                            onSelect={(e) => e.preventDefault()}
                        >
                            {editNotebookId === notebook.id ? (
                                <div className="flex items-center w-full space-x-2">
                                    <Input
                                        ref={editInputRef}
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleEditNotebook(notebook, editedName);
                                            } else if (e.key === 'Escape') {
                                                setEditNotebookId(null);
                                            }
                                        }}
                                        className="flex-grow"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditNotebook(notebook, editedName)}
                                    >
                                        <Check size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className="flex-grow truncate mr-2 cursor-pointer"
                                        onClick={() => {
                                            setCurrentNotebook(notebook);
                                            setIsDropdownOpen(false);
                                        }}
                                        title={notebook.name}
                                    >
                                        {notebook.name}
                                    </span>
                                    <div className="flex-shrink-0 space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(notebook);
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNotebook(notebook.id);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </DropdownMenuItem>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotebookSelector;
