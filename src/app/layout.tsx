"use client"
import localFont from "next/font/local";
import "./globals.css";
import {NotesProvider} from "@/contexts/NotesProvider";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/contexts/ThemeProvider";

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
        <head>
            <script defer data-website-id="670cf16bbb172ebbfe357d6e"
                    data-domain="notes-opal-phi.vercel.app"
                    src="https://datafa.st/js/script.js"></script>
        </head>
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
    );
}
