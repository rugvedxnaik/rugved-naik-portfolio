import Link from "next/link";
import portfolioData from "../observations-site/data/portfolio.json";

const dossierLinks = [
  {
    label: "Applied in role",
    title: "Availability Is a Ranking Signal",
    text: "Peora, Amazon marketplace growth, stock-outs, rank loss, ad dependency and operating dashboards.",
    href: "case-peora-availability-ranking.html",
  },
  {
    label: "FMCG category",
    title: "Claim Saturation",
    text: "Danone, health claims, proof cues and what makes a familiar category claim believable.",
    href: "case-danone-claim-saturation.html",
  },
  {
    label: "Target house",
    title: "What AI Can't Personalize",
    text: "L'Oréal, adaptive discovery, brand memory and protected cues inside personalization.",
    href: "case-loreal-ai-personalization.html",
  },
  {
    label: "Luxury service",
    title: "Shared Infrastructure, House-Specific Expression",
    text: "LVMH, customer intelligence, house codes and where shared systems should stop.",
    href: "case-lvmh-shared-infrastructure.html",
  },
  {
    label: "Market reading",
    title: "Collectibility Over Loyalty",
    text: "Miutine, 4,700+ reviews, collectibility, identity value and object value.",
    href: "case-miutine.html",
  },
  {
    label: "India luxury read",
    title: "The Box Is the Proof",
    text: "Luxury fragrance in India, saved gifts, social permission and the role of packaging.",
    href: "case-box-is-the-proof.html",
  },
  {
    label: "Product adoption",
    title: "Foldable Electric Mobility Product",
    text: "Urban mobility, adoption conditions, public transport integration and commercialization logic.",
    href: "case-electric-mobility.html",
  },
  {
    label: "PMM category read",
    title: "Withings PMM Category Read",
    text: "Preventive health, connected measurement, premium positioning and category direction.",
    href: "case-withings.html",
  },
];

const method = [
  ["01", "Observer", "Read reviews, routines, searches, constraints and moments of choice."],
  ["02", "Separate", "Separate useful signal from noise, trend and repeated claims."],
  ["03", "Name", "Find a sentence the team can remember, debate and use."],
  ["04", "Translate", "Turn the signal into product, positioning, CRM or content logic."],
  ["05", "Make it usable", "Create a dossier, rule or framework that helps the next decision."],
];

const tabs = [
  ["01", "Profil", "#profil"],
  ["02", "Disponibilité", "#disponibilite"],
  ["03", "Expérience", "#experience"],
  ["04", "Méthode", "#methode"],
  ["05", "Dossiers", "#dossiers"],
  ["06", "Contact", "#contact"],
];

export default function Home() {
  const casesCount = portfolioData.cases.length;

  return (
    <main className="dossier-app le-dossier">
      <header className="dossier-header" aria-label="Site header">
        <Link className="dossier-mark" href="/">
          <span>Rugved Naik</span>
          <small>Paris / ESCP</small>
        </Link>
        <p className="dossier-center-mark" aria-label="Le Dossier">
          <span>Le Dossier</span>
          <span>Candidature</span>
        </p>
        <div className="language-switch" aria-label="Language">
          <button className="is-active" type="button" aria-pressed="true">FR</button>
          <button type="button" aria-pressed="false">EN</button>
        </div>
      </header>

      <section className="cover-sheet" aria-labelledby="cover-title">
        <aside className="cover-index" aria-label="Dossier identity">
          <span>01</span>
          <p>Profil</p>
          <p>Disponibilité</p>
          <p>Expérience</p>
          <p>Méthode</p>
          <p>Dossiers</p>
        </aside>

        <div className="cover-copy">
          <p className="eyebrow">Dossier de candidature</p>
          <h1 id="cover-title">Consumer understanding for product, marketing and PMM decisions.</h1>
          <p className="cover-lede">
            Un portfolio rapide à lire pour les recruteurs en France: qui je suis,
            quand je suis disponible, ce que j'ai fait, comment je travaille, et les
            dossiers à ouvrir si le fit est clair.
          </p>
          <div className="availability-stamp">Stage dès mars 2027 / alternance dès septembre 2027</div>
        </div>

        <div className="cover-meta" aria-label="Quick facts">
          <article>
            <span>Current</span>
            <strong>Danone, Innovation & Productivity PM Intern</strong>
          </article>
          <article>
            <span>Target</span>
            <strong>Innovation PM / PMM / PMO</strong>
          </article>
          <article>
            <span>Proof base</span>
            <strong>{casesCount} dossiers and signals</strong>
          </article>
          <article>
            <span>Contact</span>
            <strong>rugved.naik@edu.escp.eu</strong>
          </article>
        </div>
      </section>

      <section className="folder" aria-label="Portfolio dossier">
        <nav className="folder-tabs" role="tablist" aria-label="Dossier sections">
          {tabs.map(([number, label, href], index) => (
            <a
              className={`folder-tab${index === 0 ? " is-active" : ""}`}
              href={href}
              key={href}
              role="tab"
              aria-selected={index === 0}
            >
              <span>{number}</span> {label}
            </a>
          ))}
        </nav>

        <section className="folder-panel is-active" id="profil" role="tabpanel" aria-labelledby="profil">
          <div className="panel-heading">
            <p className="eyebrow">Profil</p>
            <h2>Je relie ce que les gens font à ce que les équipes doivent décider.</h2>
          </div>
          <div className="panel-body profile-grid">
            <div className="profile-statement">
              <p>
                Je suis étudiant à ESCP Business School à Paris, avec une base en
                ingénierie, une expérience en dashboards de performance, croissance
                marketplace et coordination de projets, et un intérêt constant pour les
                décisions produit qui partent du comportement réel des consommateurs.
              </p>
              <p>
                Avant d'ajouter un projet, un outil, un dashboard ou une fonctionnalité,
                il faut savoir ce que l'équipe doit décider et ce que les données rendent visible.
              </p>
            </div>
            <div className="profile-cards">
              <article>
                <span className="icon-dot" aria-hidden="true">◉</span>
                <h3>PM</h3>
                <p>Transformer le besoin en priorité produit.</p>
              </article>
              <article>
                <span className="icon-dot" aria-hidden="true">◇</span>
                <h3>PMM</h3>
                <p>Transformer l'usage en message mémorisable.</p>
              </article>
              <article>
                <span className="icon-dot" aria-hidden="true">◎</span>
                <h3>Innovation PMO</h3>
                <p>Rendre les jalons, risques et prochaines étapes lisibles.</p>
              </article>
              <article>
                <span className="icon-dot" aria-hidden="true">⌁</span>
                <h3>Terrain</h3>
                <p>Voyages, cultures et observation de ce que les gens font avant de l'expliquer.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="folder-panel" id="disponibilite" role="tabpanel" aria-labelledby="disponibilite">
          <div className="panel-heading">
            <p className="eyebrow">Disponibilité</p>
            <h2>Stage dès mars 2027, alternance dès septembre 2027.</h2>
          </div>
          <div className="panel-body availability-grid">
            <div className="stamp-card">
              <p>Disponible à partir de</p>
              <strong>Mars 2027</strong>
              <small>Stages PM, PMM, innovation, consumer strategy ou PMO. Alternance dès septembre 2027.</small>
            </div>
            <ol className="timeline">
              <li>
                <span>Sep 2026 - Fév 2027</span>
                <p>Danone, Innovation & Productivity PM Intern sur des projets Dairy.</p>
              </li>
              <li>
                <span>Mars 2027</span>
                <p>Recherche de stage en PM, PMM, innovation, project management ou consumer strategy.</p>
              </li>
              <li>
                <span>Septembre 2027</span>
                <p>Recherche d'alternance dans une équipe produit, innovation, performance ou PMO.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="folder-panel" id="experience" role="tabpanel" aria-labelledby="experience">
          <div className="panel-heading">
            <p className="eyebrow">Expérience</p>
            <h2>Une base innovation, data et exécution opérationnelle.</h2>
          </div>
          <div className="panel-body experience-stack">
            <article className="experience-item primary">
              <div>
                <span className="item-date">Sep 2026 - Fév 2027</span>
                <h3>Danone, Innovation & Productivity PM Intern</h3>
                <p>Dairy innovation, coordination projet, gouvernance, outils, Power BI et amélioration continue.</p>
                <ul className="experience-highlights">
                  <li>Coordination de projets innovation Dairy: nouveaux produits, recettes, formats et initiatives de productivité.</li>
                  <li>Planning et suivi des jalons: validation concept, essais R&D, industrialisation et launch readiness.</li>
                  <li>Data quality reviews, visibilité des risques et coordination R&D, Marketing, Supply, Quality et Regulatory.</li>
                  <li>Support IPROview, Power BI, gouvernance innovation, KPIs et santé du portfolio.</li>
                </ul>
              </div>
              <strong>Dairy innovation</strong>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Jul 2023 - Jun 2025</span>
                <h3>Freelance Growth & Performance Marketing Consultant</h3>
                <p>
                  10+ marques consumer, trois marchés, budget mensuel d'environ EUR 68K,
                  dashboards Excel et Power BI, +25% CTR, 1,000+ assets adaptés pour le Canada.
                </p>
              </div>
              <a href="case-peora-availability-ranking.html">Peora dossier</a>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Engineering base</span>
                <h3>BAJA SAE and e-mobility</h3>
                <p>
                  Conduite d'une équipe de 25 personnes en BAJA SAE India et travail de
                  produit sur un concept de mobilité électrique pliable.
                </p>
              </div>
              <a href="case-electric-mobility.html">E-mobility dossier</a>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Education</span>
                <h3>ESCP Business School and Mechanical Engineering</h3>
                <p>
                  Master in Management, Grande Ecole, ESCP Paris, prévu avril 2027.
                  B.E. Mechanical Engineering, Savitribai Phule Pune University, top 1%.
                </p>
              </div>
              <strong>Paris / India</strong>
            </article>
          </div>
        </section>

        <section className="folder-panel" id="methode" role="tabpanel" aria-labelledby="methode">
          <div className="panel-heading">
            <p className="eyebrow">Méthode</p>
            <h2>Un processus court pour transformer l'observation en décision.</h2>
          </div>
          <div className="panel-body method-grid">
            {method.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="folder-panel" id="dossiers" role="tabpanel" aria-labelledby="dossiers">
          <div className="panel-heading">
            <p className="eyebrow">Dossiers</p>
            <h2>Des preuves à ouvrir seulement si le premier fit est bon.</h2>
          </div>
          <div className="panel-body dossier-grid">
            {dossierLinks.map((dossier, index) => (
              <a
                className={`work-dossier${index < 2 ? " priority" : ""}`}
                href={dossier.href}
                key={dossier.href}
              >
                <span>{dossier.label}</span>
                <h3>{dossier.title}</h3>
                <p>{dossier.text}</p>
                <small>Open dossier</small>
              </a>
            ))}
          </div>
        </section>

        <section className="folder-panel" id="contact" role="tabpanel" aria-labelledby="contact">
          <div className="panel-heading">
            <p className="eyebrow">Contact</p>
            <h2>Si le besoin demande de comprendre le consommateur avant de décider, envoyez-moi le problème.</h2>
          </div>
          <div className="panel-body contact-grid">
            <div className="contact-card main-contact">
              <p>
                Je peux répondre avec le dossier le plus pertinent, une courte note écrite
                ou un appel de 20 minutes si le fit est clair.
              </p>
              <div className="contact-actions">
                <a href="mailto:rugved.naik@edu.escp.eu">Email</a>
                <a href="https://www.linkedin.com/in/rugvednaik">LinkedIn</a>
                <a href="rugved-naik-cv.pdf" download>Download CV PDF</a>
              </div>
            </div>
            <div className="contact-card">
              <span>What to send</span>
              <ul>
                <li>Le rôle ou le stage concerné.</li>
                <li>Le problème produit, marketing ou consommateur.</li>
                <li>La date et le contexte de l'équipe.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
