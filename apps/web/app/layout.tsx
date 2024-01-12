import "@/styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@notebook/ui/components";
import TailwindResposivenessIndicator from "@notebook/ui/components/TailwindResposivenessIndicator";
import type { PropsWithChildren } from "react";
import Provider from "./_provider";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Notebook",
  description: "",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const inter = Inter({ subsets: ["latin"] });

// You might be wonder where is session provider for next-auth, well we necessarily don't need it in app router
export default function RootLayout({ children }: PropsWithChildren) {
  const myHeaders = new Headers();
  myHeaders.set("Notion-Version", " 2022-06-28");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
      >
        <Provider>
          {children}
          <TailwindResposivenessIndicator />
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
