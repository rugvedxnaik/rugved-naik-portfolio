import type { Metadata } from "next";
import { ArrowLink, PageIntro, SectionLabel, SiteFooter, SiteHeader } from "../site-components";

export const metadata: Metadata = {
  title: "19h03 | Rugved Naik",
  description: "A ritual-driven aperitif concept built around the transition into evening.",
};

const story = [
  ["01", "Signal", "Across cities, the evening does not begin in the same way. Paris marks the shift: work recedes, attention softens, and the first drink announces a different mode."],
  ["02", "Observation", "People are not only choosing a beverage. They are choosing a threshold, a small act that makes the evening feel as though it has properly begun."],
  ["03", "Tension", "Most alternatives define themselves by what they remove. But a substitute for alcohol is not automatically a substitute for transition, symbolism, or social ease."],
  ["04", "Concept", "19h03 is a functional sparkling aperitif for composed sociability: calm clarity without sedation, and participation without intoxication."],
];

export default function NineteenOhThreePage() {
  return (
    <main className="paper-page project-page project-page--1903">
      <SiteHeader />
      <PageIntro
        chapter="004"
        eyebrow="Product concept · Case study"
        title="19h03"
        statement="The first drink is not about alcohol. It is about transition."
      />

      <section className="time-visual" aria-label="The transition from day to evening at 19:03">
        <div className="time-visual__dial">
          <span className="time-visual__hour">19</span>
          <i aria-hidden="true" />
          <span className="time-visual__minute">03</span>
        </div>
        <div className="time-visual__copy">
          <p className="meta-label">Paris · The first evening drink</p>
          <p>Not the end of the day. Not yet the night. A precise moment in between.</p>
        </div>
      </section>

      <section className="product-story">
        {story.map(([index, title, copy]) => (
          <div className="product-story__row" key={title}>
            <SectionLabel index={index}>{title}</SectionLabel>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
        ))}
      </section>

      <section className="product-object-section">
        <div>
          <SectionLabel index="05">The object</SectionLabel>
          <h2>A bottle that behaves like a marker in time.</h2>
          <p>
            The form is composed, tactile, and deliberately non-compensatory. It does not borrow the
            visual codes of wellness or mimic alcohol. It holds its own cultural position.
          </p>
        </div>
        <div className="bottle-study" aria-label="Conceptual bottle and packaging study">
          <div className="bottle-study__bottle">
            <span>19h03</span>
            <small>Composed<br />sociability</small>
          </div>
          <div className="bottle-study__box">
            <span>Paris</span>
            <p>The evening,<br />properly begun.</p>
          </div>
          <p className="bottle-study__caption">Object study / Not final packaging</p>
        </div>
      </section>

      <section className="product-system-section">
        <div className="product-system-section__header">
          <SectionLabel index="06">The system</SectionLabel>
          <p>One occasion, designed at three levels.</p>
        </div>
        <div className="product-system-grid">
          <div>
            <span>Functional</span>
            <h3>Calm clarity</h3>
            <p>Supports the shift into a relaxed, socially available state.</p>
          </div>
          <div>
            <span>Emotional</span>
            <h3>Composed presence</h3>
            <p>Makes the choice feel elegant, intentional, and fully participatory.</p>
          </div>
          <div>
            <span>Symbolic</span>
            <h3>A new beginning</h3>
            <p>Reframes non-alcoholic choice as taste and cultural awareness, not absence.</p>
          </div>
        </div>
        <div className="ritual-sequence" aria-label="19h03 ritual sequence">
          {[
            ["18:58", "Signal", "Close the working day"],
            ["19:03", "Pour", "Mark the transition"],
            ["19:08", "Arrive", "Become socially present"],
          ].map(([time, title, copy]) => (
            <div key={time}>
              <span>{time}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="outcome-section">
        <SectionLabel index="07">Outcome</SectionLabel>
        <div>
          <p className="lead-copy">The product owns a moment, not a substitute category.</p>
          <p>
            19h03 turns an observed behaviour into a scalable product system: a precise occasion,
            a functional promise, a cultural code, and a repeatable ritual people can recognize as
            their own.
          </p>
        </div>
        <blockquote>Not a replacement. Just a different beginning.</blockquote>
      </section>

      <section className="project-closing">
        <p className="meta-label">From observation to ownership</p>
        <blockquote>The strongest product ideas do not invent a need. They give an unnamed moment a form.</blockquote>
        <ArrowLink href="/about">About the practice</ArrowLink>
      </section>
      <SiteFooter />
    </main>
  );
}
