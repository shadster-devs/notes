"use client";

import React from 'react';
import { NotesProvider } from '@/contexts/NotesProvider';
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation"; // Assuming you have NotesProvider context

export default function NotesLayout({
                                        children, // This will be the child page (e.g., note detail page or list of notes)
                                    }: {
    children: React.ReactNode;
}) {

    const {isSignedIn} = useUser();

    const router = useRouter();

    if (!isSignedIn) {
        router.push('/');
    }



    return (
        <NotesProvider>
            {children}
        </NotesProvider>
    );
}
