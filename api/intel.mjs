import { buildSet, SETS } from "../lib/intel-core.mjs";

// Live data: /api/<set> is rewritten here as /api/intel?set=<set>.
export async function GET(request) {
  const name = new URL(request.url).searchParams.get("set");
  if (!name || !SETS[name]) return new Response("Not found", { status: 404 });
  try {
    const data = await buildSet(name);
    const ok = data.status.some((s) => s.ok);
    return Response.json(data, {
      status: ok ? 200 : 502,
      // Vercel's CDN keeps a copy for 30 minutes and serves it stale while it refetches.
      headers: { "Cache-Control": ok ? "public, max-age=120, s-maxage=1800, stale-while-revalidate=86400" : "no-store" },
    });
  } catch (e) {
    return Response.json({ set: name, error: String(e.message || e) }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
