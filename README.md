# Jason Johnson — portfolio

The live site is the page at the root. Earlier versions and ideas pages are kept alongside it, unlinked; `all/` lists them. Plain HTML, CSS and JavaScript — no build step.

- `index.html` — the site itself (the sunset to sea version); its script and styles live in `story-e/`
- `all/` — an unlinked page listing every version and ideas page, for comparing
- `thread/` — the working version: a pen line runs from a sketched J through a field of writing, a night-sky constellation for work with a shooting star or rocket travelling along it, index cards for side projects, a keyboard of skills, and a winter shore under a line of music that plays as the page scrolls
- `skills/` — a scratch page with five alternative drawings of the skills section (islands, growth rings, tags on a line, a pressed garden, a record sleeve)
- `story-e/` — the current direction, one story top to bottom: stars, a sunset where each side project is its own small constellation, a sea whose waves are the music staff, a beach of skills; builds on the pen line styles
- `about-ideas/` — a scratch page with four water-themed treatments of the about pictures (bubbles, bottles, rafts, reflections)
- `side/` — a scratch page with four ways to show the side projects in the sunset sky (lanterns, kites, small constellations, bottles)
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
