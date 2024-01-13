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
  mdblocks: MdBlock[];
  client: NotionClientType;
  pageName: string;
  n2m: N2MType;
};
let folderpath = "";
export async function getBlockListResults({
  pageName,
  client,
  id,
  mdblocks,
  n2m,
}: getBlockListResultsType) {
  try {
    const content = getMarkdownContent(mdblocks, n2m); // makes string to feed in mdx file
    generateFileAndFolder({ content, pageName }); // generates folder with name as pageName and file as index.mdx
    // const childPages = filterChildPages(mdblocks);
    // if (childPages.length > 0) {
    //   n2m.
    // }

    return content;
  } catch (err) {
    throw new Error((err as Error).message ?? "Error, ");
  }
}

function filterChildPages(array: MdBlock[]) {
  return array.filter((item) => item.type === "child_page");
}

type generateFileAndFolderType = {
  content?: string;
  pageName: string;
};
async function generateFileAndFolder({
  content,
  pageName,
}: generateFileAndFolderType) {
  const dir = pageName.split(" ").join("-");
  try {
    await fs.promises.mkdir(path.join(process.cwd(), `./pages/${dir}`), {
      recursive: true,
    });
  } catch (err) {
    console.error(`Error creating directory ${err}`);
  }

  content &&
    (await fs.promises.writeFile(
      path.join(process.cwd(), `./pages/${dir}/index.mdx`),
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
