import Link from "next/link";
import portfolioData from "../observations-site/data/portfolio.json";

const cases = portfolioData.cases;
const defaultCase =
  cases.find((item) => item.id === portfolioData.switchboard.defaultCaseId) ?? cases[0]!;

const method = [
  ["Observe", "Find the behavior, ritual, review pattern, search language, claim, or moment of choice."],
  ["Separate", "Use the quote and evidence to separate useful signals from category noise and polished claims."],
  ["Name", "Turn the pattern into a sentence a team can remember and challenge."],
  ["Translate", "Move from signal to product logic, positioning, CRM, or experience design."],
  ["Make it travel", "Build the dossier, framework, or phrase that lets the work keep moving."],
];

function projectLine(item: (typeof cases)[number]) {
  return item.project || item.company || item.caseTitle;
}

function classificationLine(item: (typeof cases)[number]) {
  const capabilities = item.capabilities.length ? item.capabilities.join(" / ") : "Strategy";
  return `${capabilities}${item.readingTime ? ` / ${item.readingTime}` : ""}`;
}

function dossierStatus(item: (typeof cases)[number]) {
  return item.caseLink ? "Dossier open" : "Dossier in progress";
}

export default function Home() {
  return (
    <main className="consumer-app-page consumer-app-signal-archive">
      <header className="consumer-app-header">
        <Link href="/" className="consumer-app-wordmark">
          Rugved Naik
        </Link>
        <div>
          <span>The Consumer Read</span>
          <span>Paris / ESCP</span>
        </div>
        <nav aria-label="Primary navigation">
          <a href="#fit">Fit</a>
          <a href="#lens">Lens</a>
          <a href="#signals">Signals</a>
          <a href="#notes">Notes</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="consumer-app-hero consumer-app-signal-hero">
        <div>
          <p className="consumer-app-eyebrow">{portfolioData.hero.eyebrow}</p>
          <p className="consumer-app-thesis">{portfolioData.switchboard.thesis}</p>
          <h1>{portfolioData.hero.title}</h1>
          <p>{portfolioData.hero.lens}</p>
          <p className="consumer-app-proof">{portfolioData.hero.proofLine}</p>
          <div className="consumer-app-actions">
            <a href="#signals">{portfolioData.hero.primaryCta}</a>
            <a href="mailto:rugved.naik@edu.escp.eu">{portfolioData.hero.secondaryCta}</a>
          </div>
        </div>

        <aside className="consumer-app-how">
          <p className="consumer-app-eyebrow">How it works</p>
          <p>
            The work starts with what someone says, wants, avoids, or repeats. Open a
            signal to see how evidence becomes a system.
          </p>
          <p className="consumer-app-status-line">{portfolioData.switchboard.statusLine}</p>
        </aside>
      </section>

      <section className="consumer-app-point" id="fit">
        <p className="consumer-app-eyebrow">Point of view</p>
        <h2>Consumer centric is not soft. It is operational.</h2>
        <div>
          <p>
            A product decision asks what someone is trying to get done, signal, avoid, or
            become. A marketing decision asks what they should remember after the touchpoint
            disappears.
          </p>
          <p>
            The case matters, but the consumer signal comes first. The company appears only
            after the behavior has been read and translated into a usable system.
          </p>
          <p>
            For a PM, that means fewer features guessed at and more features earned from
            evidence. For a PMM, that means positioning that is remembered instead of
            positioning that is merely accurate.
          </p>
        </div>
      </section>

      <section className="consumer-app-notes" id="lens">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">What I read</p>
          <h2>A lens before the signals.</h2>
        </div>
        <div className="consumer-app-lens-grid">
          {portfolioData.lenses.map((lens, index) => (
            <article key={lens.id}>
              <span>{String(index + 1).padStart(2, "0")} / {lens.label}</span>
              <p>{lens.text}</p>
            </article>
          ))}
        </div>
        <p className="consumer-app-lens-closing">{portfolioData.lensClosing}</p>
      </section>

      <section className="consumer-app-background" id="background">
        <p className="consumer-app-eyebrow">{portfolioData.background.eyebrow}</p>
        <h2>{portfolioData.background.title}</h2>
        <div>
          {portfolioData.background.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="consumer-app-experience" id="experience">
        <div>
          <p className="consumer-app-eyebrow">{portfolioData.experience.eyebrow}</p>
          <h2>{portfolioData.experience.title}</h2>
          <p className="consumer-app-experience-meta">{portfolioData.experience.meta}</p>
        </div>
        <div>
          <p>{portfolioData.experience.intro}</p>
          <ul>
            {portfolioData.experience.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p>{portfolioData.experience.closing}</p>
          <a href={portfolioData.experience.link}>{portfolioData.experience.linkLabel}</a>
        </div>
      </section>

      <section className="consumer-app-work" id="signals">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Signals</p>
          <h2>{cases.length} consumer signals, filed as evidence.</h2>
          <p>{portfolioData.switchboard.instruction}</p>
        </div>

        <div className="consumer-app-signal-list">
          {cases.map((item, index) => (
            <details
              className="consumer-app-signal-entry"
              key={item.id}
              open={item.id === defaultCase.id}
            >
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="consumer-app-signal-main">
                  <blockquote>{item.signalQuote}</blockquote>
                  <em>{item.category}</em>
                </div>
                <small className={item.routeStatus === "routed" ? "is-routed" : ""}>
                  {item.routeStatus}
                </small>
              </summary>
              <div className="consumer-app-connector" aria-hidden="true" />
              <div className="consumer-app-signal-content">
                <div>
                  <span>Translation</span>
                  <p>{item.signal.translation}</p>
                </div>
                <div className="consumer-app-signal-implications">
                  <div>
                    <span>Product implication</span>
                    <p>{item.signal.productImplication}</p>
                  </div>
                  <div>
                    <span>GTM implication</span>
                    <p>{item.signal.gtmImplication}</p>
                  </div>
                </div>
                {item.archiveNote ? (
                  <p className="consumer-app-archive-note">{item.archiveNote}</p>
                ) : null}
                <p className="consumer-app-evidence-hint">
                  <span>Evidence:</span> {item.signal.evidence}
                </p>
                <details className="consumer-app-evidence-details">
                  <summary>See tension and status</summary>
                  <div>
                    <span>Tension</span>
                    <p>{item.signal.tension}</p>
                  </div>
                  <p className="consumer-app-meta-tags">
                    <span>{item.routeStatus}</span>
                    <span>{item.validation}</span>
                    <span>{dossierStatus(item)}</span>
                  </p>
                  <small className="consumer-app-meta-date">Updated {item.lastUpdatedLabel}</small>
                </details>
                <p className="consumer-app-classification">
                  <span>Capability:</span> {classificationLine(item)}
                </p>
                <div className="consumer-app-project-line">
                  <span>Project</span>
                  <p>{projectLine(item)}</p>
                  {item.caseLink ? <a href={item.caseLink}>Open dossier</a> : <small>Dossier in progress</small>}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="consumer-app-notes" id="notes">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Notes</p>
          <h2>Observations before they become full systems.</h2>
        </div>
        <div className="consumer-app-unrouted-grid">
          {portfolioData.unroutedSignals.map((note) => (
            <article key={`${note.date}-${note.signal}`}>
              <span>{note.date}</span>
              <blockquote>{note.signal}</blockquote>
              <p>{note.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consumer-app-method" id="method">
        <p className="consumer-app-eyebrow">Method</p>
        <h2>The method maps to the archive.</h2>
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

      <section className="consumer-app-help">
        <div>
          <p className="consumer-app-eyebrow">Where I fit</p>
          <h2>For teams that need sharper consumer understanding before product or marketing decisions.</h2>
        </div>
        <div className="consumer-app-help-grid">
          <article><span>Product</span><p>Turning evidence into roadmap priorities and feature tradeoffs, not just feature requests.</p></article>
          <article><span>Marketing</span><p>Positioning and launch narratives built to be remembered, not just accurate.</p></article>
          <article><span>Brand</span><p>Protect what people should remember when channels and messages change.</p></article>
          <article><span>Research</span><p>Separate useful signals from category noise, claims, and performance dashboards.</p></article>
        </div>
      </section>

      <section className="consumer-app-contact" id="contact">
        <div>
          <p className="consumer-app-eyebrow">Contact</p>
          <h2>If consumer understanding needs to shape the decision, send me the problem.</h2>
          <p>
            Looking for PM, PMM, and consumer-strategy roles where evidence should shape
            the roadmap or the launch.
          </p>
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
        </aside>
      </section>
    </main>
  );
}
