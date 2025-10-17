import { get } from "../utils";

export async function GET() {
  const result = await get();

  return Response.json(result);
}
