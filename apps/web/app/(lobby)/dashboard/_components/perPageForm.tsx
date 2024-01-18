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
  useToast,
  Form,
} from "@notebook/ui/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const n2nPerPageInputSchema = z.object({
  pageId: z.string().min(32).max(36),
  rootRoute: z.string().refine(
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

export function PerPageForm() {
  const isWindowDefined = Boolean(typeof window !== "undefined");
  const n2nPerPage = trpc.notion.notionToNextraPerPage.useMutation();
  const n2nPerPageForm = useForm<z.infer<typeof n2nPerPageInputSchema>>({
    resolver: zodResolver(n2nPerPageInputSchema),
    defaultValues: {
      pageId: isWindowDefined ? (localStorage.getItem("pageId") as string) : "",
      pageName: isWindowDefined
        ? (localStorage.getItem("pageName") as string)
        : "",
      rootRoute: isWindowDefined
        ? (localStorage.getItem("rootRoute") as string)
        : "",
      token: isWindowDefined ? (localStorage.getItem("token") as string) : "",
    },
  });
  const [route, setRoute] = useState<string | null>(null);

  const { toast } = useToast();
  useEffect(() => {
    if (n2nPerPage.data?.msg) {
      toast({
        variant: "success",
        title: "Success",
        description: n2nPerPage.data?.msg,
      });
    }
  }, [n2nPerPage.data?.msg]);
  return (
    <Shell
      as={"div"}
      className="flex flex-col items-start  w-full lg:w-5/12 border rounded-lg"
    >
      <div className="text-2xl">Make One Page Per Id</div>
      <Form {...n2nPerPageForm}>
        <form
          onSubmit={n2nPerPageForm.handleSubmit((data) => {
            const route = "/" + data.rootRoute + "/" + data.pageName;
            setRoute(route);
            if (isWindowDefined) {
              localStorage.setItem("pageId", data.pageId);
              localStorage.setItem("pageName", data.pageName);
              localStorage.setItem("token", data.token);
              localStorage.setItem("rootRoute", data.rootRoute);
            }

            n2nPerPage.mutate({
              pageId: data.pageId,
              rootRoute: data.rootRoute,
              token: data.token,
              pageName: data.pageName,
            });
          })}
          className="w-full space-y-3"
        >
          <FormField
            control={n2nPerPageForm.control}
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
            control={n2nPerPageForm.control}
            name="pageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Id</FormLabel>
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
            control={n2nPerPageForm.control}
            name="rootRoute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Route Name</FormLabel>
                <FormControl>
                  <Input placeholder="docs or oldDocs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={n2nPerPageForm.control}
            name="pageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Name</FormLabel>
                <FormControl>
                  <Input placeholder="Week-8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-3 items-center">
            <Button type="submit" disabled={n2nPerPage.isLoading}>
              {n2nPerPage.isLoading ? (
                <Skeleton>Generating Page...</Skeleton>
              ) : (
                "Generate Page"
              )}
            </Button>

            {route && !n2nPerPage.isLoading && n2nPerPage.data?.msg && (
              <Button variant="outline" size="sm" disabled={Boolean(!route)}>
                <Link href={route}>Go to the page</Link>
              </Button>
            )}
          </div>
        </form>
      </Form>
      {!n2nPerPage.isLoading && n2nPerPage.data?.msg && (
        <span>{n2nPerPage.data.msg}</span>
      )}
    </Shell>
  );
}
