import { ogImage, canRead } from "../lib/intel-core.mjs";

// Lead-story image for an official page: its own og:image, or nothing.
export async function GET(request) {
  const url = new URL(request.url).searchParams.get("url") || "";
  if (!canRead(url)) return Response.json({ image: "" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  try {
    const image = await ogImage(url);
    return Response.json({ image }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return Response.json({ image: "" }, { headers: { "Cache-Control": "public, max-age=600, s-maxage=3600" } });
  }
}
