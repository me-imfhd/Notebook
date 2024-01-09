"use client";
import { trpc } from "@notebook/trpc/trpc/client";
import { Shell, Skeleton } from "@notebook/ui/components";
import { useRef } from "react";

export default function Page() {
  const { data: respData, isLoading } = trpc.notion.getSimpleBlocks.useQuery(
    "dd3ccda0f5fd4bee8b545cf6451dcf17"
  );

  const data = respData;

  console.log(data);
  return (
    <Shell
      as={"div"}
      className="flex flex-col text-white place-items-center justify-center"
    >
      {isLoading ? (
        <Skeleton className="bg-muted w-full h-[100vh] "></Skeleton>
      ) : (
        <span className="text-wrap w-46">{data}</span>
      )}
    </Shell>
  );
}
