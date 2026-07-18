import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  ["/", /Rugved Naik — Strategy Archive/],
  ["/personalization", /On Personalization/],
  ["/givenchy", /Givenchy Face Architecture/],
  ["/19h03", /The first drink is not about alcohol/],
  ["/about", /intersection of consumer insight/],
];

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

test("server-renders every portfolio route", async () => {
  const worker = await loadWorker();

  for (const [route, expectedCopy] of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    const html = await response.text();
    assert.match(html, expectedCopy, route);
    assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/i, route);
  }
});

test("ships finished metadata and removes starter preview code", async () => {
  const [layout, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Rugved Naik — Strategy Archive/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
