# Plainsight

Live public intelligence: the President, Congress, FBI and intelligence, courts, world, sports, and cyber threats, pulled from official and public sources on every visit.

## Deploy (Vercel)

    npx vercel deploy --prod

Then add the domain in Vercel (Project → Settings → Domains → `plainsight.dev-zero.dev`) and at Namecheap add a CNAME record: host `plainsight`, value `cname.vercel-dns.com`.

Optional: set `CONGRESS_API_KEY` (free from api.data.gov) in Project → Settings → Environment Variables for reliable Congress.gov data.

Built by Zero.
