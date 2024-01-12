import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBlockListResults } from "@notebook/api/api-endpoint-blogic/notion/queries";
import { z } from "zod";
import { client } from "../..";

export const notionRouter = createTRPCRouter({
  getPageResponse: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/get-page-response",
        tags: ["auth"],
      },
    })
    .input(z.object({ pageId: z.string() }))
    .output(z.object({}))
    .query(async ({ input }) => {
      try {
        const res = await getBlockListResults(input.pageId, client);
        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
});
