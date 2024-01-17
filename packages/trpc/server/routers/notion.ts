import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { notion2Nextra } from "@notebook/api/api-endpoint-blogic/notion/queries";
import { z } from "zod";
import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";

const notionToNextraInputSchema = z.object({
  pageId: z.string().min(32).max(36),
  rootRoute: z.object({
    name: z.string().refine(
      (name) => {
        // Check if name is empty
        if (!name) return false;

        // Check if name starts with a period or a hyphen
        if (
          name.startsWith(".") ||
          name.startsWith("-") ||
          name.startsWith("/")
        )
          return false;

        // Check if name contains invalid characters
        const invalidCharacters = /[\:*?"<>|]/;
        if (invalidCharacters.test(name)) return false;

        // Check if name exceeds maximum length
        if (name.length > 255) return false;

        return true;
      },
      {
        message: "Invalid directory name",
      }
    ),
    title: z.string(),
  }),
  token: z.string().length(50),
});
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
});
