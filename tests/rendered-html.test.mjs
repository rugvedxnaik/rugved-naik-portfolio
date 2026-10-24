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
  assert.match(indexHtml, /Convention de stage ESCP obligatoire\. Durée recherchée: 6 mois\./);
  assert.match(indexHtml, /Danone · EU Dairy Innovation &amp; Productivity/);
  assert.match(indexHtml, /Project Management Intern/);
  assert.match(indexHtml, /Sep 2026 - Fév 2027/);
  assert.match(indexHtml, /Prepared data-quality reviews and Power BI portfolio views to support governance decisions/);
  assert.match(indexHtml, /Brought R&amp;D, Marketing, Supply, Quality and Regulatory inputs into decision forums/);
  assert.match(indexHtml, /Compétences/);
  assert.match(indexHtml, /Excel, Power BI, SQL/);
  assert.match(indexHtml, /Amazon Seller Central \/ Ads/);
  assert.match(indexHtml, /English C1, French A2 improving/);
  assert.match(indexHtml, /Day-to-day working language: English/);
  assert.match(indexHtml, /4 700\+/);
  assert.match(indexHtml, /EUR 68K/);
  assert.match(indexHtml, /-18%/);
  assert.match(indexHtml, /12 ans/);
  assert.match(indexHtml, /Mission principale: Peora/);
  assert.doesNotMatch(indexHtml, /Brand & Ecommerce Growth Consultant, self-employed/);
  assert.match(indexHtml, /L'Oréal Brandstorm 2026/);
  assert.match(indexHtml, /Consumer-Centric Marketing specialization/);
  assert.match(indexHtml, /Google Project Management 2026/);
  assert.match(indexHtml, /Ouvert aux stages produit, marketing et stratégie consommateur à partir de mars 2027\./);
  assert.match(indexHtml, /Open to product, marketing and consumer-strategy internships from March 2027\./);
  assert.match(indexHtml, /mailto:rugved\.naik@edu\.escp\.eu\?subject=Stage%20PM%2FPMM%2FPMO%2FConsumer%20Strategy%20-%20mars%202027/);
  assert.match(indexHtml, /I turn consumer behavior into product and marketing decisions/);
  assert.match(indexHtml, /Je transforme les comportements consommateurs en décisions produit et marketing/);
  assert.match(indexHtml, /Before a team decides what to build or say/);
  assert.match(indexHtml, /Avant qu'une équipe décide quoi construire ou dire/);
  assert.equal(
    (indexHtml.match(/Before a team decides what to build or say/g) ?? []).length,
    1,
    "the consumer principle should be memorable without being repeated",
  );
  assert.match(indexHtml, /Marketing produit · Études consommateurs · Gestion de projets innovation/);
  assert.match(indexHtml, /Product Marketing · Consumer Insights · Innovation and Digital Marketing Project Management/);
  assert.match(indexHtml, /Ouvrir le dossier principal/);
  assert.match(indexHtml, /Open the flagship case/);
  assert.match(indexHtml, /case-miutine\.html/);
  assert.match(indexHtml, /category-bridge/);
  assert.match(indexHtml, /FMCG execution and governance/);
  assert.match(indexHtml, /digital commercial execution/);
  const heroCtaIndex = indexHtml.indexOf("Ouvert aux stages produit");
  const heroFactsIndex = indexHtml.indexOf('aria-label="Quick facts"');
  const heroQuoteIndex = indexHtml.indexOf('aria-label="Consumer principle"');
  assert.ok(heroCtaIndex > -1 && heroFactsIndex > heroCtaIndex, "hero facts should sit directly after the CTA");
  assert.ok(heroQuoteIndex > heroFactsIndex, "consumer quote should follow the practical facts");
  assert.match(indexHtml, /Engineering taught me to break down systems/);
  assert.match(indexHtml, /Actively open to March 2027 opportunities/);
  assert.doesNotMatch(indexHtml, /Dossier format: scan, open useful proof, contact/);
  assert.match(indexHtml, /assets\/rugved-naik-headshot\.jpg/);
  assert.match(indexHtml, /On the reading shelf/);
  assert.match(indexHtml, /The Social Life of Things/);
  assert.match(indexHtml, /Thinking in Systems/);
  assert.doesNotMatch(indexHtml, /assets\/dossiers\/freelance-ctr-lift\.svg/);
  assert.doesNotMatch(indexHtml, /Indexed CTR: \+25% after structured creative testing/);
  assert.match(indexHtml, /Method flow/);
  assert.match(indexHtml, /Selected evidence/);
  assert.doesNotMatch(indexHtml, /If you only open one dossier/);
  assert.match(indexHtml, /Projets réels/);
  assert.match(indexHtml, /Real projects/);
  assert.match(indexHtml, /Exercices de réflexion/);
  assert.match(indexHtml, /Thinking exercises/);
  assert.match(indexHtml, /One method, shown through Miutine/);
  assert.match(indexHtml, /Reviews overrepresent purchase, unboxing and early ownership/);
  assert.match(pageTsx, /Une méthode, montrée sur Miutine/);
  assert.match(indexHtml, /Freelance client work/);
  assert.match(indexHtml, /Founder venture/);
  assert.match(indexHtml, /Academic project/);
  assert.match(indexHtml, /Case competition/);
  assert.match(indexHtml, /independent tests of a method designed to transfer across categories/i);
  assert.match(indexHtml, /Testing Premium Value Through Marketplace Evidence/);
  assert.match(indexHtml, /Category-agnostic method test/);
  assert.equal((indexHtml.match(/class="tag-kind tag-kind-independent">Independent analysis/g) ?? []).length, 2);
  assert.doesNotMatch(indexHtml, /Start here \/ Applied in role|Start here \/ Market reading|Start here \/ India luxury read|Start here \/ Competition validated/i);
  assert.match(indexHtml, /I usually reply within 24-48 hours/);
  assert.match(indexHtml, /Send a few lines about the role, team or question/);
  assert.match(indexHtml, /I am looking for a team where product decisions start from evidence/);
  assert.match(indexHtml, /Helpful context/);
  assert.match(indexHtml, /Every dossier starts with the same question/);
  assert.doesNotMatch(indexHtml, /if the fit is clear|send me the problem/i);
  assert.match(indexHtml, /application\/ld\+json/);
  assert.match(indexHtml, /"knowsLanguage": \["English C1", "French A2", "Hindi", "Marathi"\]/);
  assert.equal((indexHtml.match(/lead-dossier/g) ?? []).length, 1);
  assert.equal((pageTsx.match(/lead: true/g) ?? []).length, 1);
  assert.match(indexHtml, /Recommended start/);
  assert.doesNotMatch(indexHtml, /Real quote pending|Citation réelle à ajouter|Reference<\/span>/);
  assert.match(indexHtml, /References available on request\./);
  assert.match(indexHtml, /Captain and Head of Engineering Design/);
  assert.match(indexHtml, /case-baja\.html/);
  assert.match(indexHtml, /Ranked 15th overall at BAJA SAEINDIA 2023 and 4th overall at ATVC 2023/);
  assert.match(indexHtml, /INR 1\.75M budget, approximately EUR 19K at 2023 rates, and INR 0\.8M in sponsorships/);
  assert.equal((indexHtml.match(/class="work-dossier(?: [^"]+)?"/g) ?? []).length, 8);
  assert.doesNotMatch(indexHtml, /href="case-(?:danone-claim-saturation|lvmh-shared-infrastructure|box-is-the-proof)\.html"/);
  assert.match(indexHtml, /href="case-withings\.html"/);
  assert.match(indexHtml, /case-electric-mobility\.html/);
  assert.match(indexHtml, /Au-delà des dossiers/);
  assert.match(indexHtml, /Beyond the dossiers/);
  assert.match(indexHtml, /100\+ cities across India/);
  assert.match(indexHtml, /Mallakhamb athlete for 12 years, then 5 years as a competitive coach/);
  assert.match(indexHtml, /previous reader's notes and scribbles/);
  assert.match(indexHtml, /Timeline and working language/);
  assert.match(indexHtml, /Personal site\. No analytics or cookies\./);
  assert.doesNotMatch(indexHtml, />Loading<|Loading the|data-signal-list|data-active-signal-card|sound-toggle|Switchboard/i);
  assert.match(pageTsx, /Le Dossier/);
  assert.match(pageTsx, /Download CV PDF/);
  assert.match(pageTsx, /Download dossier PDF/);
  assert.match(dossierJs, /setTab/);
  assert.match(dossierJs, /setLanguage/);
  assert.equal(portfolio.cases.length, 15);
  assert.equal(portfolio.hiring.facts.find((item) => item.label === "Next search window")?.value, "March 2027 / September 2027");
  assert.equal(portfolio.hiring.facts.find((item) => item.label === "Current anchor")?.value, "Danone EU Dairy Innovation & Productivity Project Management Intern");
  assert.match(portfolio.background.lines.join(" "), /expected April 2028/);
  assert.equal(Boolean(portfolio.interests), false);
  assert.match(portfolio.lensClosing, /Traveled to 100\+ cities across India/);
  assert.match(portfolio.lensClosing, /National-level Mallakhamb athlete for 12 years/);
  assert.match(portfolio.lensClosing, /previous reader's notes and scribbles/);
  assert.doesNotMatch(indexHtml, /Site last touched/);
  assert.doesNotMatch(pageTsx, /Site last touched/);

  for (const file of [indexHtml, pageTsx, dossierJs, portfolioJson]) {
    assert.doesNotMatch(file, /consumer truth/i);
    assert.doesNotMatch(file, /consumer insight product strategy brand meaning PMM framing editorial systems/i);
    assert.doesNotMatch(file, /PMM framing|emotional moats|insight synthesis/);
    assert.doesNotMatch(file, /#interests|Interests archive coming soon/);
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

  await access(new URL("../observations-site/case-baja.html", import.meta.url));
  await access(new URL("../observations-site/rugved-naik-cv.pdf", import.meta.url));
  await access(new URL("../observations-site/rugved-naik-dossier.pdf", import.meta.url));
  await access(new URL("../observations-site/assets/rugved-naik-headshot.jpg", import.meta.url));
  await access(new URL("../public/assets/rugved-naik-headshot.jpg", import.meta.url));
  await assert.rejects(access(new URL("../observations-site/assets/dossiers/freelance-ctr-lift.svg", import.meta.url)));
  await assert.rejects(access(new URL("../public/assets/dossiers/freelance-ctr-lift.svg", import.meta.url)));
});

test("flagship cases expose dated evidence and leadership outcomes", async () => {
  const [miutine, baja, givenchy] = await Promise.all([
    readFile(new URL("../observations-site/case-miutine.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-baja.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-givenchy.html", import.meta.url), "utf8"),
  ]);

  assert.match(miutine, /completed March 2026/);
  assert.match(miutine, /4,700\+ ratings and reviews/);
  assert.match(miutine, /Miutine Intense/);
  assert.match(miutine, /subsequent brand activity, not as proof of causality or influence/);
  assert.match(miutine, /possessions and the extended self/i);
  assert.match(miutine, /social life and circulation of things/i);
  assert.match(miutine, /miumiu\.com\/ww\/en\/p\/miu-miu-miutine-intense/);
  assert.match(miutine, /miumiu\.com\/fr\/fr\/p\/miu-miu-fleur-de-lait/);
  assert.match(miutine, /Composite signal synthesized from recurring review and social-listening language/);
  assert.match(miutine, /The archived source did not preserve a publishable platform split/);
  assert.match(baja, /Captain and Head of Engineering Design/);
  assert.match(baja, /five-person engineering group into a 25-person agile vehicle organization/);
  assert.match(baja, /INR 1\.75M budget/);
  assert.match(baja, /Team Abhedya ranked 15th overall at BAJA SAEINDIA 2023 and 4th overall at ATVC 2023/);
  assert.match(baja, /team ID 23060/);
  assert.match(baja, /property="og:url"/);
  assert.match(baja, /name="twitter:card"/);
  assert.doesNotMatch(baja, /Oregon|Top 10/i);
  assert.match(givenchy, /Gen Z beauty venture built from Givenchy's couture heritage/);
});

test("flagship proof is inspectable and uses real project artifacts", async () => {
  const [indexHtml, miutine, baja, givenchy, styles] = await Promise.all([
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-miutine.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-baja.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-givenchy.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/styles.css", import.meta.url), "utf8"),
  ]);

  assert.match(indexHtml, /Selected evidence/);
  assert.match(indexHtml, /case-miutine\.html#evidence-trail/);
  assert.match(indexHtml, /case-baja\.html#delivery-record/);
  assert.match(indexHtml, /case-givenchy\.html#developed-artifact/);
  assert.match(miutine, /id="evidence-trail"/);
  assert.match(miutine, /Directional, not a population estimate/);
  assert.match(baja, /id="delivery-record"/);
  assert.match(baja, /9 months compressed to 4/);
  assert.match(givenchy, /id="developed-artifact"/);
  assert.match(givenchy, /assets\/givenchy\/slide-01\.webp/);
  assert.match(givenchy, /assets\/givenchy\/slide-05\.webp/);
  assert.match(givenchy, /assets\/givenchy\/slide-07\.webp/);
  assert.match(givenchy, /assets\/givenchy\/slide-10\.webp/);
  assert.match(styles, /\.artifact-gallery/);

  await Promise.all([
    "slide-01.webp",
    "slide-05.webp",
    "slide-07.webp",
    "slide-10.webp",
  ].map((name) => access(new URL(`../observations-site/assets/givenchy/${name}`, import.meta.url))));
});

test("desktop dossier grids prevent orphan cards and contact overflow", async () => {
  const [indexHtml, css] = await Promise.all([
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/le-dossier.css", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.cover-copy \.cover-meta \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.cover-copy \.cover-meta strong \{[\s\S]*?overflow-wrap: anywhere/);
  assert.match(css, /\.profile-cards \{[\s\S]*?grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.profile-cards > article:nth-child\(3\)[\s\S]*?grid-column: span 2/);
  assert.match(css, /\.category-bridge p \{[\s\S]*?font-family: var\(--sans\);[\s\S]*?letter-spacing: 0;/);
  assert.match(css, /\.category-bridge p > \.lang-fr,[\s\S]*?\.category-bridge p > \.lang-en \{[\s\S]*?font-family: inherit;/);
  assert.match(indexHtml, /<span class="lang-en" lang="en">Availability<\/span>/);
  assert.match(indexHtml, /<span class="lang-en" lang="en">Experience<\/span>/);
  assert.match(indexHtml, /<span class="lang-fr" lang="fr">/);
});

test("role cards use stable library icons instead of CSS-drawn symbols", async () => {
  const [indexHtml, css] = await Promise.all([
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/le-dossier.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(indexHtml, /cdn\.jsdelivr\.net|bootstrap-icons@/);
  assert.match(indexHtml, /<span class="role-icon" aria-hidden="true">[\s\S]*?<svg viewBox="0 0 16 16"/);
  assert.doesNotMatch(css, /\.role-icon--(?:pm|pmm|pmo)/);
  assert.doesNotMatch(css, /\.role-icon(?:::before|::after)/);
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
    "../observations-site/case-baja.html",
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
    "The signal|Operating hypothesis|Strategic proposition",
    "Output|Operating response",
    "What it shows|Measurement boundary|Competition verification|Evidence boundary and transferability|Decision contribution|Consumer problem and evidence boundary|Current evidence boundary",
  ];

  for (const file of dossierFiles) {
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(html, /<h1>[^<]+<\/h1>/, file);
    assert.match(html, /<h3>[^<]+<\/h3>/, file);
    assert.match(html, /class="dossier-status"><em>[^<]+<\/em>/, file);
    assert.match(html, /class="dossier-signal-quote"/, file);
    assert.match(html, /<strong>(?:Product implication|Commercial monitoring)/, file);
    assert.match(html, /<strong>(?:GTM implication|Advertising decision)/, file);
    for (const section of expectedSections) {
      assert.match(html, new RegExp(section), `${file} ${section}`);
    }
  }
});

test("dossier pages expose PM snapshots and validation plans", async () => {
  const realProjectFiles = [
    "../observations-site/case-peora-availability-ranking.html",
    "../observations-site/case-amazon-conversion.html",
    "../observations-site/case-electric-mobility.html",
    "../observations-site/case-miutine.html",
    "../observations-site/case-givenchy.html",
  ];

  const thinkingFiles = [
    "../observations-site/case-danone-claim-saturation.html",
    "../observations-site/case-loreal-ai-personalization.html",
    "../observations-site/case-lvmh-shared-infrastructure.html",
    "../observations-site/case-box-is-the-proof.html",
    "../observations-site/case-withings.html",
  ];

  let pmSnapshotCount = 0;
  for (const file of realProjectFiles) {
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(html, /aria-label="PM snapshot"/, file);
    assert.match(html, /<span>Role<\/span>/, file);
    assert.match(html, /<span>Problem<\/span>/, file);
    assert.match(html, /<span>(?:Evidence|Strategic inputs)<\/span>/, file);
    assert.match(html, /<span>Decision<\/span>/, file);
    assert.match(html, /<span>Artifact<\/span>/, file);
    assert.match(html, /<span>(?:Outcome|Result|Operational change|Measurement boundary)<\/span>/, file);
    pmSnapshotCount += (html.match(/aria-label="PM snapshot"/g) ?? []).length;
  }

  let validationPlanCount = 0;
  for (const file of thinkingFiles) {
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(html, /aria-label="Validation plan"/, file);
    assert.match(html, /<span>Question<\/span>/, file);
    assert.match(html, /<span>Evidence<\/span>/, file);
    assert.match(html, /<span>Next validation<\/span>/, file);
    assert.match(html, /<span>Decision test<\/span>/, file);
    validationPlanCount += (html.match(/aria-label="Validation plan"/g) ?? []).length;
  }

  assert.equal(pmSnapshotCount, 5);
  assert.equal(validationPlanCount, 5);
});

test("generated proof visuals are removed until real artifacts are available", async () => {
  const [peoraHtml, miutineHtml] = await Promise.all([
    readFile(new URL("../observations-site/case-peora-availability-ranking.html", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/case-miutine.html", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(peoraHtml, /peora-stockout-rank-pattern\.svg/);
  assert.doesNotMatch(peoraHtml, /Anonymized dashboard pattern/);
  assert.doesNotMatch(miutineHtml, /miutine-identity-object-quadrant\.svg/);
  assert.doesNotMatch(miutineHtml, /Framework visual/);
  assert.doesNotMatch(peoraHtml, /confidential figures exposed/i);
  assert.doesNotMatch(miutineHtml, /confidential figures exposed/i);

  await assert.rejects(access(new URL("../observations-site/assets/dossiers/miutine-identity-object-quadrant.svg", import.meta.url)));
});

test("Danone dossier discloses independent public analysis", async () => {
  const html = await readFile(
    new URL("../observations-site/case-danone-claim-saturation.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /This independent analysis was conducted before and outside my Danone EU Dairy Innovation & Productivity Project Management internship/);
  assert.match(html, /unrelated to internal Danone work/);
  assert.match(html, /Archived independent analysis/);
});

test("indexed dossiers use honest labels, evidence boundaries and index-only navigation", async () => {
  const files = [
    "case-miutine.html",
    "case-baja.html",
    "case-peora-availability-ranking.html",
    "case-givenchy.html",
    "case-amazon-conversion.html",
    "case-electric-mobility.html",
    "case-withings.html",
    "case-loreal-ai-personalization.html",
  ];
  const pages = await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../observations-site/${file}`, import.meta.url), "utf8")]));

  for (const [file, html] of pages) {
    assert.match(html, /class="case-fr-summary"/, file);
    assert.doesNotMatch(html, /case-(?:19h03|recognition-index|danone-claim-saturation|lvmh-shared-infrastructure|box-is-the-proof)\.html/, file);
  }

  const byName = Object.fromEntries(pages);
  assert.match(byName["case-peora-availability-ranking.html"], /Freelance client work/);
  assert.match(byName["case-peora-availability-ranking.html"], /did not isolate[\s\S]*ranking algorithm/);
  assert.match(byName["case-peora-availability-ranking.html"], /Managed Amazon advertising and e-commerce performance/);
  assert.match(byName["case-peora-availability-ranking.html"], /Strategic paraphrase/);
  assert.doesNotMatch(byName["case-peora-availability-ranking.html"], /actionable, and wrong/);
  assert.match(byName["case-amazon-conversion.html"], /listing-level conversion lift was not isolated/);
  assert.match(byName["case-electric-mobility.html"], /10\.4273\/ijvss\.16\.1\.08/);
  assert.match(byName["case-givenchy.html"], /Twenty teams and 50 ESCP students participated/);
  assert.match(byName["case-givenchy.html"], /LVMH Fragrance Brands' public post/);
  assert.match(byName["case-givenchy.html"], /No primary Gen Z consumer study was conducted/);
  assert.match(byName["case-givenchy.html"], /Concept developed after the competition/);
  assert.doesNotMatch(byName["case-givenchy.html"], /id="submitted-artifact"/);
});

test("retired dossiers are noindexed and clearly archived", async () => {
  const files = [
    "case-19h03.html",
    "case-recognition-index.html",
    "case-danone-claim-saturation.html",
    "case-lvmh-shared-infrastructure.html",
    "case-box-is-the-proof.html",
  ];
  for (const file of files) {
    const html = await readFile(new URL(`../observations-site/${file}`, import.meta.url), "utf8");
    assert.match(html, /<meta name="robots" content="noindex, follow" \/>/, file);
    assert.match(html, /Archived/i, file);
    assert.doesNotMatch(html, /index\.html#signals/, file);
  }
});

test("canonical fact sheet protects high-risk public claims", async () => {
  const [factsJson, indexHtml, dossierGenerator] = await Promise.all([
    readFile(new URL("../observations-site/data/fact-sheet.json", import.meta.url), "utf8"),
    readFile(new URL("../observations-site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-dossier-pdf.py", import.meta.url), "utf8"),
  ]);
  const facts = JSON.parse(factsJson);
  assert.ok(indexHtml.includes(facts.currentRole.title.replace("&", "&amp;")));
  assert.match(indexHtml, /primary account of around EUR 68K per month spanning India, the US and Canada/);
  assert.match(indexHtml, /INR 1\.75M budget, approximately EUR 19K at 2023 rates/);
  assert.match(dossierGenerator, /EU Dairy Innovation & Productivity Project Management Intern/);
  assert.match(dossierGenerator, /Target duration: 6 months/);
});
