"use client";
import { trpc } from "@notebook/trpc/trpc/client";
import { Button, Shell, Skeleton, useToast } from "@notebook/ui/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function IndexPage() {
  if (!process.env.NEXT_PUBLIC_NOTION_PAGE_ID) {
    throw new Error(
      "Please correctly set your NEXT_PUBLIC_NOTION_PAGE_ID in your .env"
    );
  }
  const router = useRouter();
  const { toast } = useToast();
  const pageId = process.env.NEXT_PUBLIC_NOTION_PAGE_ID;
  const [isLoading, setIsLoading] = useState(false);
  const queryInfo = trpc.useQueries((t) => [
    t.notion.notionToNextra(
      { pageId },
      { enabled: false, trpc: { abortOnUnmount: true } }
    ),
  ]);
  const utils = trpc.useUtils();

  const refetchData = async () => {
    setIsLoading(true);
    await queryInfo[0].refetch();
    setIsLoading(false);
  };
  const cancelQuery = async () => {
    utils.invalidate();
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Success",
      description: "Generation Aborted Successfully",
    });
  };
  const data = queryInfo[0]?.data?.msg;
  if (data) {
    toast({
      variant: "success",
      title: "Success",
      description: queryInfo[0].data?.msg,
    });
  }
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
        {isLoading ? (
          <Button
            onClick={() => {
              cancelQuery();
            }}
            variant="outline"
          >
            Cancel
          </Button>
        ) : null}
      </div>
      <Button
        size="sm"
        onClick={() => {
          router.push("/docs");
        }}
      >
        Go to docs
      </Button>
    </Shell>
  );
}
