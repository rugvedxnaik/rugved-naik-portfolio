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
  assert.match(indexHtml, /data-scroll-progress/);
  assert.match(indexHtml, /data-active-signal-card/);
  assert.match(indexHtml, /class="ui-icon"/);
  assert.match(pageTsx, /consumer-app-active-readout/);
  assert.match(pageTsx, /consumer-app-quote-underline/);
  assert.match(scriptJs, /signal-quote-underline/);
  assert.match(scriptJs, /setupScrollProgress/);
  assert.match(scriptJs, /setActiveSignal/);
  assert.equal(portfolio.cases.length, 16);
  assert.equal(portfolio.hiring.facts.find((item) => item.label === "Next search window")?.value, "March 2027");
  assert.match(indexHtml, /For HRs and hiring teams/);
  assert.match(pageTsx, /March 2027 job search/);
  assert.equal(Boolean(portfolio.interests), false);
  assert.match(portfolio.lensClosing, /Traveling across India/);
  assert.doesNotMatch(indexHtml, /Site last touched/);
  assert.doesNotMatch(pageTsx, /Site last touched/);

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

  const peora = portfolio.cases.find((item) => item.slug === "peora-availability-ranking");
  assert.ok(peora);
  assert.equal(peora.validation, "Operationally validated");
  assert.equal(peora.caseLink, "case-peora-availability-ranking.html");

  const boxProof = portfolio.cases.find((item) => item.slug === "box-is-the-proof");
  assert.ok(boxProof);
  assert.equal(boxProof.routeStatus, "still routing");
  assert.equal(boxProof.caseLink, "case-box-is-the-proof.html");

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

test("public portfolio copy avoids em and en dashes", async () => {
  const publicFiles = [
    "../observations-site/index.html",
    "../observations-site/case-miutine.html",
    "../observations-site/case-givenchy.html",
    "../observations-site/case-19h03.html",
    "../observations-site/case-electric-mobility.html",
    "../observations-site/case-recognition-index.html",
    "../observations-site/case-withings.html",
    "../observations-site/case-amazon-conversion.html",
    "../observations-site/case-peora-availability-ranking.html",
    "../observations-site/case-box-is-the-proof.html",
    "../observations-site/case-loreal-ai-personalization.html",
    "../observations-site/case-danone-claim-saturation.html",
    "../observations-site/case-lvmh-shared-infrastructure.html",
    "../observations-site/data/portfolio.json",
  ];

  const files = await Promise.all(
    publicFiles.map(async (file) => [file, await readFile(new URL(file, import.meta.url), "utf8")]),
  );

  for (const [file, contents] of files) {
    assert.doesNotMatch(contents, /\u2014|\u2013/, file);
  }
});

test("v4 dossier pages share the standard section structure", async () => {
  const dossierFiles = [
    "../observations-site/case-miutine.html",
    "../observations-site/case-givenchy.html",
    "../observations-site/case-loreal-ai-personalization.html",
    "../observations-site/case-danone-claim-saturation.html",
    "../observations-site/case-lvmh-shared-infrastructure.html",
    "../observations-site/case-peora-availability-ranking.html",
    "../observations-site/case-box-is-the-proof.html",
  ];

  const expectedSections = [
    "The signal",
    "Output",
    "What it shows",
  ];

  for (const file of dossierFiles) {
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(html, /<h1>[^<]+<\/h1>/, file);
    assert.match(html, /<h3>[^<]+<\/h3>/, file);
    assert.match(html, /class="dossier-status"><em>Status:/, file);
    assert.match(html, /class="dossier-signal-quote"/, file);
    assert.match(html, /<strong>Product implication/, file);
    assert.match(html, /<strong>GTM implication/, file);
    for (const section of expectedSections) {
      assert.match(html, new RegExp(section), `${file} ${section}`);
    }
  }
});
