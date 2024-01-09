import "@/styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@notebook/ui/components";
import { fontSans, fontMono } from "@/lib/fonts";
import TailwindResposivenessIndicator from "@notebook/ui/components/TailwindResposivenessIndicator";
import type { PropsWithChildren } from "react";
import Provider from "./_provider";
import { cn } from "@notebook/ui/cn";

export const metadata: Metadata = {
  title: "Notebook",
  description: "",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
// You might be wonder where is session provider for next-auth, well we necessarily don't need it in app router
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
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
