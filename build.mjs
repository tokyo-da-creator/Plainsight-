// Wraps index.html into a full document for deployment (public/index.html).
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
const body = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const head = body.match(/^[\s\S]*?(?=<style>)/)[0];
const rest = body.slice(head.length);
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36)).slice(0, 8);
const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0d0f0a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22213 194 830 830%22%3E%3Crect x=%22213%22 y=%22194%22 width=%22830%22 height=%22830%22 rx=%22183%22 fill=%22%232a2a31%22/%3E%3Cpath fill=%22%23fff%22 d=%22M628.0,392.0L432.0,392.0L498.0,509.0L382.6,500.0L628.0,848.0L873.4,500.0L758.0,509.0L824.0,392.0Z%22/%3E%3Cpath fill=%22%230b0b0d%22 fill-rule=%22evenodd%22 d=%22M306.0,392.0L432.0,392.0L549.0,478.0L628.0,846.0L418.0,530.0L498.0,509.0L338.0,468.0L300.0,404.0Q294.0,394.0 306.0,392.0ZM380.2,500.0L391.0,500.0L626.8,842.0L628.0,852.0ZM950.0,392.0L824.0,392.0L707.0,478.0L628.0,846.0L838.0,530.0L758.0,509.0L918.0,468.0L956.0,404.0Q962.0,394.0 950.0,392.0ZM875.8,500.0L865.0,500.0L629.2,842.0L628.0,852.0ZM525.4,452.0L730.6,452.0L700.7,473.9L628.0,846.0L555.3,473.9ZM579.0,487.0L677.0,487.0L628.0,836.0ZM628,526a15,15 0 1,0 0.01,0ZM628,587a15,15 0 1,0 0.01,0ZM628,649a15,15 0 1,0 0.01,0Z%22/%3E%3C/svg%3E">
${head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")}<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${rest.replace(/__BUILD__/g, BUILD)}
</body>
</html>
`;
mkdirSync(new URL("./public/", import.meta.url), { recursive: true });
writeFileSync(new URL("./public/index.html", import.meta.url), doc);
if (existsSync(new URL("./assets/", import.meta.url))) cpSync(new URL("./assets/", import.meta.url), new URL("./public/assets/", import.meta.url), { recursive: true });
cpSync(new URL("./learn.js", import.meta.url), new URL("./public/learn.js", import.meta.url));
console.log("public/index.html", doc.length, "bytes");
