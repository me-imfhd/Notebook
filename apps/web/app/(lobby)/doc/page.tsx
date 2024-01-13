"use client";

import { trpc } from "@notebook/trpc/trpc/client";

export default function IndexPage() {
  const { data } = trpc.notion.getPageResponse.useQuery({
    pageId: "52b49c8c71a84a37ace28fe6c2926f68",
  });
  data ? console.log(data) : console.log("page loading...");
  return <div>See console</div>;
}
