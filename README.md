# Jason Johnson — portfolio

One portfolio, drawn three ways; a small switcher at the bottom of each page flips between them. Plain HTML, CSS and JavaScript — no build step.

- `index.html` — landing page linking to all three versions
- `thread/` — the working version: a pen line runs from a sketched J through a field of writing, a dotted route with a small boat for work, index cards for side projects, a keyboard of skills, and a winter shore under a line of music that plays as the page scrolls
- `scribble/` — the first pass at the pen-line style: scribbled writing, blossom branches, paper scraps, a stitched skills sampler
- `ink/` — brush ink on paper: a voyage through work, lanterns for side projects, constellations for skills
- `projects.js` — all content (work, projects, skills), shared by all versions
- `projects/` — screenshots and clips
- `resume.pdf`

## Run locally

```bash
npx serve .
# or
python3 -m http.server 4173
```

Then open the printed address.

## Deploy

Any static host works (Vercel, Netlify, GitHub Pages) with the repository root as the site root.
