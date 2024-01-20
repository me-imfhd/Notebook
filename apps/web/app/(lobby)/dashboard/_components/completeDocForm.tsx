"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@notebook/trpc/trpc/client";
import { useLocalStorage } from "usehooks-ts";
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
  FormDescription,
} from "@notebook/ui/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notionToNextraInputSchema } from "@notebook/db";

export function CompleteDocForm() {
  const [storageToken, setStorageToken] = useLocalStorage("completeDtoken", "");
  const [storageRoot, setStorageRoot] = useLocalStorage("completeDRoot", "");

  const N2N = trpc.notion.notionToNextra.useMutation();
  const end2endN2NForm = useForm<z.infer<typeof notionToNextraInputSchema>>({
    resolver: zodResolver(notionToNextraInputSchema),
    defaultValues: {
      rootRoute: {
        name: storageRoot,
      },
      token: storageToken,
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
      className="flex flex-col items-start w-full lg:w-5/12 border rounded-lg"
    >
      <div className="text-2xl">Make Nested Docs</div>
      <Form {...end2endN2NForm}>
        <form
          onSubmit={end2endN2NForm.handleSubmit((data) => {
            setPage(`/${data.rootRoute.name}`);
            setStorageToken(data.token);
            setStorageRoot(data.rootRoute.name);
            N2N.mutate({
              pageId: data.pageId,
              rootRoute: data.rootRoute,
              token: data.token,
            });
          })}
          className="w-full space-y-3"
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
                <FormDescription>
                  Create a notion integration token from{" "}
                  <Link
                    className="text-accent-foreground hover:underline"
                    href={"https://notion.so/my-integrations"}
                  >
                    here
                  </Link>{" "}
                  and connect your page to it.
                </FormDescription>
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
                <FormDescription>
                  Your notion page needs to be connected to your integration
                  app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={end2endN2NForm.control}
            name="rootRoute.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Route</FormLabel>
                <FormControl>
                  <Input required placeholder="docs" {...field} />
                </FormControl>
                <FormDescription>
                  This is your home route of your docs. E.g., Example.com/docs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={end2endN2NForm.control}
            name="rootRoute.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Title</FormLabel>
                <FormControl>
                  <Input required placeholder="Documentation" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title for your home route in the navbar.
                </FormDescription>
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
