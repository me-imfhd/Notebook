"use client";

import ReactMarkdown from "react-markdown";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";
import { useTheme } from "next-themes";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import rehypeRaw from "rehype-raw";

SyntaxHighlighter.registerLanguage("typescript", typescript);

const HTML_COMMENT_REGEX = new RegExp("<!--([\\s\\S]*?)-->", "g");

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const syntaxHighlighterTheme = theme === "light" ? vs : vscDarkPlus;

  return (
    <ReactMarkdown
      className={className}
      components={{
        a: ({ className, ...props }) => (
          <a className={clsx(className, "text-blue-500")} {...props} />
        ),
        ul: ({ className, ...props }) => (
          <ul className={clsx(className, "list-disc ps-10")} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol className={clsx(className, "list-decimal ps-10")} {...props} />
        ),
        li: ({ className, ...props }) => (
          <li className={clsx(className, "my-1")} {...props} />
        ),
        h1: ({ className, ...props }) => (
          <h1
            className={clsx(className, "mb-2 pb-2 text-3xl font-bold")}
            {...props}
          />
        ),
        h2: ({ className, ...props }) => (
          <h2
            className={clsx(className, "mb-2 pb-2 text-2xl font-bold")}
            {...props}
          />
        ),
        h3: ({ className, ...props }) => (
          <h3
            className={clsx(className, "mb-2 pb-2 text-xl font-bold")}
            {...props}
          />
        ),
        p: ({ className, ...props }) => (
          <p className={clsx(className, "mb-4")} {...props} />
        ),
        code({ inline, className, children, style: _, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              PreTag="section" // parent tag
              className={clsx(className, "rounded-xl dark:rounded-md")}
              language={match[1]}
              style={syntaxHighlighterTheme} // theme
              customStyle={{ fontSize: "inherit" }}
              codeTagProps={{
                style: {
                  // overrides
                  fontSize: "inherit",
                  lineHeight: "inherit",
                },
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="rounded-md border border-zinc-300 bg-neutral-200 px-1 py-[0.10rem] font-mono text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {children}
            </code>
          );
        },
        details: ({ ...props }) => <details {...props} />,
        summary: ({ ...props }) => <summary {...props} />,
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins={[rehypeRaw as any]}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
}
