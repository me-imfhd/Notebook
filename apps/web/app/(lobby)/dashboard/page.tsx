"use client";
import { trpc } from "@notebook/trpc/trpc/client";
import { Button, Shell, Skeleton, useToast } from "@notebook/ui/components";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function IndexPage() {
  // if (process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV) {
  //   return <div>Dashboard is not accessible in production yet.</div>;
  // }
  if (!process.env.NEXT_PUBLIC_NOTION_PAGE_ID) {
    throw new Error(
      "Please correctly set your NEXT_PUBLIC_NOTION_PAGE_ID in your .env"
    );
  }
  const { toast } = useToast();
  const pageId = process.env.NEXT_PUBLIC_NOTION_PAGE_ID;
  const [isLoading, setIsLoading] = useState(false);
  const queryInfo = trpc.useQueries((t) => [
    t.notion.notionToNextra(
      { pageId },
      { enabled: false, trpc: { abortOnUnmount: true } }
    ),
  ]);

  const refetchData = async () => {
    setIsLoading(true);
    await queryInfo[0].refetch();
    setIsLoading(false);
  };
  const data = queryInfo[0]?.data?.msg;
  useEffect(() => {
    if (data) {
      toast({
        variant: "success",
        title: "Success",
        description: data,
      });
    }
  }, [data]);
  return (
    <Shell as={"div"} className="flex flex-col">
      <div className="flex gap-4 items-center">
        <Button
          size="sm"
          onClick={() => {
            refetchData();
          }}
          disabled={isLoading}
        >
          {isLoading ? <Skeleton>Generating...</Skeleton> : "Generate Docs"}
        </Button>
        {!isLoading && data && <span>{data}</span>}
      </div>
      <Link href={"/docs"}>
        <Button variant="outline" size="sm">
          Go to docs
        </Button>
      </Link>
    </Shell>
  );
}
