import { computersRouter } from "./computers";
import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { notionRouter } from "./notion";

export const appRouter = createTRPCRouter({
  computers: computersRouter,
  auth: authRouter,
  notion: notionRouter,
});

export type AppRouter = typeof appRouter;
