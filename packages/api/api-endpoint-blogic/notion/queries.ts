import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { MdBlock } from "notion-to-md/build/types";
import fs from "fs";
import path from "path";

export type NotionClientType = InstanceType<typeof Client>;
export type N2MType = InstanceType<typeof NotionToMarkdown>;
type notion2NextraType = {
  mdBlocks: MdBlock[];
  pageName: string[];
  n2m: N2MType;
  rootRoute: { title: string; name: string };
};
export async function notion2Nextra({
  pageName,
  mdBlocks,
  n2m,
  rootRoute,
}: notion2NextraType) {
  try {
    await recursiveFn({ mdBlocks, n2m, pageName, flag: false, rootRoute }); // first call
    return { msg: "Docs Generated Successfully" };
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
  rootRoute: { title: string; name: string };
};
async function recursiveFn({
  mdBlocks,
  n2m,
  pageName,
  flag,
  rootRoute,
}: recursiveFnType) {
  const content = getMarkdownContent(mdBlocks, n2m); // makes string to feed in mdx file
  generateFileAndFolder({ content, pageName, flag, rootRoute }); // generates folder with name as pageName and file as index.mdx
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
        rootRoute,
      });
      pageName.pop();
    }
  }
}

type generateFileAndFolderType = {
  content?: string;
  pageName: string[];
  flag: boolean;
  rootRoute: { title: string; name: string };
};
type rootMetaJsonType = {
  [key: string]: {
    type: "page";
    title: string;
  };
};
async function generateFileAndFolder({
  content,
  pageName,
  flag,
  rootRoute,
}: generateFileAndFolderType) {
  const indexMetaJson = {
    index: "Introduction",
  };
  const route = rootRoute.name;
  const title = rootRoute.title;
  if (!flag) {
    await fs.promises.mkdir(path.join(process.cwd(), `./pages/${route}`), {
      recursive: true,
    });
    await fs.promises.writeFile(
      path.join(process.cwd(), `./pages/${route}/index.mdx`),
      content ? content : ""
    );
    // rename the name of index page from index to Introduction
    await fs.promises.writeFile(
      path.join(process.cwd(), `./pages/${route}/_meta.json`),
      JSON.stringify(indexMetaJson, null, 2)
    );
    const rootMetaFileExists = fs.existsSync(
      path.join(process.cwd(), `./pages/_meta.json`)
    );
    if (rootMetaFileExists) {
      const originalRootMetaJson = await fs.promises.readFile(
        path.join(process.cwd(), `./pages/_meta.json`),
        "utf-8"
      );
      const rootMetaObject = JSON.parse(
        originalRootMetaJson
      ) as rootMetaJsonType;

      // updates old route with the give title or adds new routes
      rootMetaObject[route] = {
        type: "page",
        title: title,
      };
      await fs.promises.writeFile(
        path.join(process.cwd(), `./pages/_meta.json`),
        JSON.stringify(rootMetaObject, null, 2)
      );
    } else {
      const initMetaJson = {} as rootMetaJsonType;
      initMetaJson[route] = {
        type: "page",
        title: title,
      };
      await fs.promises.writeFile(
        path.join(process.cwd(), `./pages/_meta.json`),
        JSON.stringify(initMetaJson, null, 2)
      );
    }
    return;
  }
  const dir = pageName
    .join("/")
    .split(" ")
    .join("-")
    .replace(/[^\w\-\.~:\/@]/g, "");
  await fs.promises.mkdir(path.join(process.cwd(), `./pages/${route}/${dir}`), {
    recursive: true,
  });
  await fs.promises.writeFile(
    path.join(process.cwd(), `./pages/${route}/${dir}.mdx`),
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
