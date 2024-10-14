"use client";

import NotesList from "@/components/NotesList";
;
import React, { useState } from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

export default function Notes() {

    const {isSignedIn} = useUser();

    const router = useRouter();

    if (!isSignedIn) {
        router.push('/');
    }


    return (
        <div className={`min-h-screen h-64`}>
            <NotesList/>
        </div>
    );
}
