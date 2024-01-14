"use client";

import { trpc } from "@notebook/trpc/trpc/client";

export default function IndexPage() {
  const { data, isLoading } = trpc.notion.getPageResponse.useQuery({
    pageId: "6c14976996a44188b29b5c016fc16c72",
  });
  if (isLoading) return <div>Loading...</div>;
  data ? console.log(data) : console.log("page loading...");
  return <div>See console</div>;
}
