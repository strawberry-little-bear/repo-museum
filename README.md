# Repo Museum

Repo Museum turns a repository into an evidence-backed interactive exhibition.

It has two entrances that share one museum data contract:

- **Public browser scan**: enter a public GitHub repository and the static site reads public API and manifest data in the browser.
- **Local Agent curation**: run the bundled `repo-museum` skill inside a local Git repository. It reads Git history, tags, the current tree, and manifests, then writes a reviewable `.repo-museum/museum.json` artifact.

It is a static, browser-first experience with a guided route through five connected rooms:

- **The foyer**: a plain-language answer to “what is this project for?” before the visitor sees code-shaped details.
- **Blueprint room**: an Agent or browser reading of top-level folders, important files, and likely entry points.
- **History hall**: release and commit markers arranged as a readable timeline, with a grounded origin / turning point / now arc.
- **Ecosystem room**: direct dependencies surfaced from common manifest files. It disappears when the public scan finds no specimens.
- **Workshop**: a small Web Audio pulse shaped by the repository's recent commit rhythm.

The visitor can switch between **Guided tour** and **Floor plan**. The guided route advances one question at a time; the floor plan lets an experienced visitor jump directly to a room. Claims remain linked to public GitHub evidence or the local Agent artifact.

The site does not upload repository contents or require a model API. The browser reads public GitHub endpoints and public manifest files directly. The local Agent stays local and emits the same data shape, including `orientation` and `architecture`, so deeper history can use the same renderer without turning the public site into a backend.

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

The public browser path intentionally uses transparent rule-based interpretation and public GitHub evidence. The local Agent can generate richer museum data from local Git history, tags, manifests, README, and repository structure. It emits shared `project`, `orientation`, `architecture`, `events`, `dependencies`, `analysis`, and `sources` fields so the renderer stays shared. Claims are evidence-backed and uncertain interpretations must be marked as such.

Built by `strawberry-little-bear`.
