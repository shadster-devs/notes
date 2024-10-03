"use client";

import { EditorContent, EditorRoot, JSONContent } from "novel";
import React from "react";
import {defaultExtensions} from "@/components/extensions";

interface NoteEditorProps {
    content: JSONContent;
    handleContentUpdate: (content: JSONContent) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ content, handleContentUpdate }) => {
    return (
        <EditorRoot>
            <EditorContent extensions={[...defaultExtensions]}
                initialContent={content}
                onUpdate={({ editor }) => {
                    const json = editor.getJSON();
                    handleContentUpdate(json);
                }}
            />
        </EditorRoot>
    );
};

export default NoteEditor;
