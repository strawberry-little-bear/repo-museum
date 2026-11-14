# Repo Museum

Repo Museum turns a repository into an evidence-backed interactive exhibition.

It has two entrances that share one museum data contract:

- **Public browser scan**: enter a public GitHub repository and the static site reads public API and manifest data in the browser.
- **Local Agent curation**: run the bundled `repo-museum` skill inside a local Git repository. It reads Git history, tags, the current tree, and manifests, then writes a reviewable `.repo-museum/museum.json` artifact.

It is a static, browser-first experience with a guided route through a connected learning exhibition:

- **The foyer**: a plain-language answer to “what is this project for?” before the visitor sees code-shaped details.
- **First visitor**: one ordinary use of the project, explained in plain language first and technical language second.
- **Blueprint room**: an Agent or browser reading of the parts that make that use-path possible.
- **History hall**: commits grouped by natural day into an evidence-backed origin / turning point / now arc. A busy day appears once, and selecting a chapter reveals its reason, lesson, sampling coverage, and ordered evidence trail.
- **Ecosystem room**: direct dependencies surfaced from common manifest files. It disappears when the public scan finds no specimens.
- **Exit workshop**: three questions that let a visitor repeat the project's story without memorising a metric list, with immediate feedback and room completion, followed by a small commit pulse.

The visitor can switch between **Guided tour** and **Floor plan**. `Prev` / `Next` controls, clickable room indexes, and the floor plan all use the same room order. Room changes use a short transition card and a quiet spatial chime; the chime respects the existing mute control and reduced-motion preferences skip the transition animation. Claims remain linked to public GitHub evidence or the local Agent artifact. When a repository has no readable dependency manifest, the ecosystem room is removed from the route instead of presenting an empty exhibit.

Each room carries a small learning contract: one specific discovery, a plain-language scene, a technical reveal, a takeaway, an ordered evidence trail, an interaction hint, and a confidence label (`observed`, `inferred`, or `mixed`). Visitors can mark a room as understood; the learning map and exit workshop use that state to show whether the project has become explainable rather than merely visited. The exit workshop also asks three evidence-backed multiple-choice questions and marks the related room when the answer is correct. The Agent emits the same `learning.promise`, `learning.rooms[].discovery`, and `learning.rooms[].evidenceTrail` fields, so deeper local analysis improves the lesson without changing the renderer.

The history reader collapses commits that share a natural day, reports how many same-day markers were grouped, and keeps the sampling boundary visible. The browser samples the latest 100 commits plus the repository's earliest page when available. The local Agent samples a recent window plus the earliest records. A turning point is selected only from an interior natural day; when the sample contains one or two dates, the museum shows an honest visible-record or origin-to-now arc instead of padding a middle chapter. Every phase includes `start`, `end`, `commitCount`, `reason`, `coverage`, and evidence whose entries state what each commit or tag supports.

Loading, error, and exhibit content are mutually exclusive states, so the archive status cannot sit over an already rendered collection. Empty optional rooms, unavailable history, partial samples, and missing manifests all degrade in place rather than becoming decorative empty exhibits.

The site does not upload repository contents or require a model API. The browser reads public GitHub endpoints and public manifest files directly. The local Agent stays local and emits the same data shape, including `orientation`, `journey`, `architecture.flow`, and `analysis`, so deeper history can use the same renderer without turning the public site into a backend. The Agent's teaching path is deliberately conservative: it separates observed evidence from inferred explanations and links important claims back to a tracked file, manifest, commit, or tag.

## Run locally

This is a dependency-free static site. Serve the folder with any local HTTP server so browser fetch requests work:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Run the local Agent

From the root of a Git repository:

```bash
python3 skills/repo-museum/scripts/build_museum.py
```

This creates `.repo-museum/museum.json`. It uses only local Git and the Python standard library; it reads the tracked README, top-level tree, manifests, tags, and commit history. It does not push, publish, or upload repository contents. To inspect the generated collection in the local museum, serve the repository root and open:

```text
http://localhost:4173/?museum=.repo-museum%2Fmuseum.json
```

The reusable skill instructions live in `skills/repo-museum/SKILL.md`. The renderer contract is documented in `schema/museum-data.schema.json`.

## Share a collection

Use a GitHub owner/repository or full GitHub URL, for example:

```text
https://strawberry-little-bear.github.io/repo-museum/?repo=vitejs%2Fvite
```

The share button copies the current collection URL. Only public repositories are supported in this first release. GitHub API rate limits and large repository sizes can affect the amount of evidence available to the browser.

## Deploy

The workflow in `.github/workflows/deploy-pages.yml` deploys the repository root to GitHub Pages whenever `main` changes. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Project shape

```text
index.html       museum structure and accessibility labels
styles.css       visual system, responsive layout, exhibit styling
app.js           GitHub collection, Agent artifact loading, museum data mapping, guided-tour interactions
favicon.svg      small archive mark
skills/          local Agent skill and deterministic Git collector
schema/          shared museum data contract
.github/         GitHub Pages deployment workflow
```

## Product boundary

The public browser path intentionally uses transparent rule-based interpretation and public GitHub evidence. The local Agent can generate richer museum data from local Git history, tags, manifests, README, and repository structure. It emits shared `project`, `orientation`, `journey`, `architecture`, `learning`, `events`, `dependencies`, `analysis`, and `sources` fields so the renderer stays shared. `journey` explains a likely use path for a visitor who does not know the code; `architecture.flow` maps that path to visible repository areas; `learning.rooms` turns each exhibit into one discovery with an ordered evidence trail; `analysis.phases` explains the grouped natural-day arc and why its turning point was selected; `analysis.turningPointReason`, `analysis.distinctDates`, `analysis.excludedSameDayEvents`, and `analysis.coverage` keep the reading auditable. `analysis.arc[].lesson` and `analysis.historySummary` explain what the history teaches. Claims are evidence-backed and uncertain interpretations must be marked as such.

Built by `strawberry-little-bear`.
