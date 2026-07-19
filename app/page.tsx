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
      "A brand memory architecture for deciding what AI should personalize and what beauty brands must keep stable.",
  },
];

const reads = [
  {
    number: "01",
    title: "Collectibility Over Loyalty",
    field: "Market reading / fragrance benchmark",
    label: "Evidence",
    note: "4,700+ reviews revealed strong object value and weaker identity attachment.",
  },
  {
    number: "02",
    title: "Face Architecture",
    field: "Luxury beauty / brand territory",
    label: "Move",
    note: "Makeup became identity construction, not surface decoration.",
  },
  {
    number: "03",
    title: "Claim Saturation",
    field: "Danone / category insight",
    label: "Question",
    note: "When everyone has the same insight, which signals still matter?",
  },
  {
    number: "04",
    title: "What AI Can't Personalize",
    field: "L'Oréal / beauty CRM and brand memory",
    label: "Rule",
    note: "Personalize utility. Protect memory.",
  },
  {
    number: "05",
    title: "Shared Infrastructure, House-Specific Expression",
    field: "LVMH / portfolio CRM strategy",
    label: "Tension",
    note: "Scale the intelligence without flattening the house.",
  },
  {
    number: "06",
    title: "19h03",
    field: "Product concept / ritual design",
    label: "Ritual",
    note: "People use the first drink to mark a change of state.",
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
            I turn consumer behavior into product logic, brand memory, and marketing
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
            Finished dossiers open as evidence. Active inquiries show where the thinking is
            going next, so new Danone, L&apos;Oréal, LVMH, beauty, food, and retail work can keep
            joining the same system.
          </p>
        </div>
        <div className="consumer-app-read-grid">
          {reads.map((read) => (
            <article key={read.title}>
              <span>Read {read.number}</span>
              <h3>{read.title}</h3>
              <small>{read.field}</small>
              <b>{read.label}</b>
              <p>{read.note}</p>
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
            Based in Paris, studying at ESCP. Interested in consumer insight, product
            strategy, brand marketing, CRM, category strategy, and product storytelling.
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
