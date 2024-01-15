"use client";

import { trpc } from "@notebook/trpc/trpc/client";

export default function IndexPage() {
  if (!process.env.NOTION_PAGE_ID) {
    throw new Error("Please correctly set you NOTION_PAGE_ID in your .env");
  }
  const { data, isLoading } = trpc.notion.getPageResponse.useQuery({
    pageId: process.env.NOTION_PAGE_ID,
  });
  if (isLoading) return <div>Loading...</div>;
  data ? console.log(data) : console.log("page loading...");
  return <div>See console</div>;
}
