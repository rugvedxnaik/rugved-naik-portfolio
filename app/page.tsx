import Link from "next/link";
import type { CSSProperties } from "react";
import portfolioData from "../observations-site/data/portfolio.json";

const cases = portfolioData.cases;
const defaultCase =
  cases.find((item) => item.id === portfolioData.switchboard.defaultCaseId) ?? cases[0]!;

const method = [
  ["Observe", "Find the behavior, ritual, review pattern, search language, claim, or moment of choice."],
  ["Separate", "Evidence and tension: separate useful signals from category noise, polished claims, and obvious preferences."],
  ["Name", "Translation: turn the pattern into language a team can remember and challenge."],
  ["Translate", "Output: move the insight into product logic, positioning, messaging, CRM, or experience design."],
  ["Make it travel", "Dossier: build the deck, framework, or phrase that lets the work keep moving."],
];

function projectLine(item: (typeof cases)[number]) {
  return item.project || item.company || item.caseTitle;
}

function validationClass(item: (typeof cases)[number]) {
  return `consumer-app-validation-${item.validationType}`;
}

export default function Home() {
  return (
    <main className="consumer-app-page consumer-app-switchboard">
      <header className="consumer-app-header">
        <Link href="/" className="consumer-app-wordmark">
          Rugved Naik
        </Link>
        <div>
          <span>The Consumer Read</span>
          <span>Paris / ESCP</span>
        </div>
        <nav aria-label="Primary navigation">
          <a href="#lens">Lens</a>
          <a href="#switchboard">Switchboard</a>
          <a href="#unrouted">Unrouted</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="consumer-app-hero consumer-app-switchboard-hero">
        <div>
          <p className="consumer-app-eyebrow">Consumer insight for product and marketing</p>
          <p className="consumer-app-thesis">{portfolioData.switchboard.thesis}</p>
          <h1>The best strategy makes the consumer feel obvious without making them feel simplified.</h1>
          <p>
            I read what people are trying to signal, protect, repeat, or become, then
            translate that behavior into product logic, brand cues, and marketing systems.
          </p>
          <div className="consumer-app-current">
            <span>
              {portfolioData.currentFocus.label} / {portfolioData.currentFocus.date}
            </span>
            <p>{portfolioData.currentFocus.text}</p>
          </div>
          <div className="consumer-app-actions">
            <a href="#switchboard">Route a signal</a>
            <a href="mailto:rugved.naik@edu.escp.eu">Email Rugved</a>
          </div>
        </div>

        <aside className="consumer-app-route-panel" aria-label="Active consumer signal">
          <div className="consumer-app-route-topline">
            <p>Consumer signal</p>
            <span>Sound optional</span>
          </div>
          <blockquote>{defaultCase.signalQuote}</blockquote>
          <div className="consumer-app-route-grid">
            <div>
              <span>Evidence</span>
              <p>{defaultCase.signal.evidence}</p>
            </div>
            <div>
              <span>Tension</span>
              <p>{defaultCase.signal.tension}</p>
            </div>
            <div>
              <span>Translation</span>
              <p>{defaultCase.signal.translation}</p>
            </div>
            <div>
              <span>Project</span>
              <p>{projectLine(defaultCase)}</p>
            </div>
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
            The case matters, but the consumer signal comes first. The company appears only
            after the behavior has been read and routed into a usable system.
          </p>
        </div>
      </section>

      <section className="consumer-app-notes" id="lens">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">What I read</p>
          <h2>A lens before the switchboard.</h2>
        </div>
        <div className="consumer-app-lens-grid">
          {portfolioData.lenses.map((lens, index) => (
            <article key={lens.id}>
              <span>{String(index + 1).padStart(2, "0")} / {lens.label}</span>
              <p>{lens.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consumer-app-work" id="switchboard">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Consumer Switchboard</p>
          <h2>One archive. Ten consumer signals. One routing mechanic.</h2>
          <p>{portfolioData.switchboard.instruction}</p>
        </div>

        <div className="consumer-app-switchboard-console">
          <div className="consumer-app-switchboard-list">
            <div className="consumer-app-switchboard-head">
              <span>Signal list</span>
              <strong>{cases.length}</strong>
            </div>
            {cases.map((item, index) => (
              <article
                key={item.id}
                className={item.id === defaultCase.id ? "is-active" : ""}
                style={{ "--signal-strength": `${item.evidenceStrength}%` } as CSSProperties}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <blockquote>{item.signalQuote}</blockquote>
                <small>{item.routeStatus}</small>
              </article>
            ))}
          </div>

          <div className="consumer-app-switchboard-read">
            <div className="consumer-app-switchboard-head">
              <span>Evidence and tension</span>
              <strong>{defaultCase.routeStatus}</strong>
            </div>
            <div>
              <span>Evidence</span>
              <p>{defaultCase.signal.evidence}</p>
            </div>
            <div>
              <span>Tension</span>
              <p>{defaultCase.signal.tension}</p>
            </div>
            <div className={`consumer-app-validation ${validationClass(defaultCase)}`}>
              <span>{defaultCase.validation}</span>
              <span>{defaultCase.status}</span>
              <span>Updated {defaultCase.lastUpdatedLabel}</span>
              <span>{defaultCase.evidenceStrength}% evidence</span>
            </div>
          </div>

          <div className="consumer-app-switchboard-output">
            <div className="consumer-app-switchboard-head">
              <span>Translation and output</span>
              <strong>{defaultCase.evidenceStrength}%</strong>
            </div>
            <div>
              <span>Translation</span>
              <p>{defaultCase.signal.translation}</p>
            </div>
            <div>
              <span>Output</span>
              <p>{defaultCase.signal.output}</p>
            </div>
            <div className="consumer-app-project-line">
              <span>Project</span>
              <p>{projectLine(defaultCase)}</p>
            </div>
            {defaultCase.caseLink ? <a href={defaultCase.caseLink}>Open dossier</a> : null}
          </div>
        </div>
      </section>

      <section className="consumer-app-notes" id="unrouted">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Unrouted signals</p>
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
        <h2>The method maps to the switchboard.</h2>
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
