import type { Metadata } from "next";
import { ContactLinks, PageIntro, SectionLabel, SiteFooter, SiteHeader } from "../site-components";

export const metadata: Metadata = {
  title: "About — Rugved Naik",
  description: "Consumer insight, brand strategy, and product thinking from Paris.",
};

export default function AboutPage() {
  return (
    <main className="paper-page about-page">
      <SiteHeader />
      <PageIntro
        chapter="005"
        eyebrow="Profile · Paris"
        title="About"
        statement="I work at the intersection of consumer insight, brand strategy, and product thinking."
      />
      <section className="about-statement">
        <SectionLabel index="01">A working lens</SectionLabel>
        <div>
          <p className="lead-copy">
            I am interested in the hidden purpose of products, the rituals they create, and the
            systems that make them meaningful.
          </p>
          <p>
            My work begins with observation: a behaviour, an inconsistency, or a mechanism that is
            easy to overlook. From there, I look for the distinction that can organize a product,
            brand, or experience into something coherent enough to grow.
          </p>
        </div>
        <aside>
          <p className="meta-label">Based in</p>
          <p>Paris, France</p>
        </aside>
      </section>
      <section className="about-method">
        {[
          ["01", "Observation", "Notice the mechanism beneath the behaviour."],
          ["02", "Distinction", "Name the difference that changes the question."],
          ["03", "System", "Build a structure capable of carrying the idea."],
        ].map(([index, title, copy]) => (
          <div key={title}>
            <span>{index}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
        ))}
      </section>
      <section className="about-contact">
        <SectionLabel index="02">Contact</SectionLabel>
        <div>
          <p>For collaborations, editorial work, or brand strategy inquiries, get in touch.</p>
          <ContactLinks />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
