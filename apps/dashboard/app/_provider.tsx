"use client";

import { SessionProvider } from "@notebook/auth/react";
import TrpcProvider from "@notebook/trpc/trpc/Provider";
import { ThemeProvider } from "@notebook/ui/components/ThemeProvider";
import type { PropsWithChildren } from "react";

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TrpcProvider>
        <SessionProvider>{children}</SessionProvider>
      </TrpcProvider>
    </ThemeProvider>
  );
};

export default Provider;
