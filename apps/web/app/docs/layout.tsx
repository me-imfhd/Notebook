import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProfileHeader } from "@/components/layout/profile-header";
import React from "react";

export default function DocsLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start ">{children}</div>
    </div>
  );
}
