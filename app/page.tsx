import Link from "next/link";
import type { CSSProperties } from "react";
import portfolioData from "../observations-site/data/portfolio.json";

const cases = portfolioData.cases;
const proofRows = cases.filter((item) => item.isProofSignal);
const reads = cases.filter((item) => item.isHighlight && item.detail);
const archiveCases = cases;
const primaryRead = reads.find((item) => item.dossierKey === "miutine") ?? reads[0]!;

const method = [
  ["Observe", "Find the behavior, ritual, review pattern, search language, claim, or moment of choice."],
  ["Separate", "Distinguish useful evidence from category noise, polished claims, and obvious preferences."],
  ["Name", "Turn the pattern into language a team can remember and challenge."],
  ["Translate", "Move the insight into product logic, positioning, messaging, CRM, or experience design."],
  ["Make it travel", "Build the deck, dossier, framework, or phrase that lets the work keep moving."],
];

function displayTitle(item: (typeof cases)[number]) {
  return item.displayTitle ?? item.title;
}

function signalStrength(item: (typeof cases)[number]) {
  if ("signalWeight" in item && typeof item.signalWeight === "number") return item.signalWeight;
  if (item.status.includes("Finished")) return 82;
  if (item.status.includes("Framework")) return 70;
  if (item.status.includes("Active")) return 64;
  return 56;
}

function signatureRows(item: (typeof reads)[number]) {
  const signature = "signature" in item ? item.signature : null;
  if (!signature) return [];

  return [
    ["Behavior", signature.behavior],
    ["Evidence", signature.evidence],
    ["Tension", signature.tension],
    ["Move", signature.move],
    ["System", signature.system],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
}

export default function Home() {
  return (
    <main className="consumer-app-page">
      <header className="consumer-app-header">
        <Link href="/" className="consumer-app-wordmark">
          Rugved Naik
        </Link>
        <div>
          <span>The Consumer Read</span>
          <span>Paris / ESCP</span>
        </div>
        <nav aria-label="Primary navigation">
          <a href="#notes">Notes</a>
          <a href="#work">Work</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="consumer-app-hero">
        <div>
          <p className="consumer-app-eyebrow">Consumer insight for product and marketing</p>
          <h1>The best strategy makes the consumer feel obvious without making them feel simplified.</h1>
          <p>
            I turn consumer behavior into product logic, recognizable brand cues, and marketing
            systems. The work starts with what people choose, repeat, search, collect,
            imitate, and remember, then turns that reading into decisions teams can use.
          </p>
          <div className="consumer-app-current">
            <span>
              {portfolioData.currentFocus.label} / {portfolioData.currentFocus.date}
            </span>
            <p>{portfolioData.currentFocus.text}</p>
          </div>
          <div className="consumer-app-actions">
            <a href="#work">See the evidence</a>
            <a href="mailto:rugved.naik@edu.escp.eu">Email Rugved</a>
          </div>
        </div>

        <aside className="consumer-app-side" aria-label="Portfolio proof and signal system">
          <div className="consumer-app-signal-console">
            <div className="consumer-app-console-topline">
              <p>Active signal</p>
              <span aria-hidden="true" />
            </div>
            <strong>{displayTitle(primaryRead)}</strong>
            <p>{primaryRead.note}</p>
            <div className="consumer-app-signal-readout">
              {signatureRows(primaryRead)
                .slice(0, 4)
                .map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <p>{value}</p>
                  </div>
                ))}
            </div>
            <div className="consumer-app-signal-bars">
              {reads.map((read, index) => (
                <div
                  key={read.id}
                  style={{ "--signal-strength": `${signalStrength(read)}%` } as CSSProperties}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{displayTitle(read)}</strong>
                  <em>{read.label}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="consumer-app-ledger" aria-label="Portfolio proof">
            <p>Proof signals</p>
            {proofRows.map((row) => (
              <article key={row.id}>
                <span>{row.proofName ?? row.company ?? displayTitle(row)}</span>
                <small>
                  {row.validation} / Updated {row.lastUpdatedLabel}
                </small>
                <p>{row.proof}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="consumer-app-point">
        <p className="consumer-app-eyebrow">Point of view</p>
        <h2>Consumer centric is not soft. It is operational.</h2>
        <div>
          <p>
            A product decision asks what someone is trying to get done, signal, avoid, or
            become. A marketing decision asks what they should remember after the touchpoint
            disappears.
          </p>
          <p>
            I work in the space between the person and the system: the behavior that
            explains the opportunity, the tension that makes the strategy necessary, and the
            structure that lets product, brand, and marketing move together.
          </p>
        </div>
      </section>

      <section className="consumer-app-notes" id="notes">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Field notes</p>
          <h2>Short observations before they become full cases.</h2>
        </div>
        <div className="consumer-app-note-grid">
          {portfolioData.fieldNotes.map((note) => (
            <article key={`${note.date}-${note.title}`}>
              <span>{note.date}</span>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consumer-app-work" id="work">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Case system</p>
          <h2>A signal room for consumer-led product and marketing strategy.</h2>
          <p>
            One data source feeds the proof signals, archive, highlights, field notes, and
            signal logic. The archive is the full system. The expanded reads are selected
            openings into that same system, not a competing index.
          </p>
        </div>
        <div className="consumer-app-depth">
          {portfolioData.statusGroups.map((group) => (
            <article key={group.label}>
              <span>{group.label}</span>
              <p>{group.text}</p>
            </article>
          ))}
        </div>
        <div className="consumer-app-archive" aria-label="Case archive">
          <div className="consumer-app-archive-head">
            <span>Case log</span>
            <strong>{archiveCases.length} cases</strong>
            <p>Category, capability, and target-house structure from the living archive.</p>
          </div>
          <div className="consumer-app-archive-grid">
            {archiveCases.map((archiveCase, index) => (
              <article key={archiveCase.id}>
                <span>Case {String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{archiveCase.category}</small>
                  <h3>{archiveCase.title}</h3>
                  <p>{archiveCase.hook}</p>
                </div>
                <ul>
                  {[archiveCase.company, archiveCase.status, ...archiveCase.capabilities, archiveCase.validation]
                    .filter(Boolean)
                    .map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="consumer-app-section-heading consumer-app-highlight-heading">
          <p className="consumer-app-eyebrow">Signal room</p>
          <p>
            Expanded views from the archive, generated from the same case data and organized
            by behavior, evidence, tension, move, and system.
          </p>
        </div>
        <div className="consumer-app-read-grid">
          {reads.map((read, index) => (
            <article key={read.id}>
              <span>Highlight {String(index + 1).padStart(2, "0")}</span>
              <em>{read.status}</em>
              <h3>{displayTitle(read)}</h3>
              <small>{read.field}</small>
              <b>{read.label}</b>
              <p>{read.note}</p>
              <div className="consumer-app-trace">
                {signatureRows(read)
                  .slice(0, 3)
                  .map(([label, value]) => (
                    <div key={label}>
                      <small>{label}</small>
                      <p>{value}</p>
                    </div>
                  ))}
              </div>
              <p>{read.hoverDetail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consumer-app-method" id="method">
        <p className="consumer-app-eyebrow">Method</p>
        <h2>The work moves from signal to system.</h2>
        <ol>
          {method.map(([title, text], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="consumer-app-contact" id="contact">
        <div>
          <p className="consumer-app-eyebrow">Contact</p>
          <h2>If consumer understanding needs to shape the decision, send me the problem.</h2>
          <p>
            Email me with the role, project, or business question. I can reply with the
            most relevant dossier, a short written take, or a 20-minute call if the fit
            is clear.
          </p>
        </div>
        <aside>
          <blockquote>
            I like problems where the answer is hiding inside the way people already behave.
          </blockquote>
          <a href="mailto:rugved.naik@edu.escp.eu">rugved.naik@edu.escp.eu</a>
          <a href="https://www.linkedin.com/in/rugvednaik" target="_blank" rel="noreferrer">
            LinkedIn / rugvednaik
          </a>
          <p className="consumer-app-updated">
            Site last touched: {portfolioData.site.lastUpdatedLabel}
          </p>
        </aside>
      </section>
    </main>
  );
}
