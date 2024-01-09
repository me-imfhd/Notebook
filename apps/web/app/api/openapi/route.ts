import { openApiDocument } from "@notebook/trpc/openApi";

// Respond with our OpenAPI schema
export async function GET() {
  return new Response(JSON.stringify(openApiDocument));
}
