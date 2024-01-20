import { z } from "zod";

export const notionToNextraInputSchema = z.object({
  pageId: z.string().min(32).max(36),
  rootRoute: z.object({
    name: z.string().refine(
      (name) => {
        if (!name) return false;
        if (
          name.startsWith(".") ||
          name.startsWith("-") ||
          name.startsWith("/") ||
          name.endsWith("/")
        )
          return false;
        const invalidCharacters = /[\:*?"<>|]/;
        if (invalidCharacters.test(name)) return false;
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

export const n2nPerPageInputSchema = z.object({
  pageId: z.string().min(32).max(36),
  rootRoute: z.string().refine(
    (name) => {
      if (!name) return false;
      if (
        name.startsWith(".") ||
        name.startsWith("-") ||
        name.startsWith("/") ||
        name.endsWith("/")
      )
        return false;
      const invalidCharacters = /[\:*?"<>|]/;
      if (invalidCharacters.test(name)) return false;
      if (name.length > 255) return false;
      return true;
    },
    {
      message: "Invalid directory name",
    }
  ),
  pageName: z.string().refine(
    (name) => {
      if (!name) return false;
      if (name.startsWith(".") || name.startsWith("-") || name.startsWith("/"))
        return false;
      const invalidCharacters = /[\:*?"<>|]/;
      if (invalidCharacters.test(name)) return false;
      if (name.length > 255) return false;
      return true;
    },
    {
      message: "Invalid directory name",
    }
  ),
  token: z.string().length(50),
});
