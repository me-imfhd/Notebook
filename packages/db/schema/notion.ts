import { z } from "zod";

const BlockSchema = z.object({
 id: z.string(),
 parentType: z.string(),
 createdTime: z.date(),
 lastEditedTime: z.date(),
 createdBy: z.string(),
 lastEditedBy: z.string(),
 hasChildren: z.boolean(),
 archived: z.boolean(),
 type: z.string(),
 childPageTitle: z.string().optional(),
 parentPageId: z.string(),
});

const PageSchema = z.object({
 id: z.string(),
 object: z.string(),
 createdTime: z.date(),
 lastEditedTime: z.date(),
 createdBy: z.string(),
 lastEditedBy: z.string(),
 coverType: z.string().optional(),
 iconUrl: z.string().optional(),
 parentType: z.string(),
 archived: z.boolean(),
 properties: z.record(z.unknown()),
 url: z.string(),
 publicUrl: z.string().optional(),
 requestId: z.string(),
});

export { BlockSchema, PageSchema };

export const PageIdSchema = PageSchema.pick({id:true});
export const BlockIdSchema = BlockSchema.pick({id:true});

export type PageId = z.infer<typeof PageSchema>["id"];
export type BlockId = z.infer<typeof BlockSchema>["id"];
