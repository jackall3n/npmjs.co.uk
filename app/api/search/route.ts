import { get } from "../utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");

  const result = await get(term);

  return Response.json(result);
}
