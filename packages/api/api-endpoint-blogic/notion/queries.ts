import { type PageId } from "@notebook/db/schema/notion";
import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export { type GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
export type NotionClientType = InstanceType<typeof Client>;

export const getBlockListResults = async (
  id: PageId,
  client: NotionClientType
) => {
  try {
    const response = await client.blocks.children.list({ block_id: id });
    // console.log(JSON.stringify(,null,2));
    return response.results as BlockObjectResponse[];
  } catch (err) {
    throw new Error((err as Error).message ?? "Error, ");
  }
};

interface SimpleBlock {
  id: string;
  type: string;
  text: string;
  children?: SimpleBlock[];
}

export const getBlocksContent = async (
  content: BlockObjectResponse[],
  client: NotionClientType
) => {
  const pages_simple_blocks: SimpleBlock[] = [];
  let plain_text = "";
  try {
    for (const block of content) {
      let block_id = block["id"];
      let block_type = block["type"];
      let has_children = block["has_children"];
      // @ts-ignore
      let rich_text = block[block_type]?.rich_text;

      if (rich_text) {
        for (let item of rich_text) {
          if (!item || !item.plain_text) {
            plain_text += "\n";
          } else {
            plain_text += item.plain_text + " ";
          }
        }
      } else {
        plain_text = "\n";
      }

      plain_text = plain_text.trim();
      // console.log(plain_text);
      let simple_block: {
        id: string;
        type: string;
        text: string;
        children?: SimpleBlock[];
      } = {
        id: block_id,
        type: block_type,
        text: rich_text,
      };
      // if (has_children) {
      //   let nested_children = await getBlockListResults(block_id, client);
      //   simple_block["children"] = await getBlocksContent(
      //     nested_children,
      //     client
      //   );
      // }

      pages_simple_blocks.push(simple_block);
    }
    return plain_text;
  } catch (err) {
    throw new Error((err as Error).message ?? "Error, please try again");
  }
};
