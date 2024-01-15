import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBlockListResults } from "@notebook/api/api-endpoint-blogic/notion/queries";
import { z } from "zod";
import { client } from "../..";
import { NotionToMarkdown } from "notion-to-md";

export const notionRouter = createTRPCRouter({
  notionToNextra: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/get-page-response",
        tags: ["notion"],
      },
    })
    .input(z.object({ pageId: z.string() }))
    .output(z.object({ msg: z.string() }))
    .query(async ({ input }) => {
      try {
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
        const res = await getBlockListResults({
          pageName: [],
          mdBlocks,
          n2m,
        });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
});
