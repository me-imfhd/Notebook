"use client";
import { trpc } from "@notebook/trpc/trpc/client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Shell,
  Skeleton,
  useToast,
} from "@notebook/ui/components";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

export default function IndexPage() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV) {
    return <div>Dashboard is not accessible in production yet.</div>;
  }

  const { toast } = useToast();
  const N2N = trpc.notion.notionToNextra.useMutation();

  useEffect(() => {
    if (N2N.data?.msg) {
      toast({
        variant: "success",
        title: "Success",
        description: N2N.data?.msg,
      });
    }
  }, [N2N.data?.msg]);

  const form = useForm<z.infer<typeof notionToNextraInputSchema>>({
    resolver: zodResolver(notionToNextraInputSchema),
    defaultValues: {
      rootRoute: { name: "docs", title: "Documentation" },
    },
  });
  return (
    <Shell as={"div"} className="flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            N2N.mutate({
              pageId: data.pageId,
              rootRoute: data.rootRoute,
              token: data.token,
            });
          })}
          className="w-1/3 sm:w-1/4 sm:space-y-3"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notion Integration Token</FormLabel>
                <FormControl>
                  <Input placeholder="secret_gibberish" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Notion Page Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="3322a16bb55e40b7b108c9f70730bcc3"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rootRoute.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Route Name</FormLabel>
                <FormControl>
                  <Input placeholder="mydocs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rootRoute.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Title</FormLabel>
                <FormControl>
                  <Input placeholder="Documentation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-3 items-center">
            <Button type="submit" disabled={N2N.isLoading}>
              {N2N.isLoading ? (
                <Skeleton>Generating Docs...</Skeleton>
              ) : (
                "Generate Docs"
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Link href={"/docs"}>Go to docs</Link>
            </Button>
          </div>
        </form>
      </Form>
      {!N2N.isLoading && N2N.data?.msg && <span>{N2N.data.msg}</span>}
    </Shell>
  );
}
