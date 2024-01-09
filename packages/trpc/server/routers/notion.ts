import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getBlockListResults,
  getBlocksContent,
} from "@notebook/api/api-endpoint-blogic/notion/queries";
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
    .input(z.string())
    // .output(z.object({}))
    .query(async ({ input }) => {
      try {
        const res = await getBlockListResults(input, client);
        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
  getSimpleBlocks: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/get-page-response",
        tags: ["auth"],
      },
    })
    .input(z.string())
    // .output(z.object({}))
    .query(async ({ input }) => {
      try {
        const listResults = await getBlockListResults(input, client);
        const res = await getBlocksContent(listResults, client);
        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (err as Error).message ?? "Error, please try again",
        });
      }
    }),
});
