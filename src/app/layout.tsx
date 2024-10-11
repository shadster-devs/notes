"use client"
import localFont from "next/font/local";
import "./globals.css";
import {NotesProvider} from "@/contexts/NotesProvider";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/contexts/ThemeProvider";
import {ClerkProvider} from "@clerk/nextjs";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <NotesProvider>
                {children}
            </NotesProvider>
        </ThemeProvider>
        <Toaster position={'bottom-right'}/>
        </body>
        </html>
        </ClerkProvider>
    );
}
