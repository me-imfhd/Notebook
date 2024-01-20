"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { n2nPerPageInputSchema } from "@notebook/db";
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
  FormDescription,
} from "@notebook/ui/components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

export function PerPageForm() {
  const [storageToken, setStorageToken] = useLocalStorage("singlePToken", "");
  const [storageRoot, setStorageRoot] = useLocalStorage("singlePRoot", "");
  const n2nPerPage = trpc.notion.notionToNextraPerPage.useMutation();
  const n2nPerPageForm = useForm<z.infer<typeof n2nPerPageInputSchema>>({
    resolver: zodResolver(n2nPerPageInputSchema),
    defaultValues: {
      rootRoute: storageRoot,
      token: storageToken,
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
      <div className="text-2xl">Make Single Page Doc</div>
      <Form {...n2nPerPageForm}>
        <form
          onSubmit={n2nPerPageForm.handleSubmit((data) => {
            const route = "/" + data.rootRoute + "/" + data.pageName;
            setRoute(route);
            setStorageToken(data.token);
            setStorageRoot(data.rootRoute);

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
                <FormDescription>
                  Your notion page needs to be connected to your integration
                  app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={n2nPerPageForm.control}
            name="rootRoute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Root Route</FormLabel>
                <FormControl>
                  <Input placeholder="docs" {...field} />
                </FormControl>
                <FormDescription>
                  This is your home route of your docs. E.g., Example.com/docs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={n2nPerPageForm.control}
            name="pageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Route</FormLabel>
                <FormControl>
                  <Input placeholder="Meditation" {...field} />
                </FormControl>
                <FormDescription>
                  This is your page route of your docs. E.g.,
                  Example.com/docs/Meditation
                </FormDescription>
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
