import Link from "next/link";
import portfolioData from "../observations-site/data/portfolio.json";

const realDossierLinks = [
  {
    engagement: "Academic project",
    category: "Consumer research and market reading",
    title: "Collectibility Over Loyalty",
    text: "How 4,700+ reviews revealed identity value, object value and a reason to build the collection itself.",
    href: "case-miutine.html",
    priority: true,
    lead: true,
  },
  {
    engagement: "Team leadership",
    category: "Product delivery under constraint",
    title: "Building the Team Before Building the Vehicle",
    text: "How a five-person group became a 25-person agile vehicle organization and delivered in four months.",
    href: "case-baja.html",
  },
  {
    engagement: "Freelance client work",
    category: "Commercial delivery",
    title: "Making Availability Visible",
    text: "Peora, Amazon advertising operations, e-commerce performance, stock-outs, organic visibility and an executive operating dashboard.",
    href: "case-peora-availability-ranking.html",
  },
  {
    engagement: "Freelance client work",
    category: "Amazon marketplace growth",
    title: "Listing Conversion Systems",
    text: "Amazon A+ content, product understanding, proof and trust as marketplace infrastructure.",
    href: "case-amazon-conversion.html",
  },
  {
    engagement: "Founder venture",
    category: "Product adoption",
    title: "Foldable Electric Mobility Product",
    text: "Patent-linked product research and a 2024 peer-reviewed paper on foldable electric mobility, DOI 10.4273/ijvss.16.1.08.",
    href: "case-electric-mobility.html",
  },
  {
    engagement: "Case competition",
    category: "Gen Z brand innovation",
    title: "Face Architecture",
    text: "Winning team among 20 teams in the 2026 ESCP x LVMH Fragrance Brands Case Challenge.",
    href: "case-givenchy.html",
  },
];

const thinkingDossierLinks = [
  {
    engagement: "Independent analysis",
    category: "Category-agnostic method test",
    title: "Testing Premium Value Through Marketplace Evidence",
    text: "A 100-listing Amazon analysis testing how interpretation, portfolio laddering and trust defend premium value.",
    href: "case-withings.html",
  },
  {
    engagement: "Independent analysis",
    category: "Target house",
    title: "What AI Can't Personalize",
    text: "L'Oréal, adaptive discovery, brand memory and protected cues inside personalization.",
    href: "case-loreal-ai-personalization.html",
  },
];

const method = [
  ["01", "Observe", "4,700+ ratings and reviews, supported by social listening and competitive benchmarking."],
  ["02", "Separate", "Separate bottle, packaging and display signals from identity, confidence and signature signals."],
  ["03", "Name", "Object Value is not Identity Value."],
  ["04", "Translate", "Move from one-scent loyalty logic to a collection-building system."],
  ["05", "Bound", "Reviews overrepresent purchase, unboxing and early ownership. The result is directional, not longitudinal."],
];

const tabs = [
  ["01", "Profil", "#profil"],
  ["02", "Disponibilité", "#disponibilite"],
  ["03", "Expérience", "#experience"],
  ["04", "Compétences", "#competences"],
  ["05", "Méthode", "#methode"],
  ["06", "Dossiers", "#dossiers"],
  ["07", "Contact", "#contact"],
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
          <p>Compétences</p>
          <p>Méthode</p>
          <p>Dossiers</p>
        </aside>

        <div className="cover-copy">
          <p className="eyebrow">Dossier de candidature</p>
          <h1 id="cover-title">I turn consumer behavior into product and marketing decisions.</h1>
          <p className="cover-lede">Engineer by training, growth practitioner, and EU Dairy Innovation &amp; Productivity Project Management Intern at Danone. Currently completing the ESCP Master in Management in Paris.</p>
          <a
            className="hero-cta-line"
            href="mailto:rugved.naik@edu.escp.eu?subject=Stage%20PM%2FPMM%2FPMO%2FConsumer%20Strategy%20-%20mars%202027"
          >
            Ouvert aux stages produit, marketing et stratégie consommateur à partir de mars 2027.
          </a>
          <div className="hero-proof-links" aria-label="Priority links">
            <a href="case-miutine.html">Ouvrir le dossier principal</a>
            <a href="rugved-naik-cv.pdf" download>CV PDF</a>
          </div>
          <div className="cover-meta" aria-label="Quick facts">
            <article>
              <span>Current</span>
              <strong>Danone · EU Dairy Innovation &amp; Productivity</strong>
              <small>Project Management Intern</small>
            </article>
            <article>
              <span>Target</span>
              <strong>Product Marketing · Consumer Insights · Innovation and Digital Marketing Project Management</strong>
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
          <div className="availability-stamp">Stage dès mars 2027 / alternance dès septembre 2027</div>
        </div>

        <div className="cover-side">
          <figure className="consumer-quote-card" aria-label="Consumer principle">
            <span>Principe consommateur</span>
            <blockquote>
              Avant qu'une équipe décide quoi construire ou dire, je cherche ce que la personne essaie de résoudre.
            </blockquote>
          </figure>
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
              <p className="profile-throughline">
                Ingénieur de formation, passé par la croissance et le marketing de
                performance, aujourd'hui en formation product management via ESCP et
                un stage en project management d'innovation chez Danone.
              </p>
              <p>
                Avant d'ajouter un projet, un outil, un dashboard ou une fonctionnalité,
                il faut savoir ce que l'équipe doit décider et ce que les données rendent visible.
              </p>
              <aside className="category-bridge">
                <strong>Une méthode, plusieurs catégories.</strong>
                <p>Danone apporte l'exécution et la gouvernance FMCG. Les cas beauty montrent la lecture de catégorie et la conception de propositions. Le travail marketplace apporte l'exécution commerciale digitale.</p>
              </aside>
              <div className="stat-strip" aria-label="At-a-glance proof points">
                <article>
                  <strong>4 700+</strong>
                  <span>avis analysés, projet académique</span>
                </article>
                <article>
                  <strong>EUR 68K/mois</strong>
                  <span>compte principal, 3 marchés</span>
                </article>
                <article>
                  <strong>-18%</strong>
                  <span>ACoS</span>
                </article>
                <article>
                  <strong>12 ans</strong>
                  <span>athlète national de Mallakhamb</span>
                </article>
              </div>
            </div>
            <div className="profile-cards">
              <article className="profile-photo-card" aria-label="Rugved Naik portrait">
                <img src="/assets/rugved-naik-headshot.jpg" alt="Rugved Naik" loading="eager" decoding="async" />
                <p>Rugved Naik / ESCP / Paris</p>
              </article>
              <article className="reading-card reading-shelf">
                <span>Sur l'étagère</span>
                <h3>The Social Life of Things</h3><p>Arjun Appadurai</p>
                <h3>Thinking in Systems</h3><p>Donella Meadows</p>
                <h3>The Practice of Everyday Life</h3><p>Michel de Certeau</p>
                <h3>The Choice Factory</h3><p>Richard Shotton</p>
              </article>
              <article>
                <span className="role-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false"><path d="M7 7V1.414a1 1 0 0 1 2 0V2h5a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L14.8 5.6a1 1 0 0 1-.8.4H9v10H7v-5H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7zm1 3V8H2l-.75 1L2 10zm0-5h6l.75-1L14 3H8z"/></svg>
                </span>
                <h3>PM</h3>
                <p>Transformer le besoin en priorité produit.</p>
              </article>
              <article>
                <span className="role-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false"><path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/></svg>
                </span>
                <h3>PMM</h3>
                <p>Transformer l'usage en message mémorisable.</p>
              </article>
              <article>
                <span className="role-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false"><path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/></svg>
                </span>
                <h3>Innovation PMO</h3>
                <p>Rendre les jalons, risques et prochaines étapes lisibles.</p>
              </article>
              <article>
                <span className="role-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false"><path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/></svg>
                </span>
                <h3>Recherche terrain & culturelle</h3>
                <p>Observer les usages, les contextes et les différences culturelles avant de formaliser une hypothèse.</p>
              </article>
              <article className="beyond-dossiers-card">
                <h3>Au-delà des dossiers</h3>
                <p>
                  Voyagé dans plus de 100 villes en Inde, en observant les tissus, les
                  soies régionales, les cuisines et les fêtes locales, la même curiosité
                  que celle qui alimente les dossiers, appliquée en dehors d'un brief.
                </p>
                <p>Athlète national de Mallakhamb pendant 12 ans, puis 5 ans en tant qu'entraîneur compétitif.</p>
                <p>Aime les vieux livres, surtout ceux qui portent encore les notes et griffonnages de leur précédent lecteur.</p>
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
              <small>Stages en marketing produit, études consommateurs, innovation ou gestion de projets marketing digital. Alternance dès septembre 2027.</small>
            </div>
            <div className="format-note">
              Convention de stage ESCP obligatoire. Durée recherchée: 6 mois.
            </div>
            <ol className="timeline">
              <li>
                <span>Sep 2026 - Fév 2027</span>
                <p>Stage actuel chez Danone, jusqu'à fin février 2027.</p>
                <p className="timeline-bridge">
                  Activement ouvert aux opportunités de mars 2027 pendant la fin de mon
                  stage chez Danone, jusqu'à fin février 2027.
                </p>
              </li>
              <li>
                <span>Mars 2027</span>
                <p>Recherche de stage en marketing produit, études consommateurs, innovation ou gestion de projets marketing digital.</p>
              </li>
              <li>
                <span>Septembre 2027</span>
                <p>Cibles: marketing produit, études consommateurs et gestion de projets innovation ou marketing digital.</p>
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
                <h3>Danone, EU Dairy Innovation &amp; Productivity</h3>
                <p>Project Management Intern · innovation Dairy, gouvernance, Power BI et amélioration continue.</p>
                <ul className="experience-highlights">
                  <li>Transformation des données de jalons, risques et actions en une vue projet partagée, de la validation concept au launch readiness.</li>
                  <li>Préparation de revues de qualité des données et de vues Power BI pour soutenir les décisions de gouvernance.</li>
                  <li>Rassemblement des contributions R&amp;D, Marketing, Supply, Quality et Regulatory pour les forums de décision.</li>
                  <li>Mise en évidence du statut, des risques et des prochaines étapes pour les équipes globales et locales.</li>
                </ul>
              </div>
              <strong>Dairy innovation</strong>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Jul 2023 - Jun 2025</span>
                <h3>Brand &amp; E-commerce Growth Consultant</h3>
                <p><strong>Mission principale: Peora.</strong> Gestion de la plateforme publicitaire Amazon, performance e-commerce, analytics et expansion internationale sur trois marchés.</p>
                <ul className="experience-highlights">
                  <li>Analyse d'un compte principal d'environ EUR 68K par mois couvrant l'Inde, les États-Unis et le Canada.</li>
                  <li>Construction de dashboards Excel et Power BI reliant ventes, publicité, stock et visibilité organique.</li>
                  <li>Tests créatifs et de ciblage contribuant à +25% de CTR et -18% d'ACoS.</li>
                  <li>Localisation de plus de 1 000 éléments marketplace pour l'expansion au Canada.</li>
                  <li>Pratique plus large auprès de plus de 10 marques consumer en positionnement, contenu, e-commerce et performance.</li>
                </ul>
              </div>
              <a href="case-peora-availability-ranking.html">Peora dossier</a>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Engineering base</span>
                <h3>Team Abhedya, BAJA SAE and e-mobility</h3>
                <p>
                  Équipe développée de 5 personnes à 24 membres plus moi. 15e au classement
                  général BAJA SAEINDIA 2023 et 4e au classement général ATVC 2023.
                </p>
              </div>
              <a href="case-electric-mobility.html">E-mobility dossier</a>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">L'Oréal Brandstorm 2026</span>
                <h3>Prada Olfactive Skin</h3>
                <p>Concept d'innovation parfum fondé sur une recherche Gen Z, traduit en activation 360° retail, mode et expérientielle.</p>
              </div>
              <strong>Beauty innovation</strong>
            </article>
            <article className="experience-item">
              <div>
                <span className="item-date">Education</span>
                <h3>ESCP Business School and Mechanical Engineering</h3>
                <p>
                  Master in Management, Grande Ecole, ESCP Paris, spécialisation Consumer-Centric Marketing, prévu avril 2028.
                  B.E. Mechanical Engineering, Savitribai Phule Pune University, top 1%.
                </p>
              </div>
              <strong>Paris / India</strong>
            </article>
          </div>
        </section>

        <section className="folder-panel" id="competences" role="tabpanel" aria-labelledby="competences">
          <div className="panel-heading">
            <p className="eyebrow">Compétences</p>
            <h2>Les outils et langages pratiques pour travailler vite avec une équipe.</h2>
          </div>
          <div className="panel-body skills-grid">
            <article className="skill-card">
              <span>Tools</span>
              <h3>Excel, Power BI, SQL</h3>
              <p>Dashboarding, KPI tracking, data visualization, performance reporting and data quality reviews.</p>
            </article>
            <article className="skill-card">
              <span>Marketplace</span>
              <h3>Amazon Seller Central / Ads</h3>
              <p>Acquisition, conversion, advertising, inventory, A+ content and marketplace performance tracking.</p>
            </article>
            <article className="skill-card">
              <span>Project delivery tools</span>
              <h3>Milestones, governance, stakeholders</h3>
              <p>Project coordination, risk tracking, decision forum preparation and continuous improvement.</p>
            </article>
            <article className="skill-card">
              <span>Languages</span>
              <h3>English C1, French A2 improving</h3>
              <p>
                Langue de travail quotidienne: anglais. Français A2, en progression
                active via des cours réguliers. Marathi natif, hindi bilingue.
              </p>
            </article>
            <article className="skill-card">
              <span>Certifications</span>
              <h3>Google Project Management, Google Marketing, Inside LVMH</h3>
              <p>Google Project Management 2026, Google Digital Marketing & E-Commerce 2025, Inside LVMH 2024.</p>
            </article>
          </div>
        </section>

        <section className="folder-panel" id="methode" role="tabpanel" aria-labelledby="methode">
          <div className="panel-heading">
            <p className="eyebrow">Méthode</p>
            <h2>Une méthode, montrée sur Miutine.</h2>
          </div>
          <div className="method-flow" aria-label="Method flow">
            <span>Observe</span>
            <span>Separate</span>
            <span>Name</span>
            <span>Translate</span>
            <span>Bound</span>
          </div>
          <a className="method-case-link" href="case-miutine.html#research-method">Voir la méthode et ses limites dans le dossier Miutine</a>
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
            <h2>Des preuves à ouvrir quand un cas vous intéresse.</h2>
          </div>
          <div className="panel-body dossier-stack">
            <section className="proof-index" aria-labelledby="proof-index-title">
              <div className="proof-index-heading">
                <span id="proof-index-title">Preuves sélectionnées</span>
              </div>
              <div className="proof-index-grid">
                <a href="case-miutine.html#evidence-trail">
                  <span>01 / Recherche</span>
                  <strong>4 700+ avis</strong>
                  <p>Analyse soumise en mars 2026, méthode, limites et traduction stratégique.</p>
                </a>
                <a href="case-baja.html#delivery-record">
                  <span>02 / Livraison</span>
                  <strong>5 à 25 personnes</strong>
                  <p>Responsabilité, contrainte de quatre mois, budget, arbitrage technique et résultat.</p>
                </a>
                <a href="case-givenchy.html#developed-artifact">
                  <span>03 / Artefact</span>
                  <strong>4 extraits du deck</strong>
                  <p>Le territoire, le système de positionnement et l'expérience présentés au jury.</p>
                </a>
              </div>
            </section>
            <div className="dossier-group dossier-group-real">
              <div className="dossier-group-heading">
                <span>Projets réels</span>
              </div>
              <div className="dossier-grid">
                {realDossierLinks.map((dossier) => (
                  <a
                    className={`work-dossier${dossier.priority ? " priority" : ""}${dossier.lead ? " lead-dossier" : ""}`}
                    href={dossier.href}
                    key={dossier.href}
                  >
                    <span className="dossier-tag">
                      <strong className="tag-kind tag-kind-real">{dossier.engagement}</strong>
                      <em>{dossier.category}</em>
                    </span>
                    {dossier.lead ? <span className="start-badge">Point de départ recommandé</span> : null}
                    <h3>{dossier.title}</h3>
                    <p>{dossier.text}</p>
                    <small>Open dossier</small>
                  </a>
                ))}
              </div>
            </div>
            <div className="dossier-group dossier-group-thinking">
              <div className="dossier-group-heading">
                <span>Exercices de réflexion</span>
                <p>Tests indépendants et clairement identifiés d'une méthode transférable entre catégories.</p>
              </div>
              <div className="dossier-grid">
                {thinkingDossierLinks.map((dossier) => (
                  <a
                    className="work-dossier thinking-dossier"
                    href={dossier.href}
                    key={dossier.href}
                  >
                    <span className="dossier-tag">
                      <strong className="tag-kind tag-kind-independent">{dossier.engagement}</strong>
                      <em>{dossier.category}</em>
                    </span>
                    <h3>{dossier.title}</h3>
                    <p>{dossier.text}</p>
                    <small>Open dossier</small>
                  </a>
                ))}
              </div>
            </div>
            <div className="dossier-closing-note">
              <span>Fil conducteur</span>
              <p>Chaque dossier part de la même question: qu'est-ce que cette personne essaie vraiment de résoudre?</p>
            </div>
          </div>
        </section>

        <section className="folder-panel" id="contact" role="tabpanel" aria-labelledby="contact">
          <div className="panel-heading">
            <p className="eyebrow">Contact</p>
            <h2>Pour discuter d'un rôle, d'un stage ou d'un sujet à structurer, écrivez-moi simplement.</h2>
          </div>
          <div className="panel-body contact-grid">
            <div className="contact-card main-contact">
              <p>
                Envoyez quelques lignes sur le rôle, l'équipe ou le sujet. Je vous
                répondrai avec ce qui aide le plus: CV, dossier, note courte ou échange.
              </p>
              <p className="response-note">Je réponds généralement sous 24-48 heures.</p>
              <p className="team-fit-note">
                Je cherche une équipe où les décisions produit partent de preuves, pas seulement d'opinions.
              </p>
              <p className="reference-note">Références disponibles sur demande.</p>
              <div className="contact-actions">
                <a href="mailto:rugved.naik@edu.escp.eu">Email</a>
                <a href="https://www.linkedin.com/in/rugvednaik">LinkedIn</a>
                <a href="rugved-naik-cv.pdf" download>Download CV PDF</a>
                <a href="rugved-naik-dossier.pdf" download>Download dossier PDF</a>
              </div>
            </div>
            <div className="contact-card context-card">
              <span>Contexte utile</span>
              <ul>
                <li>Le rôle, le stage ou l'équipe.</li>
                <li>Ce que l'équipe essaie de décider.</li>
                <li>Le calendrier et la langue de travail.</li>
                <li>Un lien ou document utile, si disponible.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
      <footer className="dossier-footer">
        <span>Rugved Naik</span>
        <span>Le Dossier, Paris</span>
        <span>Site personnel. Aucun analytics ni cookie.</span>
        <a href="rugved-naik-cv.pdf" download>CV PDF</a>
      </footer>
    </main>
  );
}
