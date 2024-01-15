import { type PageId } from "@notebook/db/schema/notion";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { MdBlock } from "notion-to-md/build/types";
import fs from "fs";
import path from "path";

export { type GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
export type NotionClientType = InstanceType<typeof Client>;
export type N2MType = InstanceType<typeof NotionToMarkdown>;
type getBlockListResultsType = {
  mdBlocks: MdBlock[];
  pageName: string[];
  n2m: N2MType;
};
export async function getBlockListResults({
  pageName,
  mdBlocks,
  n2m,
}: getBlockListResultsType) {
  try {
    await recursiveFn({ mdBlocks, n2m, pageName, flag: false }); // first call
    return { msg: "docs generated successfully" };
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
  flag: boolean;
};
async function recursiveFn({ mdBlocks, n2m, pageName, flag }: recursiveFnType) {
  const content = getMarkdownContent(mdBlocks, n2m); // makes string to feed in mdx file
  generateFileAndFolder({ content, pageName, flag }); // generates folder with name as pageName and file as index.mdx
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
        flag: true,
      });
      pageName.pop();
    }
  }
}

type generateFileAndFolderType = {
  content?: string;
  pageName: string[];
  flag: boolean;
};
async function generateFileAndFolder({
  content,
  pageName,
  flag,
}: generateFileAndFolderType) {
  if (!flag) {
    await fs.promises.writeFile(
      path.join(process.cwd(), `./pages/docs/index.mdx`),
      content ? content : ""
    );
    return;
  }
  const dir = pageName
    .join("/")
    .split(" ")
    .join("-")
    .replace(/[^\w\-\.~:\/@]/g, "");
  await fs.promises.mkdir(path.join(process.cwd(), `./pages/docs/${dir}`), {
    recursive: true,
  });
  await fs.promises.writeFile(
    path.join(process.cwd(), `./pages/docs/${dir}.mdx`),
    content ? content : ""
  );
}

function getMarkdownContent(mdblocks: MdBlock[], n2m: NotionToMarkdown) {
  const mdString = n2m.toMarkdownString(mdblocks);
  console.log(mdString);
  if (mdString.parent) {
    return mdString.parent;
  }
  return undefined;
}
