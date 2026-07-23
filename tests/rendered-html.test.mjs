import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  ["/", /The Consumer Read \| Rugved Naik/],
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

  assert.match(layout, /The Consumer Read \| Rugved Naik/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("portfolio archive follows the v3 content rules", async () => {
  const [indexHtml, pageTsx, scriptJs, portfolioJson] = await Promise.all([
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/script.js", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/data/portfolio.json", import.meta.url), "utf8"),
  ]);
  const portfolio = JSON.parse(portfolioJson);

  assert.equal((indexHtml.match(/data-signal-list/g) ?? []).length, 1);
  assert.equal((indexHtml.match(/data-signal-entry/g) ?? []).length, 0);
  assert.equal(portfolio.cases.length, 14);
  assert.equal(Boolean(portfolio.interests), false);
  assert.match(portfolio.lensClosing, /Traveling across India/);

  for (const file of [indexHtml, pageTsx, scriptJs, portfolioJson]) {
    assert.doesNotMatch(file, /consumer truth/i);
    assert.doesNotMatch(file, /consumer insight product strategy brand meaning PMM framing editorial systems/i);
    assert.doesNotMatch(file, /PMM framing|emotional moats|insight synthesis/);
    assert.doesNotMatch(file, /#interests|Interests archive coming soon/);
    assert.doesNotMatch(file, /case-baja/i);
    assert.doesNotMatch(file, /evidenceStrength|signal-strength/);
    assert.doesNotMatch(file, /Route:|Proof:|State:/);
  }

  for (const item of portfolio.cases) {
    assert.ok(item.signal.productImplication, item.slug);
    assert.ok(item.signal.gtmImplication, item.slug);
    assert.notEqual(item.slug, "baja-sae-experience");
  }

  const routedSignals = new Set(
    portfolio.cases
      .filter((item) => item.routeStatus === "routed")
      .map((item) => item.signalQuote.trim().toLowerCase()),
  );
  for (const note of portfolio.unroutedSignals) {
    assert.equal(routedSignals.has(note.signal.trim().toLowerCase()), false, note.signal);
  }

  await assert.rejects(access(new URL("../observations-site/case-baja.html", import.meta.url)));
});
