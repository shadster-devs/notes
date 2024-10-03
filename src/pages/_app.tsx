import "@/styles/globals.css";
import 'katex/dist/katex.min.css'
import type { AppProps } from "next/app";
import {Toaster} from "@/components/ui/toaster";
import {NotesProvider} from "@/contexts/NotesContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
          <NotesProvider>
              <Component {...pageProps} />
              <Toaster/>
          </NotesProvider>

      </>

  )
}
