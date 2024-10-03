import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, Plus, Trash2, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNotes } from "@/contexts/NotesContext"; // Import context hook

const CategorySelector: React.FC = () => {
    const { toast } = useToast();
    const { categories, addCategory, editCategory, deleteCategory, currentNotebook, currentCategory, setCurrentCategory } = useNotes();

    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [editedCategoryName, setEditedCategoryName] = useState<string>('');
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const filteredCategories = categories.filter(category => currentNotebook?.categories.includes(category.id));

    const handleAddCategory = () => {
        if (!currentNotebook) {
            toast({
                title: "Select Notebook!",
                description: "Please select a notebook to add a category.",
                variant: "destructive"
            });
            return;
        }

        if (newCategoryName.trim() === '') {
            toast({
                title: "Invalid Name!",
                description: "Category name can't be empty.",
                variant: "destructive"
            });
            return;
        }
        if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            toast({
                title: "Duplicate Name!",
                description: "A category with the same name already exists.",
                variant: "destructive"
            });
            return;
        }

        addCategory(currentNotebook!.id, newCategoryName.trim()); // Use context function
        setNewCategoryName('');
        setIsNewCategoryDialogOpen(false);
        toast({
            title: "Category Created",
            description: `"${newCategoryName.trim()}" has been added.`,
            variant: "default"
        });
    };

    const handleEditCategory = (categoryId: number, newName: string) => {
        if (newName.trim() === '') {
            toast({
                title: "Invalid Name!",
                description: "Category name can't be empty.",
                variant: "destructive"
            });
            return;
        }
        if (categories.some(cat => cat.id !== categoryId && cat.name.toLowerCase() === newName.trim().toLowerCase())) {
            toast({
                title: "Duplicate Name!",
                description: "A category with this name already exists.",
                variant: "destructive"
            });
            return;
        }

        editCategory(categoryId, newName.trim()); // Use context function
        setEditCategoryId(null);
        toast({
            title: "Category Updated",
            description: `Category renamed to "${newName.trim()}".`,
            variant: "default"
        });
    };

    const handleDeleteCategory = (categoryId: number) => {
        deleteCategory(categoryId); // Use context function
        if (currentCategory?.id === categoryId) {
            setCurrentCategory(null);
        }
        toast({
            title: "Category Deleted",
            description: "The category has been removed.",
            variant: "default"
        });
    };

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                    {currentCategory ? currentCategory.name : 'Select Category'}
                    <ChevronDown className="ml-2" size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2" size={16} />
                            Add New Category
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className={"bg-accent text-primary"}>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="mt-2"
                        />
                        <Button onClick={handleAddCategory} className="mt-4">Create Category</Button>
                    </DialogContent>
                </Dialog>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[300px]">
                    {filteredCategories.map(category => (
                        <DropdownMenuItem
                            key={category.id}
                            className="flex items-center justify-between p-2 hover:bg-background"
                            onSelect={(e) => e.preventDefault()}
                        >
                            {editCategoryId === category.id ? (
                                <div className="flex items-center w-full space-x-2">
                                    <Input
                                        type="text"
                                        value={editedCategoryName}
                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleEditCategory(category.id, editedCategoryName);
                                            } else if (e.key === 'Escape') {
                                                setEditCategoryId(null);
                                            }
                                        }}
                                        className="flex-grow"
                                        autoFocus
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditCategory(category.id, editedCategoryName)}
                                    >
                                        <Check size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className="flex-grow truncate mr-2 cursor-pointer"
                                        onClick={() => {
                                            setCurrentCategory(category);
                                            setIsDropdownOpen(false);
                                        }}
                                        title={category.name}
                                    >
                                        {category.name}
                                    </span>
                                    <div className="flex-shrink-0 space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditCategoryId(category.id);
                                                setEditedCategoryName(category.name);
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCategory(category.id);
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

export default CategorySelector;
