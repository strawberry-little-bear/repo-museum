# Repo Museum

Repo Museum turns a repository into an evidence-backed interactive exhibition.

It has two entrances that share one museum data contract:

- **Public browser scan**: enter a public GitHub repository and the static site reads public API and manifest data in the browser.
- **Local Agent curation**: run the bundled `repo-museum` skill inside a local Git repository. It reads Git history, tags, the current tree, and manifests, then writes a reviewable `.repo-museum/museum.json` artifact.

It is a static, browser-first experience with a guided route through a connected learning exhibition:

- **The foyer**: a plain-language answer to “what is this project for?” before the visitor sees code-shaped details.
- **First visitor**: one ordinary use of the project, explained in plain language first and technical language second.
- **Blueprint room**: an Agent or browser reading of the parts that make that use-path possible, anchored by a searchable Repository Atlas, evidence-backed cross-file investigations, and a **Signal Lab** that draws only visible import and asset declarations. Each edge names its exact source path and line, and a local reference resolves only when exactly one tracked path matches.
- **History hall**: commits grouped by natural day into an evidence-backed origin / turning point / now arc. A busy day appears once, and selecting a chapter reveals its reason, lesson, sampling coverage, and ordered evidence trail.
- **Ecosystem room**: direct dependencies surfaced from common manifest files. It disappears when the public scan finds no specimens.
- **Exit workshop**: three questions that let a visitor repeat the project's story without memorising a metric list, with immediate feedback and room completion, followed by an interactive commit pulse. Each pulse marker opens the commit or grouped-day evidence behind that sound.

Before the room index, **What the Agent found** presents one cross-file field note rather than another dashboard. The note names a concrete discovery, explains why it matters, indexes up to five tracked-file sources, states the evidence boundary, and opens the matching Repository Atlas investigation. Its **Evidence Constellation** places those sources around a visible synthesis core; hovering, focusing, or selecting a node highlights the matching source card and explains what that file contributes. The local Agent emits this as `analysis.discovery`; older collections and live browser scans fall back to the strongest supported investigation, and the entire field note stays hidden when there is no defensible finding.

The archive summary is also evidence-derived. It reports indexed files and folders, connected cross-file sources, dated chapters, and the latest observed marker instead of presenting stars, forks, or open issues as the museum's primary reading.

The visitor can switch between **Guided tour** and **Floor plan**. `Prev` / `Next` controls, clickable room indexes, and the floor plan all use the same room order. Room changes use a short transition card and a quiet spatial chime; the chime respects the existing mute control and reduced-motion preferences skip the transition animation. Claims remain linked to public GitHub evidence or the local Agent artifact. When a repository has no readable dependency manifest, the ecosystem room is removed from the route instead of presenting an empty exhibit.

Each room carries a small learning contract: one specific discovery, a plain-language scene, a technical reveal, a takeaway, an ordered evidence trail, an interaction hint, and a confidence label (`observed`, `inferred`, or `mixed`). Visitors can mark a room as understood; the learning map and exit workshop use that state to show whether the project has become explainable rather than merely visited. The exit workshop also asks three evidence-backed multiple-choice questions and marks the related room when the answer is correct. The Agent emits the same `learning.promise`, `learning.rooms[].discovery`, and `learning.rooms[].evidenceTrail` fields, so deeper local analysis improves the lesson without changing the renderer.

The history reader collapses commits that share a natural day, reports how many same-day markers were grouped, and keeps the sampling boundary visible. The browser samples the latest 100 commits plus the repository's earliest page when available. The local Agent samples a recent window plus the earliest records. A turning point is selected only from an interior natural day; when the sample contains one or two dates, the museum shows an honest visible-record or origin-to-now arc instead of padding a middle chapter. Every phase includes `start`, `end`, `commitCount`, `reason`, `coverage`, and evidence whose entries state what each commit or tag supports.

Loading, error, and exhibit content are mutually exclusive states, so the archive status cannot sit over an already rendered collection. Empty optional rooms, unavailable history, partial samples, and missing manifests all degrade in place rather than becoming decorative empty exhibits.

## Repository Atlas

The Blueprint room now includes a Repository Atlas designed as an archival reading desk rather than a generic file browser. It answers a newcomer's practical question: **what can I investigate, which files support the answer, and where does the evidence stop?**

- The browser indexes every path returned by GitHub's recursive tree; the local Agent indexes every path in the tracked HEAD tree.
- The Atlas turns the linear first-reading route into three cross-file investigations when the available evidence supports them: **Trace the public path**, **Check the promise**, and **Map the technical boundary**.
- Each investigation states its question, why the route exists, and a field-note finding assembled from the selected files. Every stop turns a path into a concrete reading task and links back to that exact tracked path.
- Investigations are derived from documentation, manifest, entry point, implementation, public surface, example, test, and automation categories. Missing categories reduce the route instead of producing a fabricated complete sequence.
- Each route stop can carry a `readingGuide` generated with the deterministic `text-structure/v1` lens. For source files it surfaces top-level classes, structs, interfaces, functions, and imports with line numbers; for manifests it surfaces scripts, modules, and declared packages; for documents it surfaces headings and the first substantive passage.
- Reading-lens entries are clickable. Selecting a declaration or import scrolls the code pane to that numbered line and briefly highlights it, so “start here” remains traceable instead of becoming decorative advice.
- Source declarations are ranked deterministically before presentation: public types, core objects, project-named symbols, and entry-like functions come before private or incidental helpers. This is a reading heuristic, not an execution trace or a claim about which code is most important.
- Every indexed path is searchable and filterable. Selecting a folder narrows the path index; selecting a file loads a bounded text preview.
- The local Agent embeds small text previews in the artifact. The public browser fetches readable files on demand from GitHub raw, with binary, lock-file, minified-file, and oversized-file fallbacks.
- Browser scans and local Agent artifacts use the same `repositoryMap` contract: totals, extensions, directories, indexed entries, route stops, investigations, findings, boundaries, and optional previews.
- If GitHub returns a partial recursive tree, the atlas says so instead of presenting the partial list as the whole repository.
- On mobile, the Atlas becomes a collapsed **Open the evidence desk** disclosure. Once opened, **Reading desk** and **Path index** are mutually exclusive panes: choosing a path returns the visitor to the readable source preview, while the guided investigation, filters, search, and evidence boundary remain available without forcing two long columns into one page.
- Reading roles, investigations, prompts, and findings are inferred from names, paths, and bounded text previews. They are reading suggestions, not resolved runtime call paths, proof that a dependency is used, or evidence that the project has been run, tested, or built.
- Reading guides scan at most the first 60,000 readable characters. The guide states this boundary, and older artifacts without `readingGuide` still work because the browser derives the same lens from any loaded preview.
- The **Signal Lab** is a separate evidence view inside the Blueprint room. It scans visible imports and asset references from HTML, CSS/SCSS/Less, and source guides, then plots tracked files against external or unresolved boundaries. The graph is a declaration map, not a runtime call graph: it never infers traffic, execution order, dependency usage, or hidden intent. Browser scans and local Agent collections emit the same optional `repositoryMap.signalGraph` contract with `model: declared-structure/v1`; when a tree has fewer than two declared edges, the lab states that it has insufficient signal rather than filling the stage with decoration.

The site does not upload repository contents or require a model API. The browser reads public GitHub endpoints and public manifest files directly. The local Agent stays local and emits the same data shape, including `orientation`, `journey`, `architecture.flow`, `repositoryMap`, and `analysis`, so deeper history can use the same renderer without turning the public site into a backend. The Agent's teaching path is deliberately conservative: it separates observed evidence from inferred explanations and links important claims back to a tracked file, manifest, commit, or tag. A field note may summarize what the files jointly reveal, but it must also name what the structural scan did not establish.

The deployed demo also carries an Agent-curated collection for Repo Museum itself. The Pages workflow runs the local skill against a full-history checkout, writes `collections/repo-museum.json`, and uses that artifact before attempting a live browser scan. This makes the project's own exhibition available even when anonymous GitHub API traffic is limited, while keeping the same evidence contract and renderer as every other collection.

For public repositories without a built-in collection, a GitHub API limit no longer dead-ends the visit. The error state can accept a fine-grained token with public-repository read access. The token is kept only in the current tab's `sessionStorage`, sent only to `api.github.com`, and never copied into a share link. It is not a backend credential and is not required for the built-in Agent demo.

## Run locally

This is a dependency-free static site. Serve the folder with any local HTTP server so browser fetch requests work:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Run the local Agent

From the root of a Git repository:

```bash
python3 skills/repo-museum/scripts/build_museum.py
```

This creates `.repo-museum/museum.json`. It uses only local Git and the Python standard library; it indexes the tracked HEAD tree, then reads the README, manifests, tags, and commit history. Text previews are capped at 60,000 characters and 2 MB of source. It does not push, publish, or upload repository contents. To inspect the generated collection in the local museum, serve the repository root and open:

```text
http://localhost:8000/?museum=.repo-museum%2Fmuseum.json
```

After generating a collection that should ship with the site, stage it as a public example:

```bash
mkdir -p collections
cp .repo-museum/museum.json collections/repo-museum.json
```

The repository intentionally carries `collections/repo-museum.json` as a reviewable Agent artifact and built-in fallback for Repo Museum itself. The Pages workflow still regenerates that collection from a full-history checkout at deploy time, overwrites the staged copy with the fresh Agent output, and publishes it alongside the renderer. Committing the baseline keeps the public demo inspectable in Git; deployment does not depend on a mutable untracked file.

The reusable skill instructions live in `skills/repo-museum/SKILL.md`. The renderer contract, including the optional `repositoryMap`, is documented in `schema/museum-data.schema.json`. Artifacts created before the atlas remain valid; when `repositoryMap` is absent, the optional Atlas exhibit is hidden. Artifacts with a `repositoryMap` but without `readingGuide` remain valid too; the Atlas builds the structural lens from the preview at runtime.

## Share a collection

Use a GitHub owner/repository or full GitHub URL, for example:

```text
https://strawberry-little-bear.github.io/repo-museum/?repo=vitejs%2Fvite
```

The share button copies the current collection URL. Built-in Agent collections share the artifact path; live scans share the repository identity. For `strawberry-little-bear/repo-museum`, the browser first loads the committed Agent collection instead of spending anonymous GitHub API calls on a live scan. Only public repositories are supported in this first release. Anonymous GitHub API limits and large repository sizes can affect the amount of evidence available to a live browser scan; the recovery form can retry with a tab-local read-only token.

The hosted project collection is available directly at:

```text
https://strawberry-little-bear.github.io/repo-museum/?museum=collections%2Frepo-museum.json
```

## Deploy

The workflow in `.github/workflows/deploy-pages.yml` deploys the repository to GitHub Pages whenever `main` changes. It checks out the full history, runs the Repo Museum skill, stages the static site under `_site`, and publishes the generated `collections/repo-museum.json` alongside the renderer. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

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

The public browser path intentionally uses transparent rule-based interpretation and public GitHub evidence. The local Agent can generate richer museum data from local Git history, tags, manifests, README, and repository structure. It emits shared `project`, `orientation`, `journey`, `architecture`, `repositoryMap`, `learning`, `events`, `dependencies`, `analysis`, and `sources` fields so the renderer stays shared. `repositoryMap.readOrder[].readingGuide` turns a suggested route into a file-level reading lens with declaration and import line evidence. `journey` explains a likely use path for a visitor who does not know the code; `architecture.flow` maps that path to visible repository areas; `learning.rooms` turns each exhibit into one discovery with an ordered evidence trail; `analysis.phases` explains the grouped natural-day arc and why its turning point was selected; `analysis.turningPointReason`, `analysis.distinctDates`, `analysis.excludedSameDayEvents`, and `analysis.coverage` keep the reading auditable. `analysis.discovery` carries the early cross-file finding, its evidence index, Atlas route, and evidence boundary. `analysis.arc[].lesson` and `analysis.historySummary` explain what the history teaches. Claims are evidence-backed and uncertain interpretations must be marked as such.

Built by `strawberry-little-bear`.
