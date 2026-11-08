# Repo Museum

Repo Museum turns a public GitHub repository into an interactive exhibition.

It is a static, browser-first experience with three connected exhibits:

- **Project archive**: project facts, language, license, stars, forks, contributors, and the latest public activity.
- **History hall**: release and commit markers arranged as a readable timeline.
- **Dependency aquarium**: direct dependencies surfaced from common manifest files.
- **Commit opera**: a small Web Audio score shaped by the repository's recent commit rhythm.

The site does not upload repository contents or require a model API. The browser reads public GitHub endpoints and the repository's public manifest files directly, then renders a shared museum data shape. A demo collection is available when the site first opens, so the experience is useful even before a repository is entered.

## Run locally

This is a dependency-free static site. Serve the folder with any local HTTP server so browser fetch requests work:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

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
app.js           GitHub collection, museum data mapping, interactions
favicon.svg      small archive mark
.github/         GitHub Pages deployment workflow
```

## Product boundary

The static site intentionally uses transparent rule-based interpretation. The future local Agent can generate richer museum data from local Git history, docs, and issues, but it should continue to emit the same broad project, events, dependencies, exhibits, and sources structure so the renderer can stay shared.

Built by `strawberry-little-bear`.
