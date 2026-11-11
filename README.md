# Jason Johnson — portfolio

One portfolio, drawn three ways; a small switcher at the bottom of each page flips between them. Plain HTML, CSS and JavaScript — no build step.

- `index.html` — landing page linking to all three versions
- `thread/` — the working version: a pen line runs from a sketched J through a field of writing, a night-sky constellation for work with a shooting star or rocket travelling along it, index cards for side projects, a keyboard of skills, and a winter shore under a line of music that plays as the page scrolls
- `skills/` — a scratch page with five alternative drawings of the skills section (islands, growth rings, tags on a line, a pressed garden, a record sleeve)
- `work/` — a scratch page with four sky-themed drawings of the work section (orbits, a constellation, moon phases, the sun's climb)
- `story/` — a scratch page with three storyboard sketches of the page as one continuous story
- `story-e/` — the water story with the star on the line, a sunset fade over the side projects and the boat at anchor on the staff
- `story-d/` — the current favourite: the falling star with the arched staff, the beach, and bands that fade into each other
- `story-a/`, `story-b/`, `story-c/` — full builds of the three stories (falling star, night into morning, down to the water); they share `story/full.js` and `story/full.css` on top of the pen line styles
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
