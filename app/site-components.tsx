import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/personalization", label: "On Personalization" },
  { href: "/givenchy", label: "Givenchy" },
  { href: "/19h03", label: "19h03" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ inverted = false }: { inverted?: boolean }) {
  return (
    <header className={`site-header${inverted ? " site-header--inverted" : ""}`}>
      <Link className="site-mark" href="/" aria-label="Rugved Naik, home">
        <span>RN</span>
        <span className="site-mark__folio">Archive 01</span>
      </Link>
      <nav aria-label="Primary navigation">
        <ul className="site-nav">
          {navigation.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span aria-hidden="true">0{index + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function ContactLinks({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className={`contact-links${inverted ? " contact-links--inverted" : ""}`}>
      <a href="mailto:hello@rugvednaik.com">Email</a>
      <a href="https://www.linkedin.com/in/rugvednaik" target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a
        href="https://www.behance.net/search/users?search=Rugved%20Naik"
        target="_blank"
        rel="noreferrer"
      >
        Behance
      </a>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__note">
        <p className="meta-label">A quiet invitation</p>
        <p>For collaborations, editorial work, or brand strategy inquiries, get in touch.</p>
      </div>
      <ContactLinks inverted />
      <div className="site-footer__bottom">
        <p>Paris · France</p>
        <p>Observation · Distinction · System</p>
        <p>RN / 2026</p>
      </div>
    </footer>
  );
}

export function PageIntro({
  chapter,
  eyebrow,
  title,
  statement,
}: {
  chapter: string;
  eyebrow: string;
  title: string;
  statement: string;
}) {
  return (
    <section className="page-intro">
      <div className="page-intro__top">
        <p className="meta-label">{eyebrow}</p>
        <p className="folio">RN / {chapter}</p>
      </div>
      <div className="page-intro__grid">
        <h1>{title}</h1>
        <p>{statement}</p>
      </div>
    </section>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <p>{children}</p>
    </div>
  );
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="arrow-link" href={href}>
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
