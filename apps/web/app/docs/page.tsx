"use client";
import { trpc } from "@notebook/trpc/trpc/client";
import { Markdown, Shell, Skeleton } from "@notebook/ui/components";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import second from "remark-toc";

export default function Page() {
  const data = useRef<string>();
  const { data: resp, isLoading } = trpc.notion.getPageResponse.useQuery(
    "72339b5b811b4865a90a81ea359028a0"
  );
  resp ? (data.current = resp) : null;
  // const [content, setContent] = useState("");

  // useEffect(() => {
  //   fetch("../../output.md")
  //     .then((res) => res.text())
  //     .then((text) => setContent(text));
  // }, []);
  // data.current = resp;
  return (
    <Shell
      as={"div"}
      className="flex flex-col text-white place-items-center justify-center"
    >
      {isLoading || !data.current ? (
        <Skeleton className="bg-muted w-full h-[100vh] "></Skeleton>
      ) : (
        <Markdown className="p-2">{data.current}</Markdown>
      )}
    </Shell>
  );
}
