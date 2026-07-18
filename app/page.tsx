import { ArrowLink, ContactLinks, SectionLabel, SiteFooter, SiteHeader } from "./site-components";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <SiteHeader inverted />
        <div className="home-hero__frame">
          <div className="home-hero__eyebrow">
            <span className="rule" />
            <p>Research dossier · Volume 01</p>
          </div>
          <div className="home-hero__grid">
            <h1>
              Rugved
              <br />
              Naik
            </h1>
            <div className="home-hero__thesis">
              <p>I explore what products, brands, and experiences are actually for.</p>
              <div className="home-hero__principles">
                <span>Observation</span>
                <span>Distinction</span>
                <span>System</span>
              </div>
            </div>
          </div>
        </div>
        <a className="enter-archive" href="#archive">
          <span>Enter the archive</span>
          <span className="rule" />
        </a>
      </section>

      <section className="manifesto-shell" id="archive">
        <SectionLabel index="00">The lens</SectionLabel>
        <p className="manifesto-copy">
          <span>Most products are described by their features.</span> I am interested in the hidden
          purpose beneath them. What is a product really doing? What relationship is it creating?
          What does it make possible?
        </p>
        <aside className="margin-note">
          <p className="meta-label">A working method</p>
          <p>Look beneath the object. Find the human mechanism. Build the system around it.</p>
        </aside>
      </section>

      <section className="featured-essay">
        <div className="featured-essay__header">
          <SectionLabel index="01">Featured essay</SectionLabel>
          <p className="folio">Reading time / 08 min</p>
        </div>
        <div className="featured-essay__grid">
          <div className="featured-essay__title">
            <p className="kicker">Relevance is not recognition.</p>
            <h2>On Personalization</h2>
            <blockquote>
              We have spent a decade trying to personalize products. I am not convinced we have
              made them more personal.
            </blockquote>
            <ArrowLink href="/personalization">Read the distinction</ArrowLink>
          </div>
          <div className="identity-ladder" aria-label="Prediction leads to relevance, recognition, and identity">
            {[
              ["Prediction", "The system anticipates"],
              ["Relevance", "The product becomes useful"],
              ["Recognition", "Meaning is reflected back"],
              ["Identity", "The product grows with you"],
            ].map(([term, definition], index) => (
              <div className="identity-ladder__step" key={term}>
                <span className="identity-ladder__number">0{index + 1}</span>
                <strong>{term}</strong>
                <small>{definition}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="selected-work">
        <div className="selected-work__rail">
          <SectionLabel index="02">Selected work</SectionLabel>
          <p>Ideas made visible through systems.</p>
        </div>
        <a className="project-entry project-entry--givenchy" href="/givenchy">
          <div className="project-entry__topline">
            <p>Luxury strategy · Case study</p>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="project-symbol project-symbol--face" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>Givenchy<br />Face Architecture</h3>
          <p>A luxury beauty system that translates couture logic into facial architecture.</p>
          <small>Proves: territory · translation · continuity</small>
        </a>
        <a className="project-entry project-entry--1903" href="/19h03">
          <div className="project-entry__topline">
            <p>Product concept · Case study</p>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="project-symbol project-symbol--clock" aria-hidden="true">
            <span>19</span><i /><span>03</span>
          </div>
          <h3>19h03</h3>
          <p>A ritual-driven aperitif designed around the transition into evening.</p>
          <small>Proves: observation becomes a product system</small>
        </a>
      </section>

      <section className="approach-section">
        <SectionLabel index="03">Approach</SectionLabel>
        <div className="approach-section__copy">
          <p>
            My work sits at the intersection of consumer insight, product thinking, and brand
            strategy. I am interested in how observations become systems, and how systems become
            products, brands, and experiences people return to.
          </p>
          <ArrowLink href="/about">About the practice</ArrowLink>
        </div>
        <aside>
          <p className="meta-label">Working across</p>
          <ul>
            <li>Luxury</li>
            <li>Product marketing</li>
            <li>Consumer insight</li>
            <li>Product management</li>
          </ul>
        </aside>
      </section>

      <section className="future-essays" aria-label="Future essays">
        {[
          ["04", "On Rituals"],
          ["05", "On Return"],
          ["06", "On Waiting"],
          ["07", "On Ownership"],
        ].map(([index, title]) => (
          <div key={title}>
            <span>{index}</span>
            <p>{title}</p>
            <small>In the archive</small>
          </div>
        ))}
      </section>

      <section className="closing-note">
        <p>Strategy is only useful if it changes how something feels.</p>
        <ContactLinks />
      </section>
      <SiteFooter />
    </main>
  );
}
