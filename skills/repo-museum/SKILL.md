---
name: repo-museum
description: Curate a local Git repository into an evidence-backed Repo Museum collection. Use when the user asks to analyze a project, explain its evolution, generate museum data, or prepare a repository for the Repo Museum renderer.
---

# Repo Museum Agent

Turn a local repository into a small, evidence-backed exhibition. The output is not a quality score and must not invent intent. It should make the project's evolution legible: where it began, what changed, what it depends on, and what is happening now.

## Invocation

Use this skill when the user asks to:

- analyze a repository's history or architecture;
- generate Repo Museum data;
- explain a project's turning points;
- prepare a local project for the Repo Museum site.

## Workflow

1. Confirm the working directory is a Git repository. Do not inspect files outside it unless the user explicitly asks.
2. Read the repository's tracked `README`, manifest files, top-level tree, recent and early commits, tags, and available commit statistics. Use the README and tree to orient a non-technical visitor before describing architecture.
3. Run the bundled collector from the repository root:

   ```bash
   python3 skills/repo-museum/scripts/build_museum.py
   ```

   The collector writes `.repo-museum/museum.json`. It is deterministic, uses only the Python standard library and local Git, and does not upload repository contents.

4. Review the generated collection. Improve the narrative only with evidence from the repository. If an interpretation is uncertain, label it as an inference and include the supporting commit or file path.
5. Keep `.repo-museum/museum.json` as the machine-readable artifact. Put human-authored notes in `.repo-museum/curator-notes.md` only when the user asks for them.
6. Tell the user which claims are directly observed and which are inferred. Never describe popularity, intent, stability, or impact as fact unless the repository contains evidence for it.

## Data contract

The artifact follows `schema/museum-data.schema.json` and is compatible with the Repo Museum browser renderer. The important fields are:

- `project`: repository identity and observed metadata;
- `events`: dated commits, tags, and releases with evidence links;
- `dependencies`: direct dependencies with manifest paths;
- `orientation`: a plain-language “what is it / what is it for / how should I read it” guide, grounded in the README and description;
- `architecture`: top-level folders, important files, entry points, and a short explanation of their observable roles;
- `analysis`: the Agent's evidence-backed thesis, signals, and three-part arc;
- `sources`: every important claim's commit, tag, file, or command source.

The `analysis.arc` should normally contain three entries:

- **Origin**: the earliest meaningful project record;
- **Turning point**: the strongest observable change in structure, scope, or cadence;
- **Now**: the newest state represented by the local history.

Prefer concrete language such as “the repository added a Rust workspace after…” over vague language such as “the team matured.”

## Safety and privacy

- Work locally. The collector only invokes Git and reads files within the repository.
- Do not read secrets, credential files, or ignored files unless the user explicitly requests it.
- Do not publish, push, or modify application source code automatically.
- Do not add generated museum data to the index unless the user asks; `.repo-museum/` is intended to be reviewable local output.

