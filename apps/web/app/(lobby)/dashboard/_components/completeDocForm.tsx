"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@notebook/trpc/trpc/client";
import {
  Shell,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Skeleton,
  Button,
  Form,
  useToast,
} from "@notebook/ui/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const notionToNextraInputSchema = z.object({
  pageId: z.string().min(32).max(36),
  rootRoute: z.object({
    name: z.string().refine(
      (name) => {
        if (!name) return false;
        if (
          name.startsWith(".") ||
          name.startsWith("-") ||
          name.startsWith("/")
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

export function CompleteDocForm() {
  const N2N = trpc.notion.notionToNextra.useMutation();
  const end2endN2NForm = useForm<z.infer<typeof notionToNextraInputSchema>>({
    resolver: zodResolver(notionToNextraInputSchema),
    defaultValues: {
      rootRoute: { name: "docs", title: "100xDevs Notebook" },
    },
  });
  const [page, setPage] = useState("/docs");
  const { toast } = useToast();
  useEffect(() => {
    if (N2N.data?.msg) {
      toast({
        variant: "success",
        title: "Success",
        description: N2N.data?.msg,
      });
    }
  }, [N2N.data?.msg]);
  return (
    <Shell
      as={"div"}
      className="flex flex-col items-center w-full md:w-5/12 border rounded-lg"
    >
      <Form {...end2endN2NForm}>
        <form
          onSubmit={end2endN2NForm.handleSubmit((data) => {
            setPage(`/${data.rootRoute.name}`);
            N2N.mutate({
              pageId: data.pageId,
              rootRoute: data.rootRoute,
              token: data.token,
            });
          })}
          className="w-full sm:space-y-3"
        >
          <FormField
            control={end2endN2NForm.control}
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
            control={end2endN2NForm.control}
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
            control={end2endN2NForm.control}
            name="rootRoute.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Route Name</FormLabel>
                <FormControl>
                  <Input required placeholder="mydocs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={end2endN2NForm.control}
            name="rootRoute.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Title</FormLabel>
                <FormControl>
                  <Input required placeholder="Documentation" {...field} />
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
              <Link href={page}>Go to docs</Link>
            </Button>
          </div>
        </form>
      </Form>
      {!N2N.isLoading && N2N.data?.msg && <span>{N2N.data.msg}</span>}
    </Shell>
  );
}
