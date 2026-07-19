import type { Metadata } from "next";
import { ArrowLink, PageIntro, SectionLabel, SiteFooter, SiteHeader } from "../site-components";

export const metadata: Metadata = {
  title: "On Personalization | Rugved Naik",
  description: "An essay on the difference between prediction, relevance, recognition, and identity.",
};

const evidence = [
  {
    index: "01",
    name: "Netflix",
    idea: "Prediction without memory",
    body: "The system becomes highly competent at anticipating the next choice. Yet its knowledge often remains invisible: useful, but rarely felt as a relationship.",
  },
  {
    index: "02",
    name: "Spotify Wrapped",
    idea: "History made visible",
    body: "A year of listening returns as a portrait. The value is not simply accuracy. It is the moment the product reflects a version of the listener back to them.",
  },
  {
    index: "03",
    name: "Face Architecture",
    idea: "Identity as a system",
    body: "A beauty language becomes personal when it offers continuity: not a recommendation, but a structure through which someone can author and evolve their own face.",
  },
];

export default function PersonalizationPage() {
  return (
    <main className="paper-page">
      <SiteHeader />
      <PageIntro
        chapter="002"
        eyebrow="Essay · Product logic"
        title="On Personalization"
        statement="We have spent a decade trying to personalize products. I am not convinced we have made them more personal."
      />

      <article className="essay-body">
        <section className="essay-section essay-section--opening">
          <SectionLabel index="01">Accepted truth</SectionLabel>
          <div className="essay-copy">
            <p className="lead-copy">
              Personalization has become shorthand for a product knowing what comes next.
            </p>
            <p>
              We describe the system as intelligent when it predicts the song, film, route, meal, or
              message a person is likely to choose. The better the prediction, the more personal the
              experience is assumed to be. But prediction is only one kind of knowledge, and often
              the least intimate one.
            </p>
          </div>
          <aside className="essay-note">The product knows the pattern. Does the person feel known?</aside>
        </section>

        <section className="essay-section essay-section--fracture">
          <SectionLabel index="02">The fracture</SectionLabel>
          <div className="essay-copy">
            <p className="lead-copy">A product can be extremely relevant without being recognitive.</p>
            <p>
              Relevance removes friction. Recognition creates meaning. One anticipates a need; the
              other reflects something worth seeing. The distinction matters because an efficient
              product can still feel anonymous, while a simple product can become deeply personal
              when it gives history, taste, or progress a visible form.
            </p>
          </div>
          <blockquote>Relevance is not recognition.</blockquote>
        </section>

        <section className="distinction-section">
          <div className="distinction-section__header">
            <SectionLabel index="03">The distinction</SectionLabel>
            <p>A ladder from utility to identity</p>
          </div>
          <div className="essay-ladder" aria-label="The personalization ladder">
            {[
              ["Prediction", "The system anticipates."],
              ["Relevance", "The product becomes useful."],
              ["Recognition", "The product reflects something meaningful back."],
              ["Identity", "The product becomes part of how you understand yourself."],
            ].map(([term, copy], index) => (
              <div className="essay-ladder__step" key={term}>
                <span>0{index + 1}</span>
                <h2>{term}</h2>
                <p>{copy}</p>
                {index < 3 && <i aria-hidden="true">↓</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="evidence-section">
          <div className="evidence-section__header">
            <SectionLabel index="04">Evidence</SectionLabel>
            <p>Three ways a product can know</p>
          </div>
          <div className="evidence-list">
            {evidence.map((item) => (
              <div className="evidence-row" key={item.name}>
                <span>{item.index}</span>
                <h3>{item.name}</h3>
                <p className="evidence-row__idea">{item.idea}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="principles-section">
          <SectionLabel index="05">Design implication</SectionLabel>
          <div>
            <p className="lead-copy">Design for continuity, not just conversion.</p>
            <ol>
              <li><span>01</span>Make history visible</li>
              <li><span>02</span>Let products accumulate meaning</li>
              <li><span>03</span>Reflect identity instead of predicting behaviour</li>
              <li><span>04</span>Design continuity, not just relevance</li>
            </ol>
          </div>
        </section>

        <section className="essay-closing">
          <SectionLabel index="06">Closing thought</SectionLabel>
          <blockquote>
            Products should not only adapt to people. <em>They should grow with them.</em>
          </blockquote>
          <ArrowLink href="/givenchy">See the framework become a system</ArrowLink>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
