import type { Metadata } from "next";
import { ArrowLink, PageIntro, SectionLabel, SiteFooter, SiteHeader } from "../site-components";

export const metadata: Metadata = {
  title: "Givenchy Face Architecture — Rugved Naik",
  description: "A luxury strategy dossier translating couture logic into facial architecture.",
};

export default function GivenchyPage() {
  return (
    <main className="paper-page project-page project-page--givenchy">
      <SiteHeader />
      <PageIntro
        chapter="003"
        eyebrow="Luxury strategy · Case study"
        title="Givenchy Face Architecture"
        statement="Couture gave Givenchy authority over the body. Face Architecture extends that authority to the face."
      />

      <section className="project-opening-visual" aria-label="Abstract face architecture blueprint">
        <div className="face-blueprint">
          <span className="face-blueprint__oval" />
          <span className="face-blueprint__axis face-blueprint__axis--vertical" />
          <span className="face-blueprint__axis face-blueprint__axis--horizontal" />
          <span className="face-blueprint__plane face-blueprint__plane--one">Light</span>
          <span className="face-blueprint__plane face-blueprint__plane--two">Structure</span>
          <span className="face-blueprint__plane face-blueprint__plane--three">Expression</span>
        </div>
        <div className="project-opening-visual__caption">
          <p className="meta-label">Territory map / 01</p>
          <p>The face understood not as a surface to decorate, but as an architecture to author.</p>
        </div>
      </section>

      <section className="dossier-section">
        <SectionLabel index="01">The challenge</SectionLabel>
        <div className="dossier-section__copy">
          <p className="lead-copy">Givenchy owned couture. It did not yet own beauty as a territory.</p>
          <p>
            The house had authority, symbolism, and a powerful design grammar—but the beauty offer
            risked behaving like a collection of products adjacent to fashion. The question was not
            how to add another look. It was how to make beauty feel structurally Givenchy.
          </p>
        </div>
        <aside className="dossier-aside">
          <p className="meta-label">Strategic question</p>
          <p>What can couture know about the face that cosmetics alone cannot?</p>
        </aside>
      </section>

      <section className="territory-section">
        <div>
          <SectionLabel index="02">The missing territory</SectionLabel>
          <h2>From adornment<br />to architecture.</h2>
        </div>
        <div className="territory-contrast">
          <div>
            <p className="meta-label">Category convention</p>
            <p>Colour follows trend.</p>
            <p>Looks arrive and disappear.</p>
            <p>The face becomes a canvas.</p>
          </div>
          <div>
            <p className="meta-label">Givenchy territory</p>
            <p>Structure creates identity.</p>
            <p>Codes evolve with continuity.</p>
            <p>The face becomes architecture.</p>
          </div>
        </div>
      </section>

      <section className="system-section">
        <div className="system-section__header">
          <SectionLabel index="03">The system</SectionLabel>
          <p>A beauty language built from planes, light, line, and proportion.</p>
        </div>
        <div className="architecture-grid">
          {[
            ["01", "Plane", "Where light lands"],
            ["02", "Line", "Where direction begins"],
            ["03", "Volume", "Where presence gathers"],
            ["04", "Accent", "Where identity appears"],
          ].map(([index, title, copy]) => (
            <div key={title}>
              <span>{index}</span>
              <div className={`architecture-mark architecture-mark--${index}`} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <div className="seasonal-palette">
          <div>
            <p className="meta-label">Continuity / Core architecture</p>
            <p>Bone</p><p>Shadow</p><p>Line</p><p>Light</p>
          </div>
          <div>
            <p className="meta-label">Evolution / Seasonal expression</p>
            <span className="swatch swatch--bone" /><span className="swatch swatch--wine" />
            <span className="swatch swatch--bronze" /><span className="swatch swatch--ink" />
          </div>
        </div>
      </section>

      <section className="ecosystem-section">
        <SectionLabel index="04">The ecosystem</SectionLabel>
        <div className="ecosystem-section__statement">
          <h2>One territory.<br />Many expressions.</h2>
          <p>
            Face Architecture becomes a coherent ecosystem: a way to develop product, service,
            education, retail, image, and seasonal innovation without losing the house logic.
          </p>
        </div>
        <div className="ecosystem-map" aria-label="Face Architecture ecosystem">
          <div className="ecosystem-map__center">Face<br />Architecture</div>
          {[
            "Product system", "Signature service", "Artist language", "Retail ritual", "Campaign world", "Seasonal evolution",
          ].map((item) => <div key={item}>{item}</div>)}
        </div>
      </section>

      <section className="project-closing">
        <p className="meta-label">The inevitable conclusion</p>
        <blockquote>
          Givenchy does not simply colour the face. It gives the face a couture structure of its own.
        </blockquote>
        <ArrowLink href="/19h03">Next dossier · 19h03</ArrowLink>
      </section>
      <SiteFooter />
    </main>
  );
}
