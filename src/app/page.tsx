"use client";
import {SignInButton, useUser} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {useRouter} from "next/navigation";

export default function Home() {

    const {isSignedIn} = useUser();

    const router = useRouter();

    if (isSignedIn) {
        router.push('/notes');
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            {/* Main Content */}
            <div className="relative text-center max-w-2xl">
                {/* Theme Toggle in top-right of text container */}
                <div className="absolute -top-10 right-0">
                    <ThemeToggle />
                </div>

                <h1 className="text-6xl font-extrabold mb-6">
                    Master Your Notes
                </h1>
                <p className="text-xl text-muted-foreground mb-12">
                    Organize your thoughts, sync across devices, and access notes anytime, anywhere.
                </p>

                {/* Features */}
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    <div className="p-6 bg-card rounded-lg border-2 border-dashed shadow-lg">
                        <h3 className="text-2xl font-bold">Sync Everywhere</h3>
                        <p className="text-muted-foreground">Real-time sync across all devices.</p>
                    </div>
                    <div className="p-6 bg-card rounded-lg border-2 border-dashed shadow-lg">
                        <h3 className="text-2xl font-bold">Organize Effortlessly</h3>
                        <p className="text-muted-foreground">Folders, tags, and notebooks.</p>
                    </div>
                    <div className="p-6 bg-card rounded-lg border-2 border-dashed shadow-lg">
                        <h3 className="text-2xl font-bold">Offline Access</h3>
                        <p className="text-muted-foreground">Manage notes even without internet.</p>
                    </div>
                </div>

                {/* CTA */}

                <div className="flex gap-8 items-center justify-center">
                    <SignInButton mode="modal">
                        <Button size="lg" className="p-8 text-2xl font-bold">
                            Sign In
                        </Button>
                    </SignInButton>
                </div>
            </div>
        </div>
    );
}
