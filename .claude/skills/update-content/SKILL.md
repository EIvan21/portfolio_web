---
name: update-content
description: Update the portfolio's content sections (Professional experience, Projects, Certifications, Stack, Education). Use when the user wants to add/edit/remove a job, project, certification, skill, or degree.
---

# Update portfolio content

Every section is driven by a plain JS array declared at the top of its component.
To update a section, edit that array — no JSX changes needed. After editing,
**always verify locally** (`npm start`, user confirms at localhost:3000), then
deploy with `/deploy`.

## Visual / design changes

For anything beyond swapping content — new UI, restyling, layout, color, type, or
a design audit — first load the **`frontend-design`** skill (from the
`frontend-design` plugin) and follow its guidance so changes stay distinctive and
non-templated. Design decisions already made for this site, keep them consistent:

- Accent green `--accent` (#1D9E75) for the core brand; violet `--ai` (#7c5cff)
  reserved for AI-related items (AI project cards, the LookML pipeline node).
- Fonts: `--font-display` (Space Grotesk) for headings, `--font-body` (DM Sans)
  for prose, `--font-mono` (JetBrains Mono) for labels/metrics/code-like accents.
- Signature element: the animated data pipeline in the Hero
  (`src/components/Hero.jsx`).
- Quality floor: respect `prefers-reduced-motion`, keep visible `:focus-visible`
  states, stay responsive to mobile.

## Section map

| Section (UI label)        | File                              | Array   |
|---------------------------|-----------------------------------|---------|
| Professional experience   | `src/components/Experience.jsx`   | `JOBS`  |
| Projects (Looker Open Source) | `src/components/Projects.jsx` | `PROJECTS` |
| Certifications            | `src/components/Skills.jsx`        | `CERTS` |
| Stack & tools             | `src/components/Skills.jsx`        | `STACK` |
| Education                 | `src/components/Education.jsx`     | `EDUCATION` |
| Contact socials           | `src/components/Contact.jsx`       | `SOCIALS` |

## Field shapes

**JOBS** (order = newest first; first item usually has the "Current" badge):
```js
{
  role: 'Google Cloud Engineer',
  company: 'GlobalLogic',
  period: 'Aug 2024 — Present',
  current: true,              // optional; shows "Current" badge
  bullets: ['…', '…'],        // one <li> per string
}
```

**PROJECTS** (grid of repo cards):
```js
{
  tag: 'LookML',              // small label chip
  name: 'Agent Analytics Block',
  desc: '…',
  url: 'https://github.com/…',
  author: true,               // true = "Lead author" badge + featured styling
}
```
Note: the section title is "Looker Open Source" (`Projects.jsx`, ~line 43) with
subtitle "30+ blocks · github.com/looker-open-source". If adding projects that are
NOT Looker blocks (e.g. AI projects), consider updating the title/subtitle or
adding a separate group so the framing still fits — ask the user.

**CERTS**:
```js
{ name: 'Associate Cloud Engineer', org: 'Google Cloud · 2025', desc: '…' }
```

**STACK** (chips): `{ label: 'Python', group: 'prog' }`
`group` ∈ `prog` | `cloud` | `data` | `tools` (controls chip color).

**EDUCATION**:
```js
{ degree: 'MSc in Applied Artificial Intelligence',
  school: 'Tecnológico de Monterrey', period: 'In progress', note: '…' }
```

## Workflow

1. Ask the user which section and gather the item's fields (see shapes above).
2. Edit the matching array. Keep ordering intent (newest first for jobs/edu).
3. `npm start` and have the user confirm at http://localhost:3000.
4. Once approved, run `/deploy`.

## Keeping the site in sync with the CV

Two résumé PDFs live in `public/`: `Edher_Ivan_Diaz_CV_EN.pdf` (linked from
`Hero.jsx` as "Download CV") and `Edher_Ivan_Diaz_CV_ES.pdf` (the small "CV en
español" link). When updating experience/certs to match a new CV, replace the
matching PDF (keep the same filename) so the downloads stay in sync.
