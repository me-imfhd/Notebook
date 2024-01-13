import { type PageId } from "@notebook/db/schema/notion";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { MdBlock } from "notion-to-md/build/types";
import fs from "fs";
import path from "path";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export { type GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
export type NotionClientType = InstanceType<typeof Client>;
export type N2MType = InstanceType<typeof NotionToMarkdown>;
type getBlockListResultsType = {
  id: PageId;
  mdBlocks: MdBlock[];
  client: NotionClientType;
  pageName: string[];
  n2m: N2MType;
};
let folderpath = "";
export async function getBlockListResults({
  pageName,
  client,
  id,
  mdBlocks,
  n2m,
}: getBlockListResultsType) {
  try {
    await recursiveFn({ mdBlocks, n2m, pageName });
    return "hello";
  } catch (err) {
    throw new Error((err as Error).message ?? "Error, ");
  }
}

function filterChildPages(array: MdBlock[]) {
  return array.filter((item) => item.type === "child_page");
}

type recursiveFnType = {
  mdBlocks: MdBlock[];
  n2m: NotionToMarkdown;
  pageName: string[];
};
async function recursiveFn({ mdBlocks, n2m, pageName }: recursiveFnType) {
  const content = getMarkdownContent(mdBlocks, n2m); // makes string to feed in mdx file
  generateFileAndFolder({ content, pageName }); // generates folder with name as pageName and file as index.mdx
  const childPagesMdBlocks = filterChildPages(mdBlocks);
  if (childPagesMdBlocks.length === 0) {
    return;
  }
  for (const childPageMdBlock of childPagesMdBlocks) {
    if (childPageMdBlock) {
      pageName.push(childPageMdBlock.parent.trim());
      await recursiveFn({
        mdBlocks: childPageMdBlock.children,
        n2m,
        pageName,
      });
      pageName.pop();
    }
  }
}

type generateFileAndFolderType = {
  content?: string;
  pageName: string[];
};
async function generateFileAndFolder({
  content,
  pageName,
}: generateFileAndFolderType) {
  const dir = pageName.join("/").split(" ").join("-");
  try {
    await fs.promises.mkdir(path.join(process.cwd(), `./pages/docs/${dir}`), {
      recursive: true,
    });
  } catch (err) {
    console.error(`Error creating directory ${err}`);
  }

  content &&
    (await fs.promises.writeFile(
      path.join(process.cwd(), `./pages/docs/${dir}/index.mdx`),
      content
    ));
}

function getMarkdownContent(mdblocks: MdBlock[], n2m: NotionToMarkdown) {
  const mdString = n2m.toMarkdownString(mdblocks);
  if (mdString.parent) {
    return mdString.parent;
  }
  throw new Error("content mdString.parent undefined");
}
