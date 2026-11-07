// Wraps index.html into a full document for deployment (public/index.html).
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
const body = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const head = body.match(/^[\s\S]*?(?=<style>)/)[0];
const rest = body.slice(head.length);
const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0d0f0a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230d0f0a'/%3E%3Cpath d='M9 23 23 9' stroke='%23a3e635' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E">
${head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")}<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${rest}
</body>
</html>
`;
mkdirSync(new URL("./public/", import.meta.url), { recursive: true });
writeFileSync(new URL("./public/index.html", import.meta.url), doc);
if (existsSync(new URL("./assets/", import.meta.url))) cpSync(new URL("./assets/", import.meta.url), new URL("./public/assets/", import.meta.url), { recursive: true });
console.log("public/index.html", doc.length, "bytes");
