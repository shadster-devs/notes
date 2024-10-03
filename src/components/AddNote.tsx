import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useNotes} from "@/contexts/NotesContext";
import {useToast} from "@/hooks/use-toast";

const AddNote: React.FC = () => {
    const { toast } = useToast();
    const {addNote,currentCategory,currentNotebook} = useNotes();
    const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = React.useState<boolean>(false);
    const [newNoteTitle, setNewNoteTitle] = React.useState<string>('');

    const handleAddNote = (noteTitle: string) => {
        if (!currentNotebook) {
            toast({
                title: "Select Notebook!",
                description: "Please select a notebook to add a note.",
                variant: "destructive"
            });
            return;
        }
        if (!currentCategory) {
            toast({
                title: "Select Category!",
                description: "Please select a category to add a note.",
                variant: "destructive"
            });
            return;
        }
        if (!currentNotebook.categories.length) {
            toast({
                title: "Add Category!",
                description: "Please add a category to the selected notebook.",
                variant: "destructive"
            });
            return;
        }

        addNote(noteTitle, 'Example content', currentNotebook.id, currentCategory.id);
    };


    return (
        <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2" size={16} /> New Note
                </Button>
            </DialogTrigger>
            <DialogContent className={"bg-accent text-primary"}>
                <DialogHeader>
                    <DialogTitle>Create Note</DialogTitle>
                </DialogHeader>
                <Input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Enter Note Title"
                    className="mt-2"
                />
                <div className={'flex justify-end'}>
                <Button onClick={()=>{
                    handleAddNote(newNoteTitle);
                    setIsNewNoteDialogOpen(false);
                }} className="mt-4 w-1/3">Create</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddNote;