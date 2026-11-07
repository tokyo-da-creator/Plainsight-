import { readDoc, canRead } from "../lib/intel-core.mjs";

// In-site reader: an official U.S. government document as plain text blocks.
export async function GET(request) {
  const url = new URL(request.url).searchParams.get("url") || "";
  if (!canRead(url)) {
    return Response.json({ url, kind: "external", blocks: [], error: "Only official U.S. government documents open in the reader." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const doc = await readDoc(url);
    return Response.json(doc, { headers: { "Cache-Control": doc.blocks.length ? "public, max-age=600, s-maxage=86400, stale-while-revalidate=604800" : "no-store" } });
  } catch (e) {
    return Response.json({ url, kind: "error", blocks: [], error: String(e.name === "AbortError" ? "The source took too long to answer" : e.message || e) }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
