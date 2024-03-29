import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  generateSinglePageFile,
  getMarkdownContent,
  notion2Nextra,
} from "@notebook/api/api-endpoint-blogic/notion/mutations";
import { z } from "zod";
import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import { n2nPerPageInputSchema, notionToNextraInputSchema } from "@notebook/db";

export const notionRouter = createTRPCRouter({
  notionToNextra: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "POST",
        path: "/notion-to-nextra",
        tags: ["notion"],
      },
    })
    .input(notionToNextraInputSchema)
    .output(z.object({ msg: z.string() }))
    .mutation(async ({ input }) => {
      if (process.env.VERCEL_ENV || process.env.NODE_ENV === "production") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "This request is restricted from being used in production from anyone ",
        });
      }
      try {
        const client = new Client({ auth: input.token });

        const n2m = new NotionToMarkdown({
          notionClient: client,
          config: {
            separateChildPage: true,
          },
        });

        const { results: notionBlockList } = await client.blocks.children.list({
          block_id: input.pageId,
        });
        const mdBlocks = await n2m.blocksToMarkdown(notionBlockList);
        console.log(mdBlocks);
        const res = await notion2Nextra({
          pageName: [],
          mdBlocks,
          n2m,
          rootRoute: input.rootRoute,
        });

        return res;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
  notionToNextraPerPage: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "POST",
        path: "/notion-to-nextra-per-page",
        tags: ["notion"],
      },
    })
    .input(n2nPerPageInputSchema)
    .output(z.object({ msg: z.string() }))
    .mutation(async ({ input }) => {
      if (process.env.VERCEL_ENV || process.env.NODE_ENV === "production") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "This request is restricted from being used in production from anyone ",
        });
      }
      try {
        const client = new Client({ auth: input.token });

        const n2m = new NotionToMarkdown({
          notionClient: client,
        });

        const mdBlocks = await n2m.pageToMarkdown(input.pageId);
        console.log(mdBlocks);
        const content = getMarkdownContent(mdBlocks, n2m);
        generateSinglePageFile({
          rootRoute: input.rootRoute,
          pageName: input.pageName,
          content,
        });
        return { msg: "Your New Page is Added" };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
});
