import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBlockListResults } from "@notebook/api/api-endpoint-blogic/notion/queries";
import { z } from "zod";
import { client } from "../..";
import { NotionToMarkdown } from "notion-to-md";

export const notionRouter = createTRPCRouter({
  getPageResponse: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/get-page-response",
        tags: ["notion"],
      },
    })
    .input(z.object({ pageId: z.string() }))
    .output(z.string())
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
        const mdblocks = await n2m.blocksToMarkdown(notionBlockList);

        const res = await getBlockListResults({
          id: input.pageId,
          client,
          pageName: "Things to do",
          mdblocks,
          n2m,
        });
        console.log(res);
        // console.log(res["Become a Visionary Leader, One Step at a "]);

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
});
