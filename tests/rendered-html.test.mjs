import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  ["/", /Le Dossier \| Rugved Naik|Le Dossier/],
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

  assert.match(layout, /Le Dossier \| Rugved Naik/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("Le Dossier homepage follows the HR portfolio rules", async () => {
  const [indexHtml, pageTsx, dossierJs, portfolioJson] = await Promise.all([
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/le-dossier.js", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/data/portfolio.json", import.meta.url), "utf8"),
  ]);
  const portfolio = JSON.parse(portfolioJson);

  assert.match(indexHtml, /<title>Le Dossier \| Rugved Naik<\/title>/);
  assert.match(indexHtml, /role="tablist"/);
  assert.equal((indexHtml.match(/class="folder-tab(?: is-active)?"/g) ?? []).length, 7);
  assert.match(indexHtml, /data-lang-button="fr"/);
  assert.match(indexHtml, /data-lang-button="en"/);
  assert.match(indexHtml, /rugved-naik-cv\.pdf/);
  assert.match(indexHtml, /rugved-naik-dossier\.pdf/);
  assert.match(indexHtml, /Stage dès mars 2027 \/ alternance dès septembre 2027/);
  assert.match(indexHtml, /Convention de stage ESCP obligatoire\. Durée flexible 4-6 mois\./);
  assert.match(indexHtml, /Danone, Innovation & Productivity PM Intern/);
  assert.match(indexHtml, /Sep 2026 - Fév 2027/);
  assert.match(indexHtml, /IPROview, Power BI, innovation governance, KPIs and portfolio health/);
  assert.match(indexHtml, /Compétences/);
  assert.match(indexHtml, /Excel, Power BI, SQL/);
  assert.match(indexHtml, /Amazon Seller Central \/ Ads/);
  assert.match(indexHtml, /English C1, French A2 improving/);
  assert.match(indexHtml, /4 700\+/);
  assert.match(indexHtml, /68K EUR/);
  assert.match(indexHtml, /\+25%/);
  assert.match(indexHtml, /1,000\+/);
  assert.match(indexHtml, /This site is structured as a dossier, not a portfolio/);
  assert.match(indexHtml, /If you only open one dossier/);
  assert.match(indexHtml, /I usually reply within 24-48 hours/);
  assert.match(indexHtml, /Share a few lines of context/);
  assert.match(indexHtml, /Helpful context/);
  assert.doesNotMatch(indexHtml, /most relevant dossier|if the fit is clear|send me the problem/i);
  assert.match(indexHtml, /application\/ld\+json/);
  assert.match(indexHtml, /"knowsLanguage": \["English C1", "French A2", "Hindi", "Marathi"\]/);
  assert.match(indexHtml, /lead-dossier/);
  assert.match(indexHtml, /BAJA SAE and e-mobility/);
  assert.match(indexHtml, /case-electric-mobility\.html/);
  assert.match(indexHtml, /case-box-is-the-proof\.html/);
  assert.match(indexHtml, /Cultural & field research/);
  assert.match(indexHtml, /Timeline and working language/);
  assert.doesNotMatch(indexHtml, /Loading|data-signal-list|data-active-signal-card|sound-toggle|Switchboard/i);
  assert.match(pageTsx, /Le Dossier/);
  assert.match(pageTsx, /Download CV PDF/);
  assert.match(pageTsx, /Download dossier PDF/);
  assert.match(dossierJs, /setTab/);
  assert.match(dossierJs, /setLanguage/);
  assert.equal(portfolio.cases.length, 15);
  assert.equal(portfolio.hiring.facts.find((item) => item.label === "Next search window")?.value, "March 2027 / September 2027");
  assert.equal(portfolio.hiring.facts.find((item) => item.label === "Current anchor")?.value, "Danone Innovation & Productivity PM Intern");
  assert.match(portfolio.background.lines.join(" "), /expected April 2027/);
  assert.equal(Boolean(portfolio.interests), false);
  assert.match(portfolio.lensClosing, /Traveling across India/);
  assert.doesNotMatch(indexHtml, /Site last touched/);
  assert.doesNotMatch(pageTsx, /Site last touched/);

  for (const file of [indexHtml, pageTsx, dossierJs, portfolioJson]) {
    assert.doesNotMatch(file, /consumer truth/i);
    assert.doesNotMatch(file, /consumer insight product strategy brand meaning PMM framing editorial systems/i);
    assert.doesNotMatch(file, /PMM framing|emotional moats|insight synthesis/);
    assert.doesNotMatch(file, /#interests|Interests archive coming soon/);
    assert.doesNotMatch(file, /case-baja/i);
    assert.doesNotMatch(file, /evidenceStrength|signal-strength/);
    assert.doesNotMatch(file, /Route:|Proof:|State:/);
    assert.doesNotMatch(file, /siara/i);
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
  await access(new URL("../observations-site/rugved-naik-cv.pdf", import.meta.url));
  await access(new URL("../observations-site/rugved-naik-dossier.pdf", import.meta.url));
});

test("public portfolio copy avoids em and en dashes", async () => {
  const publicFiles = [
    "../observations-site/index.html",
    "../observations-site/le-dossier.css",
    "../observations-site/le-dossier.js",
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
    "../observations-site/case-electric-mobility.html",
    "../observations-site/case-withings.html",
    "../observations-site/case-amazon-conversion.html",
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

test("Danone dossier discloses independent public analysis", async () => {
  const html = await readFile(
    new URL("../observations-site/case-danone-claim-saturation.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /This independent analysis was conducted before and outside my Danone Innovation & Productivity PM internship/);
  assert.match(html, /unrelated to internal Danone work/);
});
