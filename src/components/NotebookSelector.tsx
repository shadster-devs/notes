import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/contexts/NotesProvider";
import { Notebook } from "@/utils/types";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful";

const NotebookSelector: React.FC = () => {
    const { notebooks, addNotebook, editNotebook, deleteNotebook, setCurrentNotebook, currentNotebook } = useNotes();

    const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);
    const [newNotebookName, setNewNotebookName] = useState<string>('');
    const [newNotebookColor, setNewNotebookColor] = useState<string>('#FF0000');
    const [isNewNotebookDialogOpen, setIsNewNotebookDialogOpen] = useState<boolean>(false);
    const [isEditNotebookDialogOpen, setIsEditNotebookDialogOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const handleAddNotebook = useCallback(() => {
        if (newNotebookName.trim() === '') {
            toast.error("Notebook name can't be empty.");
            return;
        }
        if (notebooks.some(nb => nb.name.toLowerCase() === newNotebookName.trim().toLowerCase())) {
            toast.error("A notebook with this name already exists.");
            return;
        }

        addNotebook(newNotebookName.trim(), newNotebookColor);
        setNewNotebookName(''); // Reset notebook name
        setNewNotebookColor('#FF0000'); // Reset color
        setIsNewNotebookDialogOpen(false);
        toast.success(`Notebook "${newNotebookName.trim()}" has been added.`);
    }, [newNotebookName, newNotebookColor, notebooks, addNotebook]);

    const handleEditNotebook = useCallback(() => {
        if (!editingNotebook) return;

        if (editingNotebook.name.trim() === '') {
            toast.error("Notebook name can't be empty.");
            return;
        }
        if (notebooks.some(nb => nb.id !== editingNotebook.id && nb.name.toLowerCase() === editingNotebook.name.trim().toLowerCase())) {
            toast.error("A notebook with this name already exists.");
            return;
        }

        editNotebook(editingNotebook.id, editingNotebook.name.trim(), editingNotebook.color || "");
        setIsEditNotebookDialogOpen(false);
        toast.success(`Notebook "${editingNotebook.name}" updated successfully.`);
    }, [editingNotebook, notebooks, editNotebook]);

    const handleDeleteNotebook = useCallback((notebookId: string) => {
        deleteNotebook(notebookId);
        toast.success("Notebook has been deleted.");
    }, [deleteNotebook]);

    const startEditing = useCallback((notebook: Notebook) => {
        setEditingNotebook({ ...notebook });
        setIsEditNotebookDialogOpen(true);
    }, []);

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {currentNotebook ? (
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: currentNotebook.color }} />
                            {currentNotebook.name}
                        </div>
                    ) : 'Select Notebook'}
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
                    <DialogContent className="bg-accent text-primary">
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
                        <div className="mt-4">
                            <label className="block mb-2">Select Color:</label>
                            <HexColorPicker color={newNotebookColor} onChange={setNewNotebookColor} />
                        </div>
                        <Button onClick={handleAddNotebook} className="mt-4">Create Notebook</Button>
                    </DialogContent>
                </Dialog>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[300px]">
                    {notebooks.map(notebook => (
                        <DropdownMenuItem
                            key={notebook.id}
                            className="flex items-center justify-between p-2 focus:bg-background"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <div
                                className="flex items-center flex-grow truncate mr-2 cursor-pointer hover:bg-accent p-2 rounded"
                                onClick={() => {
                                    setCurrentNotebook(notebook);
                                    setIsDropdownOpen(false);
                                }}
                                title={notebook.name}
                            >
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: notebook.color }} />
                                <span>{notebook.name}</span>
                            </div>
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
                        </DropdownMenuItem>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>

            <Dialog open={isEditNotebookDialogOpen} onOpenChange={setIsEditNotebookDialogOpen}>
                <DialogContent className="bg-accent text-primary">
                    <DialogHeader>
                        <DialogTitle>Edit Notebook</DialogTitle>
                    </DialogHeader>
                    {editingNotebook && (
                        <>
                            <Input
                                type="text"
                                value={editingNotebook.name}
                                onChange={(e) => setEditingNotebook({ ...editingNotebook, name: e.target.value } as Notebook)}
                                placeholder="Enter notebook name"
                                className="mt-2"
                            />
                            <div className="mt-4">
                                <label className="block mb-2">Select Color:</label>
                                <HexColorPicker
                                    color={editingNotebook.color || ""}
                                    onChange={(color) => setEditingNotebook({ ...editingNotebook, color } as Notebook)}
                                />
                            </div>
                            <Button onClick={handleEditNotebook} className="mt-4">Update Notebook</Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DropdownMenu>
    );
};

export default NotebookSelector;
