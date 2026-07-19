import Link from "next/link";

const proofRows = [
  {
    name: "Miutine",
    status: "Evidence-backed case",
    detail:
      "4,700+ reviews, competitive benchmarking, and social listening shaped an Identity Value x Object Value framework.",
  },
  {
    name: "Givenchy Beauty",
    status: "Presented concept sprint",
    detail:
      "Couture construction became a face architecture territory for product, service, ritual, and seasonal expression.",
  },
  {
    name: "Danone",
    status: "Active inquiry",
    detail:
      "A claim saturation lens for dairy and nutrition categories where protein, probiotics, and better-for-you cues converge.",
  },
  {
    name: "L'Oréal",
    status: "Active inquiry",
    detail:
      "A rule set for what should stay recognizable when AI adapts the beauty journey.",
  },
  {
    name: "LVMH",
    status: "Active inquiry",
    detail:
      "A group-level question about sharing customer intelligence without making every house behave the same.",
  },
];

const reads = [
  {
    number: "01",
    status: "Finished dossier",
    title: "Collectibility Over Loyalty",
    field: "Market reading / fragrance benchmark",
    label: "Evidence",
    note: "4,700+ reviews revealed strong object value and weaker identity attachment.",
    detail:
      "The evidence anchor: review mining, benchmarking, and social listening separate being admired, being collected, and being personally adopted.",
  },
  {
    number: "02",
    status: "Finished dossier",
    title: "Face Architecture",
    field: "Luxury beauty / brand territory",
    label: "Move",
    note: "Makeup became identity construction, not surface decoration.",
    detail:
      "A concept sprint that asked what Givenchy could own in beauty: the construction of the face as a repeatable house logic.",
  },
  {
    number: "03",
    status: "Active inquiry",
    title: "Claim Saturation",
    field: "Danone / category insight",
    label: "Question",
    note: "When everyone has the same insight, which signals still matter?",
    detail:
      "Next proof: category map, claim audit, shelf examples, and evidence on where stated preference diverges from buying behavior.",
  },
  {
    number: "04",
    status: "Active inquiry",
    title: "What AI Can't Personalize",
    field: "L'Oréal / AI and recognizable beauty codes",
    label: "Rule",
    note: "Personalize utility. Protect memory.",
    detail:
      "An inquiry about restraint: what should adapt to the individual, and what brand cues need to stay stable enough to recognize.",
  },
  {
    number: "05",
    status: "Active inquiry",
    title: "Shared Infrastructure, House-Specific Expression",
    field: "LVMH / luxury group customer intelligence",
    label: "Tension",
    note: "Scale the intelligence without flattening the house.",
    detail:
      "Next proof: house code map, service moments, and customer use cases that show where shared data should stop.",
  },
  {
    number: "06",
    status: "Finished concept",
    title: "19h03",
    field: "Product concept / ritual design",
    label: "Ritual",
    note: "People use the first drink to mark a change of state.",
    detail:
      "A finished concept dossier showing how one occasion can organize product benefit, social meaning, visual codes, and brand world.",
  },
];

const method = [
  ["Observe", "Find the behavior, ritual, review pattern, search language, claim, or moment of choice."],
  ["Separate", "Distinguish useful evidence from category noise, polished claims, and obvious preferences."],
  ["Name", "Turn the pattern into language a team can remember and challenge."],
  ["Translate", "Move the insight into product logic, positioning, messaging, CRM, or experience design."],
  ["Make it travel", "Build the deck, dossier, framework, or phrase that lets the work keep moving."],
];

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
          <div className="consumer-app-actions">
            <a href="#work">See the evidence</a>
            <a href="mailto:rugved.naik@edu.escp.eu">Email Rugved</a>
          </div>
        </div>

        <aside className="consumer-app-ledger" aria-label="Portfolio proof">
          <p>Proof signals</p>
          {proofRows.map((row) => (
            <article key={row.name}>
              <span>{row.name}</span>
              <small>{row.status}</small>
              <p>{row.detail}</p>
            </article>
          ))}
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

      <section className="consumer-app-work" id="work">
        <div className="consumer-app-section-heading">
          <p className="consumer-app-eyebrow">Selected reads</p>
          <h2>A living project system for consumer-led product and marketing strategy.</h2>
          <p>
            The portfolio is intentionally split into finished dossiers and active
            inquiries. Finished work opens as evidence. Active inquiries show the next
            problems I am building, with the proof still being assembled.
          </p>
        </div>
        <div className="consumer-app-depth">
          <article>
            <span>Finished dossiers</span>
            <p>
              Miutine, Givenchy, and 19h03 are developed enough to show the strategic move,
              the system, and the output.
            </p>
          </article>
          <article>
            <span>Active inquiries</span>
            <p>
              Danone, L&apos;Oréal, and LVMH stay visible because they show the business
              questions I am currently sharpening.
            </p>
          </article>
        </div>
        <div className="consumer-app-read-grid">
          {reads.map((read) => (
            <article key={read.title}>
              <span>Read {read.number}</span>
              <em>{read.status}</em>
              <h3>{read.title}</h3>
              <small>{read.field}</small>
              <b>{read.label}</b>
              <p>{read.note}</p>
              <p>{read.detail}</p>
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
        </aside>
      </section>
    </main>
  );
}
