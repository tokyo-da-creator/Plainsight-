// Threat Board — feed collection. Shared by the Netlify function (live) and the
// snapshot script (preview). No dependencies: Node 18+ fetch and zlib.
import { gunzipSync } from "node:zlib";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const DAY = 864e5;

async function get(url, { timeout = 9000, binary = false, ua = UA } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(url, { headers: { "user-agent": ua, accept: "*/*", "accept-language": "en-US,en;q=0.9" }, signal: ctl.signal, redirect: "follow" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
  } finally {
    clearTimeout(t);
  }
}

// Run one feed, record how it went.
async function feed(status, name, url, fn) {
  const at = new Date().toISOString();
  try {
    const out = await fn();
    status.push({ feed: name, url, ok: true, items: Array.isArray(out) ? out.length : 1, checked: at, note: "" });
    return out;
  } catch (e) {
    status.push({ feed: name, url, ok: false, items: 0, checked: at, note: String(e.name === "AbortError" ? "Timed out" : e.message).slice(0, 160) });
    return null;
  }
}

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function clean(s, max) {
  s = String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
      if (e[0] === "#") { const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
      return ENT[e.toLowerCase()] ?? m;
    })
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => ENT[e.toLowerCase()] ?? m)
    .replace(/\uFFFD/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
  return max && s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}
const tag = (x, name) => {
  const m = x.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

function parseFeed(xml, source, days) {
  const cutoff = Date.now() - days * DAY;
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  const rows = [];
  for (const b of blocks) {
    const title = clean(tag(b, "title"));
    let link = clean(tag(b, "link"));
    if (!link) { const m = b.match(/<link[^>]*href="([^"]+)"/i); link = m ? m[1] : ""; }
    const d = Date.parse(clean(tag(b, "pubDate") || tag(b, "dc:date") || tag(b, "published") || tag(b, "updated")));
    if (!title || !/^https:\/\//.test(link) || !Number.isFinite(d) || d < cutoff) continue;
    const summary = clean(tag(b, "description") || tag(b, "summary"), 320);
    const cats = [...b.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((c) => clean(c[1])).filter((c) => c && !/^(news|presidential actions|the white house)$/i.test(c));
    rows.push({ title: /^[^a-z]+$/.test(title) ? title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : title, source, published: new Date(d).toISOString().slice(0, 19) + "Z", link, cat: cats[0] || "", summary, image: itemImage(b) });
  }
  return rows;
}

const MONTHS = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
// "24-Feb-2026" or "05-Nov" (+ year) -> "2026-02-24"
const dmy = (s, year) => { const [d, m, y] = s.split("-"); const mm = MONTHS[(m || "").slice(0, 3).toLowerCase()]; return mm && d ? `${y || year}-${mm}-${d.padStart(2, "0")}` : ""; };
// First real image in a feed item: enclosure, media tag, or an <img> in the body.
const JUNK_IMG = /(feedburner|pixel|tracking|stats\.|gravatar|1x1|spacer|emoji|\/ads?\/|doubleclick|feeds\.feedburner|wp-includes)/i;
function itemImage(b) {
  const raw = b.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, "&");
  const cands = [];
  for (const m of raw.matchAll(/<enclosure\b[^>]*>/gi)) { const u = (m[0].match(/url=["']([^"']+)/i) || [])[1]; if (u && (/type=["']image/i.test(m[0]) || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u))) cands.push(u); }
  for (const m of raw.matchAll(/<media:(?:content|thumbnail)\b[^>]*url=["']([^"']+)/gi)) cands.push(m[1]);
  for (const m of raw.matchAll(/<img\b[^>]*src=["']([^"']+)/gi)) cands.push(m[1]);
  let u = cands.find((x) => /^https:\/\//.test(x) && !JUNK_IMG.test(x));
  if (!u) return "";
  return u.replace(/\/s\d{3,4}(-[a-z0-9-]+)?\//, "/s800/").replace(/&amp;/g, "&");
}
const dedupe = (rows, key) => {
  const seen = new Set();
  return rows.filter((r) => { const k = key(r); if (seen.has(k)) return false; seen.add(k); return true; });
};

export const CYBER_FEEDS = [
  ["The Record", "https://therecord.media/feed/"],
  ["BleepingComputer", "https://www.bleepingcomputer.com/feed/"],
  ["The Hacker News", "https://feeds.feedburner.com/TheHackersNews"],
  ["Krebs on Security", "https://krebsonsecurity.com/feed/"],
  ["SecurityWeek", "https://www.securityweek.com/feed/"],
  ["Dark Reading", "https://www.darkreading.com/rss.xml"],
  ["UK NCSC", "https://www.ncsc.gov.uk/api/1/services/v1/all-rss-feed.xml"],
];

async function epssFor(cves, status) {
  const out = {};
  const list = [...new Set(cves)];
  const chunks = [];
  for (let i = 0; i < list.length; i += 100) chunks.push(list.slice(i, i + 100));
  await feed(status, "FIRST EPSS", "https://api.first.org/data/v1/epss", async () => {
    const res = await Promise.all(chunks.map((c) => get(`https://api.first.org/data/v1/epss?cve=${c.join(",")}&limit=100`)));
    for (const t of res) for (const r of JSON.parse(t).data || []) out[r.cve] = [Number(r.epss), Number(r.percentile)];
    return Object.keys(out);
  });
  return out;
}

async function epssAll(status) {
  // Whole-catalog EPSS in one download; used when many CVEs are needed.
  const url = "https://epss.empiricalsecurity.com/epss_scores-current.csv.gz";
  const out = {};
  await feed(status, "FIRST EPSS", url, async () => {
    const csv = gunzipSync(await get(url, { binary: true, timeout: 15000 })).toString("utf8");
    for (const line of csv.split("\n")) {
      if (!line.startsWith("CVE-")) continue;
      const [cve, e, p] = line.split(",");
      out[cve] = [Number(e), Number(p)];
    }
    return [1];
  });
  return out;
}

const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const KEV_MIRROR = "https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json";

export const SETS = {
  async kev() {
    const status = [];
    const [kev, epss] = await Promise.all([
      feed(status, "CISA KEV", KEV_URL, async () => {
        let t;
        try { t = await get(KEV_URL, { timeout: 12000 }); } catch { t = await get(KEV_MIRROR, { timeout: 12000 }); }
        return JSON.parse(t).vulnerabilities;
      }),
      epssAll(status),
    ]);
    const rows = (kev || []).map((v) => ({
      cve: v.cveID, vendor: v.vendorProject || "", product: v.product || "", name: v.vulnerabilityName || "",
      added: v.dateAdded || "", due: v.dueDate || "", ransomware: v.knownRansomwareCampaignUse || "Unknown",
      cwe: (v.cwes || []).join(","), summary: clean(v.shortDescription, 280),
      epss: epss[v.cveID]?.[0] ?? null, percentile: epss[v.cveID]?.[1] ?? null,
    })).sort((a, b) => b.added.localeCompare(a.added) || b.cve.localeCompare(a.cve));
    return { rows, status };
  },

  async cves() {
    const status = [];
    const end = new Date(), start = new Date(Date.now() - 30 * DAY);
    const f = (d, t) => d.toISOString().slice(0, 10) + t;
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL&pubStartDate=${f(start, "T00:00:00.000")}&pubEndDate=${f(end, "T23:59:59.999")}&resultsPerPage=2000`;
    const items = await feed(status, "NIST NVD (critical)", url, async () => JSON.parse(await get(url, { timeout: 15000 })).vulnerabilities || []) || [];
    const rows = items.map(({ cve: c }) => {
      const m = c.metrics || {};
      let score = null, cvss = "", vector = "";
      for (const k of ["cvssMetricV40", "cvssMetricV31", "cvssMetricV30"]) {
        if (m[k]?.length) { const p = m[k].find((x) => x.type === "Primary") || m[k][0]; score = p.cvssData.baseScore; cvss = p.cvssData.version; vector = p.cvssData.vectorString || ""; break; }
      }
      const aff = c.affected?.[0]?.affectedData?.[0] || {};
      return {
        cve: c.id, published: c.published.slice(0, 10), score, cvss, vector, vendor: aff.vendor || "", product: aff.product || "",
        status: c.vulnStatus || "", summary: clean((c.descriptions || []).find((d) => d.lang === "en")?.value, 280),
      };
    });
    const epss = await epssFor(rows.map((r) => r.cve), status);
    for (const r of rows) r.epss = epss[r.cve]?.[0] ?? null;
    rows.sort((a, b) => b.published.localeCompare(a.published) || (b.score || 0) - (a.score || 0));
    return { rows, status };
  },

  async ransomware() {
    const status = [];
    const now = new Date();
    const months = [];
    for (let i = 0; i < 6; i++) { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)); months.push([d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, "0")]); }
    const parts = await Promise.all(months.map(([y, m]) => {
      const url = `https://api.ransomware.live/v2/victims/${y}/${m}`;
      return feed(status, `ransomware.live ${y}-${m}`, url, async () => JSON.parse(await get(url, { timeout: 15000 })));
    }));
    const rows = dedupe(parts.flat().filter(Boolean).map((v) => ({
      victim: clean(v.victim, 120), group: v.group || "", country: v.country || "", sector: v.activity && v.activity !== "Not found" ? v.activity : "",
      attacked: (v.attackdate || "").slice(0, 10), posted: (v.discovered || "").slice(0, 10), domain: v.domain || "",
    })).filter((r) => r.victim && r.posted).sort((a, b) => b.posted.localeCompare(a.posted)), (r) => r.victim.toLowerCase() + "|" + r.group);
    return { rows, status };
  },

  async news() {
    const status = [];
    const all = await Promise.all(CYBER_FEEDS.map(([n, u]) => feed(status, n, u, async () => parseFeed(await get(u), n, 14))));
    const rows = dedupe(all.flat().filter(Boolean), (r) => r.link.split("?")[0]).sort((a, b) => b.published.localeCompare(a.published));
    return { rows, status };
  },

  // Politics from primary, nonpartisan records only: no partisan outlets, no commentary.
  async politics() {
    const status = [];
    const row = (branch, source, kind, title, date, link, detail = "") => ({ branch, source, kind, title: clean(title, 280), date, link, detail: clean(detail, 420) });
    const rss = (name, url, days, map) => feed(status, name, url, async () => parseFeed(await get(url), name, days).map((r) => ({ ...map(r), image: r.image || "" })));
    const now = new Date();
    const term = String((now.getUTCMonth() >= 9 ? now.getUTCFullYear() : now.getUTCFullYear() - 1) % 100).padStart(2, "0");
    const frBase = "https://www.federalregister.gov/api/v1/documents.json?order=newest&fields[]=title&fields[]=type&fields[]=subtype&fields[]=html_url&fields[]=publication_date&fields[]=agencies&fields[]=abstract&fields[]=executive_order_number&fields[]=signing_date";
    const agencies = (d) => (d.agencies || []).map((a) => a.name).filter(Boolean).join(", ");
    const cgKey = globalThis.Netlify?.env.get("CONGRESS_API_KEY") || (typeof process !== "undefined" && process.env.CONGRESS_API_KEY) || "DEMO_KEY";
    const BILL_PATH = { HR: "house-bill", S: "senate-bill", HRES: "house-resolution", SRES: "senate-resolution", HJRES: "house-joint-resolution", SJRES: "senate-joint-resolution", HCONRES: "house-concurrent-resolution", SCONRES: "senate-concurrent-resolution" };
    const texts = {};
    const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");

    const parts = await Promise.all([
      // ---- President
      rss("White House · presidential actions", "https://www.whitehouse.gov/presidential-actions/feed/", 90, (r) => row("President", "White House", r.cat || "Presidential action", r.title, r.published, r.link)),
      rss("White House · news", "https://www.whitehouse.gov/news/feed/", 21, (r) => row("President", "White House", r.cat || "White House", r.title, r.published, r.link)),
      rss("White House · remarks", "https://www.whitehouse.gov/remarks/feed/", 30, (r) => row("President", "White House", "Remarks", r.title, r.published, r.link)),
      rss("Daily Compilation of Presidential Documents", "https://www.govinfo.gov/rss/dcpd.xml", 30, (r) => row("President", "GovInfo", "Presidential document", r.title, r.published, r.link)),
      feed(status, "Federal Register · presidential documents", frBase, async () => (JSON.parse(await get(frBase + "&per_page=80&conditions[type][]=PRESDOCU")).results || [])
        .map((d) => row("President", "Federal Register", d.executive_order_number ? `Executive order ${d.executive_order_number}` : (d.subtype || "Presidential document"), d.title, d.publication_date, d.html_url, d.signing_date ? `Signed ${d.signing_date}` : ""))),
      // ---- Agencies (executive branch rulemaking)
      feed(status, "Federal Register · significant rules", frBase, async () => (JSON.parse(await get(frBase + "&per_page=60&conditions[significant]=1&conditions[type][]=RULE&conditions[type][]=PRORULE")).results || [])
        .map((d) => row("Agencies", "Federal Register", d.type === "Rule" ? "Final rule" : "Proposed rule", d.title, d.publication_date, d.html_url, agencies(d)))),
      feed(status, "Federal Register · cyber", frBase, async () => (JSON.parse(await get(frBase + "&per_page=60&conditions[term]=cybersecurity%20%7C%20cyber%20%7C%20ransomware")).results || [])
        .filter((d) => /cyber|ransomware|critical infrastructure|vulnerab|incident report|encryption|information security|foreign adversar|telecommunications|supply chain|\bCISA\b|spyware|hacking|data security/i.test(`${d.title} ${d.abstract || ""}`))
        .map((d) => row("Agencies", "Federal Register", d.type || "Notice", d.title, d.publication_date, d.html_url, agencies(d)))),
      // ---- Congress
      rss("Public laws (GovInfo)", "https://www.govinfo.gov/rss/plaw.xml", 120, (r) => row("Congress", "GovInfo", "Became law", r.title, r.published, r.link)),
      feed(status, "Congress.gov · bill actions", "https://api.congress.gov/v3/bill", async () => (JSON.parse(await get(`https://api.congress.gov/v3/bill?format=json&limit=80&sort=updateDate+desc&api_key=${cgKey}`)).bills || [])
        .map((b) => row("Congress", "Congress.gov", "Bill action", `${b.type}.${b.number} · ${b.title}`, b.latestAction?.actionDate || b.updateDate?.slice(0, 10), `https://www.congress.gov/bill/${ord(b.congress)}-congress/${BILL_PATH[b.type] || "bill"}/${b.number}`, b.latestAction?.text || ""))),
      rss("GovInfo · bill texts", "https://www.govinfo.gov/rss/bills.xml", 30, (r) => row("Congress", "GovInfo", "Bill text", r.title, r.published, r.link)),
      rss("Congressional hearings (GovInfo)", "https://www.govinfo.gov/rss/chrg.xml", 60, (r) => row("Congress", "GovInfo", "Hearing", r.title, r.published, r.link)),
      rss("Congressional Record (GovInfo)", "https://www.govinfo.gov/rss/crec.xml", 30, (r) => row("Congress", "GovInfo", "Congressional Record", r.title, r.published, r.link)),
      rss("Congressional Budget Office", "https://www.cbo.gov/publications/all/rss.xml", 60, (r) => row("Congress", "CBO", /^(H|S)\.\s?(R\.|J\.|Res|Con)|^(H|S)\.\s?\d/.test(r.title) ? "Cost estimate" : "CBO report", r.title, r.published, r.link)),
      rss("CRS reports", "https://www.everycrsreport.com/rss.xml", 60, (r) => row("Congress", "CRS", "CRS report", r.title, r.published, r.link)),
      rss("GAO reports", "https://www.gao.gov/rss/reports.xml", 30, (r) => row("Congress", "GAO", "GAO report", r.title, r.published, r.link)),
      // ---- Intelligence & law enforcement
      rss("FBI · national press releases", "https://www.fbi.gov/feeds/national-press-releases/rss.xml", 30, (r) => row("Intel & Law", "FBI", "Press release", r.title, r.published, r.link)),
      rss("FBI · in the news", "https://www.fbi.gov/feeds/fbi-in-the-news/rss.xml", 30, (r) => row("Intel & Law", "FBI", "FBI news", r.title, r.published, r.link)),
      feed(status, "CIA · stories", "https://www.cia.gov/stories/", async () => {
        const html = await get("https://www.cia.gov/stories/");
        const seen = new Set();
        return [...html.matchAll(/<a\b[^>]*>/g)].map((m) => {
          const href = (m[0].match(/href="(\/stories\/story\/[^"]+)"/) || [])[1];
          const t = clean((m[0].match(/aria-label="([^"]+)"/) || [])[1] || "");
          if (!href || !t || seen.has(href)) return null; seen.add(href);
          return row("Intel & Law", "CIA", "CIA story", t, "", "https://www.cia.gov" + href);
        }).filter(Boolean).slice(0, 20);
      }),
      feed(status, "Justice Department · press releases", "https://www.justice.gov/api/v1/press_releases.json", async () => (JSON.parse(await get("https://www.justice.gov/api/v1/press_releases.json?sort=date&direction=DESC&pagesize=100")).results || [])
        .map((d) => {
          const orgs = (d.component || []).map((c) => c.name).filter(Boolean);
          if (d.url && d.body) texts[d.url] = extractBlocks(String(d.body), 200);
          return { ...row("Intel & Law", "Justice Department", orgs[0] || "Press release", d.title, new Date(Number(d.date) * 1000).toISOString().slice(0, 19) + "Z", d.url, (d.topic || []).map((t) => t.name).join(", ")), orgs: orgs.join(" · ") };
        })),
      feed(status, "Treasury OFAC · sanctions actions", "https://ofac.treasury.gov/recent-actions", async () => {
        const html = await get("https://ofac.treasury.gov/recent-actions");
        return dedupe([...html.matchAll(/href="(\/recent-actions\/(\d{8})[^"]*)"[^>]*>([^<]+)</g)].map((m) => row("Intel & Law", "Treasury OFAC", "Sanctions action", m[3], `${m[2].slice(0, 4)}-${m[2].slice(4, 6)}-${m[2].slice(6, 8)}`, "https://ofac.treasury.gov" + m[1])), (r) => r.link);
      }),
      // ---- Courts
      ...[term, String(+term - 1).padStart(2, "0")].map((tm) => feed(status, `Supreme Court · opinions OT20${tm}`, `https://www.supremecourt.gov/opinions/slipopinion/${tm}`, async () => {
        const html = await get(`https://www.supremecourt.gov/opinions/slipopinion/${tm}`);
        return [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => {
          const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1]);
          if (cells.length < 5) return null;
          const href = (m[1].match(/href=['"]([^'"]+\.pdf)['"]/i) || [])[1];
          const holding = (cells[3].match(/title="([^"]*)"/) || [])[1] || "";
          const [mm, dd, yy] = clean(cells[1]).split("/");
          if (!yy) return null;
          const j = clean(cells[4]);
          return row("Courts", "Supreme Court", "Opinion", clean(cells[3]), `${yy.length === 2 ? "20" + yy : yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`, href ? new URL(href, "https://www.supremecourt.gov/opinions/").href : `https://www.supremecourt.gov/opinions/slipopinion/${tm}`, `Docket ${clean(cells[2])} · ${j === "PC" ? "Per curiam" : "Opinion by " + j}${holding ? " · " + clean(holding) : ""}`);
        }).filter(Boolean);
      })),
      rss("U.S. Courts news", "https://www.uscourts.gov/news/rss", 90, (r) => row("Courts", "U.S. Courts", "Judiciary news", r.title, r.published, r.link)),
      // ---- World & defense
      rss("Defense Department · releases", "https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=9&Site=945&max=40", 30, (r) => row("World", "Defense Department", "Release", r.title, r.published, r.link)),
      rss("UN News", "https://news.un.org/feed/subscribe/en/news/all/rss.xml", 7, (r) => row("World", "United Nations", "UN News", r.title, r.published, r.link)),
    ]);
    const rows = dedupe(parts.flat().filter(Boolean), (r) => r.link).sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    // FBI Ten Most Wanted, as the FBI publishes it (names, charges, rewards; no photos).
    const wanted = await feed(status, "FBI · Ten Most Wanted", "https://api.fbi.gov/wanted/v1/list", async () => (JSON.parse(await get("https://api.fbi.gov/wanted/v1/list?poster_classification=ten&pageSize=20", { ua: "curl/8.5.0" })).items || [])
      .map((w) => ({ name: clean(w.title), charges: clean(w.description, 200), reward: clean(w.reward_text, 200), office: (w.field_offices || []).join(", "), caution: clean(w.warning_message, 80), published: (w.publication || "").slice(0, 10), link: w.url })).filter((w) => /^https:\/\//.test(w.link))) || [];
    return { rows, wanted, texts, status };
  },

  // Sports: scores, standings and headlines from ESPN's public site API.
  async sports() {
    const status = [];
    const E = "https://site.api.espn.com/apis/site/v2/sports/";
    const LEAGUES = [
      ["NFL", "football/nfl", 1], ["NBA", "basketball/nba", 1], ["NHL", "hockey/nhl", 1], ["MLB", "baseball/mlb", 1],
      ["College football", "football/college-football", 1], ["College basketball", "basketball/mens-college-basketball", 0],
      ["Premier League", "soccer/eng.1", 1], ["MLS", "soccer/usa.1", 1], ["Champions League", "soccer/uefa.champions", 0],
      ["WNBA", "basketball/wnba", 0], ["UFC", "mma/ufc", 0], ["F1", "racing/f1", 0], ["Golf", "golf/pga", 0],
    ];
    const side = (t) => ({
      logo: t.team?.logo || t.team?.logos?.[0]?.href || t.athlete?.headshot?.href || t.athlete?.flag?.href || "",
      abbr: t.team?.abbreviation || (t.athlete?.shortName || t.athlete?.displayName || "").slice(0, 14), name: t.team?.displayName || t.athlete?.displayName || "",
      score: t.score ?? "", color: t.team?.color ? "#" + t.team.color : "", record: t.records?.[0]?.summary || "", winner: t.winner === true || t.winner === "true",
    });
    const games = [], news = [], tables = [];
    await Promise.all(LEAGUES.map(async ([league, path, hasStandings]) => {
      const sb = await feed(status, `ESPN · ${league} scores`, E + path + "/scoreboard", async () => JSON.parse(await get(E + path + "/scoreboard")).events || []);
      for (const e of sb || []) {
        const comps = e.competitions || [];
        const c = comps[0]; if (!c) continue;
        const st = c.status?.type || e.status?.type || {};
        const base = { league, id: e.id, name: e.name, date: e.date, state: st.state || "", detail: st.shortDetail || st.description || "", link: (e.links || []).find((l) => /gamecast|summary|event/i.test((l.rel || []).join(" ")))?.href || e.links?.[0]?.href || "" };
        if (c.competitors?.length === 2 && comps.length === 1) {
          const home = c.competitors.find((t) => t.homeAway === "home") || c.competitors[0], away = c.competitors.find((t) => t !== home);
          games.push({ ...base, kind: "match", home: side(home), away: side(away), venue: c.venue?.fullName || "", tv: (c.broadcasts || []).flatMap((b) => b.names || []).join(", "), note: c.headlines?.[0]?.shortLinkText || c.notes?.[0]?.headline || "" });
        } else if (league === "UFC") {
          games.push({ ...base, kind: "card", bouts: comps.map((x) => ({ a: side(x.competitors?.[0] || {}), b: side(x.competitors?.[1] || {}), detail: x.status?.type?.shortDetail || "", weight: x.type?.abbreviation || x.note || "" })).slice(0, 14) });
        } else {
          const last = comps.filter((x) => x.competitors?.length > 2).slice(-1)[0] || c;
          const top = [...(last.competitors || [])].sort((a, b) => (+a.order || 999) - (+b.order || 999)).slice(0, 10).map((t) => ({ ...side(t), pos: +t.order || null }));
          games.push({ ...base, kind: "field", session: last.type?.abbreviation || "", leaders: top });
        }
      }
      const nw = await feed(status, `ESPN · ${league} news`, E + path + "/news", async () => JSON.parse(await get(E + path + "/news?limit=15")).articles || []);
      for (const a of nw || []) {
        const link = a.links?.web?.href;
        if (!/^https:\/\//.test(link || "") || !a.headline) continue;
        const im = (a.images || []).find((x) => /^https:/.test(x.url || "")) || {};
        news.push({ league, title: clean(a.headline, 200), summary: clean(a.description, 320), published: a.published || a.lastModified || "", link, source: "ESPN", premium: !!a.premium, image: im.url || "", credit: clean(im.credit || "", 80) });
      }
      if (hasStandings) {
        const url = `https://site.api.espn.com/apis/v2/sports/${path}/standings`;
        const sd = await feed(status, `ESPN · ${league} standings`, url, async () => JSON.parse(await get(url)));
        const groups = [];
        const walk = (n, parent) => { if (n.standings?.entries?.length) groups.push({ name: n.name || parent, entries: n.standings.entries }); for (const ch of n.children || []) walk(ch, n.name); };
        if (sd) walk(sd, league);
        for (const g of groups) {
          tables.push({ league, group: g.name, rows: g.entries.map((en) => {
            const v = Object.fromEntries((en.stats || []).map((x) => [x.name, x.displayValue]));
            return { team: en.team?.displayName || "", logo: en.team?.logos?.[0]?.href || "", abbr: en.team?.abbreviation || "", color: en.team?.color ? "#" + en.team.color : "", w: v.wins ?? "", l: v.losses ?? "", t: v.ties ?? v.otLosses ?? "", pct: v.winPercent ?? "", pts: v.points ?? "", gb: v.gamesBehind ?? "", streak: v.streak ?? "", diff: v.pointDifferential ?? v.differential ?? "", rank: +(v.playoffSeed || v.rank || 0) || null };
          }).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99) || (+b.pts || 0) - (+a.pts || 0) || (+b.pct || 0) - (+a.pct || 0)) });
        }
      }
    }));
    const order = Object.fromEntries(LEAGUES.map(([l], i) => [l, i]));
    const rank = { in: 0, post: 1, pre: 2 };
    games.sort((a, b) => (rank[a.state] ?? 3) - (rank[b.state] ?? 3) || (a.state === "post" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)) || order[a.league] - order[b.league]);
    news.sort((a, b) => b.published.localeCompare(a.published));
    return { rows: games, news: dedupe(news, (r) => r.link), tables, leagues: LEAGUES.map(([l]) => l), status };
  },

  // Who holds office now: President, Vice President, Cabinet, Congress (with leadership and committees), Supreme Court.
  async who() {
    const status = [];
    const GH = "https://unitedstates.github.io/congress-legislators/";
    const cgKey = globalThis.Netlify?.env.get("CONGRESS_API_KEY") || (typeof process !== "undefined" && process.env.CONGRESS_API_KEY) || "DEMO_KEY";
    const [leg, exec, cms, cmm, cab, sc, adm, cgm] = await Promise.all([
      feed(status, "Congress members (congress-legislators)", GH + "legislators-current.json", async () => JSON.parse(await get(GH + "legislators-current.json", { timeout: 15000 }))),
      feed(status, "President & Vice President (congress-legislators)", GH + "executive.json", async () => JSON.parse(await get(GH + "executive.json", { timeout: 12000 }))),
      feed(status, "Committees (congress-legislators)", GH + "committees-current.json", async () => JSON.parse(await get(GH + "committees-current.json", { timeout: 12000 }))),
      feed(status, "Committee membership (congress-legislators)", GH + "committee-membership-current.json", async () => JSON.parse(await get(GH + "committee-membership-current.json", { timeout: 15000 }))),
      feed(status, "White House · the Cabinet", "https://www.whitehouse.gov/administration/the-cabinet/", async () => {
        const html = await get("https://www.whitehouse.gov/administration/the-cabinet/", { timeout: 12000 });
        const out = [];
        const re = /<h2[^>]*>([\s\S]*?)<\/h2>\s*(?:<hr[^>]*>\s*)?<h3[^>]*>([\s\S]*?)<\/h3>/g;
        const imgs = [...html.matchAll(/<img[^>]*>/gi)].map((t) => ({ at: t.index, alt: clean((t[0].match(/alt="([^"]*)"/i) || [])[1] || ""), src: (t[0].match(/src="(https:\/\/www\.whitehouse\.gov\/wp-content\/uploads\/[^"?]+\.(?:jpe?g|png|webp))/i) || [])[1] || "" })).filter((x) => x.src && !/Cabinet\.jpg|Social-Share|Mobile-App/i.test(x.src));
        const heads = [...html.matchAll(re)];
        heads.forEach((m, i) => {
          const name = clean(m[1]), title = clean(m[2]);
          if (!name || !title || name.length > 60 || title.length > 90) return;
          const last = name.split(" ").pop().toLowerCase();
          const end = heads[i + 1]?.index ?? m.index + 8000;
          // the portrait sits right after the name on this page; match by alt text or file name first
          const near = imgs.filter((x) => x.at > m.index && x.at < end);
          const hit = imgs.find((x) => x.alt.toLowerCase() === name.toLowerCase()) || near.find((x) => x.src.toLowerCase().includes(last)) || near[0];
          out.push({ name, title, photo: hit ? hit.src + "?w=400" : "" });
        });
        return dedupe(out, (x) => x.title + x.name);
      }),
      feed(status, "Supreme Court · justices", "https://www.supremecourt.gov/about/biographies.aspx", async () => {
        const html = await get("https://www.supremecourt.gov/about/biographies.aspx", { timeout: 12000 });
        const cut = html.indexOf("Retired"); const cur = cut > 0 ? html.slice(0, cut) : html;
        return dedupe([...cur.matchAll(/<img[^>]+alt="([^"]+?),\s*(Chief Justice of the United States|Associate Justice)"[^>]+src="(justice_pictures\/[^"]+)"/g)]
          .map((m) => ({ name: clean(m[1]), title: m[2], photo: "https://www.supremecourt.gov/about/" + encodeURI(m[3]) })), (x) => x.name).slice(0, 9); // the Court has nine seats; sitting justices are listed first
      }),
      // official portraits of the President and Vice President, as posted by the White House
      feed(status, "White House · the Administration", "https://www.whitehouse.gov/administration/", async () => {
        const html = await get("https://www.whitehouse.gov/administration/", { timeout: 12000 });
        return [...html.matchAll(/<img[^>]+src="(https:\/\/www\.whitehouse\.gov\/wp-content\/uploads\/[^"?]+\.(?:jpe?g|png|webp))/gi)].map((m) => m[1]);
      }),
      // Congress.gov member portraits cover newly sworn-in members the open dataset has not added yet
      feed(status, "Congress.gov · member portraits", "https://api.congress.gov/v3/member", async () => {
        const pages = await Promise.all([0, 250, 500].map((o) => get(`https://api.congress.gov/v3/member?currentMember=true&limit=250&offset=${o}&format=json&api_key=${cgKey}`, { timeout: 12000 }).then(JSON.parse).catch(() => ({ members: [] }))));
        const map = {};
        for (const pg of pages) for (const m of pg.members || []) if (m.depiction?.imageUrl) map[m.bioguideId] = m.depiction.imageUrl;
        if (!Object.keys(map).length) throw new Error("no portraits returned");
        return map;
      }),
    ]);
    // Settled history for each sitting justice: who nominated them and when they took the bench.
    const SEATED = { Roberts: ["George W. Bush", "2005-09-29"], Thomas: ["George H. W. Bush", "1991-10-23"], Alito: ["George W. Bush", "2006-01-31"], Sotomayor: ["Barack Obama", "2009-08-08"], Kagan: ["Barack Obama", "2010-08-07"], Gorsuch: ["Donald Trump", "2017-04-10"], Kavanaugh: ["Donald Trump", "2018-10-06"], Barrett: ["Donald Trump", "2020-10-27"], Jackson: ["Joe Biden", "2022-06-30"] };
    const justices = (sc || []).map((j) => { const k = Object.keys(SEATED).find((x) => j.name.includes(x)); return { ...j, nominatedBy: k ? SEATED[k][0] : "", seated: k ? SEATED[k][1] : "" }; });
    const today = new Date().toISOString().slice(0, 10);
    const cur = (terms) => terms.find((t) => t.start <= today && (!t.end || t.end >= today));
    const execNow = (exec || []).map((p) => ({ p, t: cur(p.terms) })).filter((x) => x.t);
    const president = execNow.find((x) => x.t.type === "prez"), vp = execNow.find((x) => x.t.type === "viceprez");
    const commName = {}, commChamber = {};
    for (const c of cms || []) { commName[c.thomas_id] = c.name; commChamber[c.thomas_id] = c.type; }
    const memberComms = {};
    for (const [id, list] of Object.entries(cmm || {})) {
      if (!commName[id]) continue; // full committees only
      for (const m of list) (memberComms[m.bioguide] ||= []).push({ name: commName[id].replace(/^(House|Senate|Joint) Committee on (the )?/, ""), title: m.title || "", rank: m.rank });
    }
    const members = (leg || []).map((x) => {
      const t = x.terms[x.terms.length - 1];
      const lead = (x.leadership_roles || []).filter((r) => !r.end || r.end >= today).map((r) => r.title);
      const first = x.terms.find((tt) => tt.type === t.type)?.start || t.start;
      return {
        id: x.id.bioguide, name: x.name.official_full || `${x.name.first} ${x.name.last}`, last: x.name.last, chamber: t.type === "sen" ? "Senate" : "House",
        party: t.party === "Democrat" ? "Democratic" : t.party, state: t.state, district: t.type === "rep" ? t.district : null, rank: t.state_rank || "", cls: t.class || null,
        since: first.slice(0, 4), termEnd: t.end, url: t.url || "", phone: t.phone || "", office: t.address || "", lead,
        committees: (memberComms[x.id.bioguide] || []).sort((a, b) => (b.title ? 1 : 0) - (a.title ? 1 : 0)).slice(0, 6),
        photo: `https://unitedstates.github.io/images/congress/225x275/${x.id.bioguide}.jpg`,
        photo2: (cgm || {})[x.id.bioguide] || "",
      };
    });
    const leaders = members.filter((m) => m.lead.length).flatMap((m) => m.lead.map((title) => ({ title, name: m.name, party: m.party, state: m.state, chamber: m.chamber, id: m.id, photo: m.photo, photo2: m.photo2 })));
    const committees = (cms || []).map((c) => {
      const list = (cmm || {})[c.thomas_id] || [];
      const chair = list.find((m) => /chair/i.test(m.title || "") && m.party === "majority"), ranking = list.find((m) => /ranking/i.test(m.title || ""));
      return { id: c.thomas_id, name: c.name, chamber: c.type, jurisdiction: clean(c.jurisdiction || "", 400), chair: chair?.name || "", ranking: ranking?.name || "", size: list.length, url: c.url || "" };
    });
    const portrait = (last) => (adm || []).find((u) => /portrait/i.test(u) && u.toLowerCase().includes(last.toLowerCase())) || (adm || []).find((u) => u.toLowerCase().includes(last.toLowerCase())) || "";
    const pres = (x) => x && ({ name: `${x.p.name.first === "James David" ? "JD" : x.p.name.first} ${x.p.name.last}`, party: x.t.party, start: x.t.start, end: x.t.end, how: x.t.how || "", photo: (() => { const u = portrait(x.p.name.last); return u ? u + "?w=400" : ""; })() });
    return { set: "who", rows: members, president: pres(president), vp: pres(vp), cabinet: cab || [], justices, leaders, committees, status };
  },

  // Roll-call votes: House Clerk XML (with party totals) and the Senate's vote list.
  async votes() {
    const status = [];
    const year = new Date().getUTCFullYear();
    const roll = (y, n) => `https://clerk.house.gov/evs/${y}/roll${String(n).padStart(3, "0")}.xml`;
    const exists = async (y, n) => { try { const t = await get(roll(y, n), { timeout: 6000 }); return t.includes("<rollcall-vote"); } catch { return false; } };
    const house = await feed(status, "House Clerk · roll-call votes", `https://clerk.house.gov/evs/${year}/`, async () => {
      let y = year, lo = 0, hi = 1024;
      if (!(await exists(y, 1))) { y = year - 1; }
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (await exists(y, mid)) lo = mid; else hi = mid; }
      const nums = []; for (let n = lo; n > 0 && nums.length < 30; n--) nums.push(n);
      const xs = await Promise.all(nums.map((n) => get(roll(y, n), { timeout: 8000 }).catch(() => null)));
      return xs.filter(Boolean).map((x, i) => {
        const t = (n) => clean(tag(x, n));
        const parties = [...x.matchAll(/<totals-by-party>([\s\S]*?)<\/totals-by-party>/g)].map((m) => ({ party: clean(tag(m[1], "party")), yea: +clean(tag(m[1], "yea-total")), nay: +clean(tag(m[1], "nay-total")), present: +clean(tag(m[1], "present-total")), nv: +clean(tag(m[1], "not-voting-total")) }));
        const tot = (x.match(/<totals-by-vote>([\s\S]*?)<\/totals-by-vote>/) || [])[1] || "";
        return {
          chamber: "House", roll: +t("rollcall-num"), date: dmy(t("action-date")),
          measure: t("legis-num"), question: t("vote-question"), title: clean(tag(x, "vote-desc"), 260), result: t("vote-result"),
          yea: +clean(tag(tot, "yea-total")), nay: +clean(tag(tot, "nay-total")), present: +clean(tag(tot, "present-total")), nv: +clean(tag(tot, "not-voting-total")),
          parties, link: `https://clerk.house.gov/Votes/${y}${nums[i]}`,
        };
      });
    }) || [];
    const congress = Math.floor((year - 1789) / 2) + 1, session = year % 2 === 1 ? 1 : 2;
    const surl = `https://www.senate.gov/legislative/LIS/roll_call_lists/vote_menu_${congress}_${session}.xml`;
    const senate = await feed(status, "Senate · roll-call votes", surl, async () => {
      const x = await get(surl, { timeout: 10000 });
      return (x.match(/<vote>[\s\S]*?<\/vote>/g) || []).slice(0, 30).map((v) => {
        const n = clean(tag(v, "vote_number")), dt = clean(tag(v, "vote_date"));
        return {
          chamber: "Senate", roll: +n, date: dmy(dt, year),
          measure: clean(tag(v, "issue")), question: clean(tag(v, "question")), title: clean(tag(v, "title"), 260), result: clean(tag(v, "result")),
          yea: +clean(tag(v, "yeas")), nay: +clean(tag(v, "nays")), present: null, nv: null, parties: [],
          link: `https://www.senate.gov/legislative/LIS/roll_call_votes/vote${congress}${session}/vote_${congress}_${session}_${n.padStart(5, "0")}.htm`,
        };
      });
    }) || [];
    const rows = [...house, ...senate].sort((a, b) => b.date.localeCompare(a.date) || b.roll - a.roll);
    return { rows, status };
  },
};

export async function buildSet(name) {
  const fn = SETS[name];
  if (!fn) return null;
  const out = await fn();
  return { set: name, generated: new Date().toISOString(), ...out };
}

// ---------------------------------------------------------------------------
// Reader: fetch an official document and return it as plain text blocks.
// Only U.S. government sites (public domain) are fetched in full; anything else
// is refused so the site never republishes copyrighted articles.
const READ_HOSTS = /(^|\.)(gov|mil)$|(^|\.)everycrsreport\.com$/i;
export function canRead(url) {
  try { const u = new URL(url); return u.protocol === "https:" && READ_HOSTS.test(u.hostname); } catch { return false; }
}
const BOILER = /^(internet explorer version|\[\[page \d+\]\]|<doc>|<\/doc>|share|print|email|tweet|facebook|linkedin|copy link|skip to|menu|search|subscribe|related|top of page|back to top|official websites use|an official website|here's how you know|secure \.gov websites|the \.gov means|a lock|lock|share sensitive information)/i;
function extractBlocks(html, max = 500) {
  html = html.replace(/<(script|style|noscript|svg|nav|header|footer|aside|form|button|iframe|template)\b[\s\S]*?<\/\1>/gi, " ");
  const pick = (re) => { const m = html.match(re); return m ? m[1] : null; };
  const body =
    pick(/<div[^>]+class="[^"]*(?:entry-content|field--name-field-pr-body|field--name-body|body-content|article-body|body-text|rich-text|usa-prose)[^"]*"[^>]*>([\s\S]*)/i) ||
    pick(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || pick(/<article\b[^>]*>([\s\S]*?)<\/article>/i) || pick(/<body\b[^>]*>([\s\S]*)<\/body>/i) || html;
  const blocks = [];
  for (const m of body.matchAll(/<(h[1-4]|p|li|blockquote|pre|td)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = m[1].toLowerCase();
    const x = clean(m[2]);
    if (!x || BOILER.test(x)) continue;
    if ((t === "p" || t === "li" || t === "td") && x.length < 3) continue;
    const kind = t.startsWith("h") ? "h" : t === "li" ? "li" : t === "pre" ? "pre" : "p";
    if (blocks.length && blocks[blocks.length - 1].x === x) continue;
    blocks.push({ t: kind, x: x.slice(0, 4000) });
    if (blocks.length >= max) break;
  }
  return blocks;
}
function preBlocks(text, max = 600) {
  // Plain-text documents (GovInfo, Federal Register raw text): split into paragraphs.
  return text.replace(/\r/g, "").split(/\n\s*\n/).map((p) => p.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, " ").trim()).filter((p) => p.length > 1 && !/^\[\[Page \d+\]\]$|^\[Federal Register Volume|^\[Congressional Bills|From the U\.S\. Government Publishing Office\]?$|^<\/?DOC>$|^\[FR Doc/i.test(p)).slice(0, max).map((x) => ({ t: /^[A-Z0-9 ,.'’:;()-]{6,90}$/.test(x) && x.length < 90 ? "h" : "p", x: x.slice(0, 6000) }));
}
// A government page's own share image (og:image), skipping generic seals and logos.
const GENERIC_IMG = /(logo|seal|default|placeholder|share-image|social-share|og-image|opengraph|favicon|banner|wordmark|flag-)/i;
export async function ogImage(url) {
  if (!canRead(url) || /\.pdf($|\?)/i.test(url)) return "";
  const html = await get(url, { timeout: 8000 });
  const head = html.slice(0, 60000);
  const pick = (name) => (head.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)`, "i")) || head.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i")) || [])[1];
  let img = pick("og:image") || pick("twitter:image") || "";
  if (!img) return "";
  img = new URL(img.replace(/&amp;/g, "&"), url).href;
  if (!/^https:/.test(img) || GENERIC_IMG.test(img)) return "";
  return img;
}
export async function readDoc(url) {
  if (!canRead(url)) return { url, kind: "external", blocks: [] };
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, "");
  const out = (blocks, extra = {}) => ({ url, site: host, kind: blocks.length ? "full" : "empty", blocks, fetched: new Date().toISOString(), ...extra });
  if (/\.pdf$/i.test(u.pathname)) return { url, site: host, kind: "pdf", blocks: [] };
  // Federal Register: the same document's official text on GovInfo.
  if (host === "federalregister.gov") {
    const m = u.pathname.match(/\/documents\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)/);
    if (m) {
      const html = await get(`https://www.govinfo.gov/content/pkg/FR-${m[1]}-${m[2]}-${m[3]}/html/${m[4]}.htm`, { timeout: 12000 });
      const pre = html.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/i);
      return out(pre ? preBlocks(clean(pre[1].replace(/\n/g, "\u0000")).replace(/\u0000/g, "\n")) : extractBlocks(html), { pdf: `https://www.govinfo.gov/content/pkg/FR-${m[1]}-${m[2]}-${m[3]}/pdf/${m[4]}.pdf` });
    }
  }
  // GovInfo: the package's HTML rendition is the official text.
  if (host === "govinfo.gov") {
    const pkg = (u.pathname.match(/\/app\/details\/([A-Z]+-[^/]+)/) || [])[1];
    if (pkg) {
      const html = await get(`https://www.govinfo.gov/content/pkg/${pkg}/html/${pkg}.htm`, { timeout: 12000 });
      const pre = html.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/i);
      return out(pre ? preBlocks(clean(pre[1].replace(/\n/g, "\u0000")).replace(/\u0000/g, "\n")) : extractBlocks(html), { pdf: `https://www.govinfo.gov/content/pkg/${pkg}/pdf/${pkg}.pdf` });
    }
  }
  // Congress.gov: summaries and actions from the official API.
  if (host === "congress.gov") {
    const m = u.pathname.match(/\/bill\/(\d+)[a-z]{2}-congress\/([a-z-]+)\/(\d+)/);
    const T = { "house-bill": "hr", "senate-bill": "s", "house-resolution": "hres", "senate-resolution": "sres", "house-joint-resolution": "hjres", "senate-joint-resolution": "sjres", "house-concurrent-resolution": "hconres", "senate-concurrent-resolution": "sconres" };
    if (m && T[m[2]]) {
      const key = globalThis.Netlify?.env.get("CONGRESS_API_KEY") || (typeof process !== "undefined" && process.env.CONGRESS_API_KEY) || "DEMO_KEY";
      const base = `https://api.congress.gov/v3/bill/${m[1]}/${T[m[2]]}/${m[3]}`;
      const [bill, sums, acts] = await Promise.all([base, base + "/summaries", base + "/actions"].map((x) => get(`${x}?format=json&limit=60&api_key=${key}`).then(JSON.parse).catch(() => ({}))));
      const b = bill.bill || {};
      const blocks = [];
      if (b.title) blocks.push({ t: "h", x: b.title });
      if (b.sponsors?.length) blocks.push({ t: "p", x: "Sponsor: " + b.sponsors.map((s) => s.fullName).join(", ") + (b.cosponsors?.count ? ` · ${b.cosponsors.count} cosponsors` : "") });
      if (b.introducedDate) blocks.push({ t: "p", x: `Introduced ${b.introducedDate}${b.policyArea?.name ? " · Policy area: " + b.policyArea.name : ""}` });
      const s = (sums.summaries || []).slice(-1)[0];
      if (s) { blocks.push({ t: "h", x: `Summary (${s.actionDesc || "CRS"}, ${s.actionDate || ""})` }); blocks.push(...extractBlocks(s.text || "")); }
      if (acts.actions?.length) { blocks.push({ t: "h", x: "Actions" }); for (const a of acts.actions) blocks.push({ t: "li", x: `${a.actionDate} · ${clean(a.text)}` }); }
      return out(blocks, { title: b.title });
    }
  }
  return out(extractBlocks(await get(url, { timeout: 12000 })));
}
