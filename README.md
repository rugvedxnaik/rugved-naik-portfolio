# The Consumer Read | Rugved Naik

A multi-page portfolio for Rugved Naik, presenting essays and case studies on consumer insight, product thinking, and brand strategy.

## Pages

- Home and archive
- On Personalization
- Givenchy Face Architecture
- 19h03
- About and contact

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

## Content system

The live portfolio case surfaces are generated from
`observations-site/data/portfolio.json`.

To add or update work:

- Add one entry to `cases` for a new case.
- Set `isHighlight: true` only when the case has an expanded read panel.
- Set `isProofSignal: true` only when it should appear in the hero proof ledger.
- Add short, dated observations to `fieldNotes` between full case releases.
- Update `site.lastUpdatedLabel` after a visible content change.

## Validation

```bash
npm test
npm run export:static
```

The GitHub Actions workflow validates the application, creates a static export, and publishes it to GitHub Pages after every push to `main`.
