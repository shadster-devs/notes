"use client"
import localFont from "next/font/local";
import "./globals.css";
import {NotesProvider} from "@/contexts/NotesContext";
import {Toaster} from "@/components/ui/sonner";

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
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <NotesProvider>

            {children}
        </NotesProvider>
        <Toaster position={'bottom-right'}/>
        </body>
        </html>
    );
}
