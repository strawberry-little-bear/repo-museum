---
name: repo-museum
description: Curate a local Git repository into an evidence-backed Repo Museum collection. Use when the user asks to analyze a project, explain its evolution, generate museum data, or prepare a repository for the Repo Museum renderer.
---

# Repo Museum Agent

Turn a local repository into a small, evidence-backed learning exhibition. The output is not a quality score and must not invent intent. It should help a visitor who does not know the code understand what the project does, follow one likely use path, see which visible parts make that path possible, and explain what changed over time.

## Invocation

Use this skill when the user asks to:

- analyze a repository's history or architecture;
- generate Repo Museum data;
- explain a project's turning points;
- prepare a local project for the Repo Museum site.

## Workflow

1. Confirm the working directory is a Git repository. Do not inspect files outside it unless the user explicitly asks.
2. Read the repository's tracked `README`, manifest files, top-level tree, a recent history window, the earliest commits, tags, and available commit statistics. Use the README and tree to orient a non-technical visitor before describing architecture. Build the explanation in this order: foyer, first visitor, blueprint, history, ecosystem when dependencies are present, and exit workshop.
3. Run the bundled collector from the repository root:

   ```bash
   python3 skills/repo-museum/scripts/build_museum.py
   ```

   The collector writes `.repo-museum/museum.json`. It is deterministic, uses only the Python standard library and local Git, and does not upload repository contents.

4. Review the generated collection. Improve the narrative only with evidence from the repository. If an interpretation is uncertain, label it as an inference and include the supporting commit or file path.
5. Review `analysis.phases` before accepting the story. A phase is a grouped natural day, not a single commit. The origin and now phases are the first and last distinct days; a turning point must come from an interior day and must include a reason based on observed activity, structural language, change size, and nearby tag evidence. If there are fewer than three distinct days, keep the shorter arc rather than inventing a middle.
6. Keep `.repo-museum/museum.json` as the machine-readable artifact. Put human-authored notes in `.repo-museum/curator-notes.md` only when the user asks for them.
7. Tell the user which claims are directly observed and which are inferred. Never describe popularity, intent, stability, or impact as fact unless the repository contains evidence for it.

## Data contract

The artifact follows `schema/museum-data.schema.json` and is compatible with the Repo Museum browser renderer. The important fields are:

- `project`: repository identity and observed metadata;
- `events`: one marker per selected natural day, with grouped commit counts, tag markers, and evidence links;
- `dependencies`: direct dependencies with manifest paths;
- `orientation`: a plain-language “what is it / what is it for / how should I read it” guide, grounded in the README and description;
- `learning`: the visitor contract for the exhibition: the promise of the visit and one question, plain-language scene, technical reveal, discovery card, ordered evidence trail, takeaway, interaction hint, and confidence mode for each room;
- `journey`: a conservative, ordinary-language path from a person or caller to a result, with a technical translation and evidence reference for each step;
- `architecture`: top-level folders, important files, entry points, a `flow` that maps the journey to visible repository areas, and a short explanation of their observable roles;
- `analysis`: the Agent's evidence-backed thesis, signals, a grouped natural-day `phases` list, a three-part `arc`, a turning-point reason, distinct-day and same-day counts, sampled coverage, a history teaching summary, and an exit prompt;
- `sources`: every important claim's commit, tag, file, or command source.

The `analysis.phases` and `analysis.arc` normally contain three entries:

- **Origin**: the earliest distinct natural day in the sampled record;
- **Turning point**: an interior natural day selected by observable activity, structural-change language, change size, and nearby tag evidence;
- **Now**: the newest distinct natural day in the sampled record.

Each phase must include `start`, `end`, `title`, `summary`, `lesson`, `commitCount`, `reason`, `coverage`, and an evidence array whose entries state what each commit or tag supports. When only one or two distinct days exist, emit one chapter or origin-to-now instead of padding the arc. Never choose an endpoint date as the turning point.

Prefer concrete language such as “the repository added a Rust workspace after…” over vague language such as “the team matured.”

The `journey` is a teaching model, not a claim that the collector has executed the project. When runtime behavior is not directly observable from tracked files, say that the path is inferred and link to the README, manifest, tree area, or test/example evidence that motivated it.

The `learning.rooms` contract is part of the teaching experience, not decorative metadata. Every room should answer one question, reveal one specific thing a visitor could not have guessed from the lobby, and end with a concise takeaway. Use `discovery` for that single reveal, `scene` for the ordinary-language situation, `plain` for the first explanation, `reveal` for the technical reading, `whyItMatters` for the visitor's reason to remember it, and `interaction` for the renderer's small activity hint. Use `mode: observed` for facts directly visible in files or history, `mode: inferred` for a conservative teaching model, and `mode: mixed` when the room combines both. `evidenceTrail` must be ordered and every entry must point to a file, commit, tag, release, or other public source while naming the claim that source supports.

## Safety and privacy

- Work locally. The collector only invokes Git and reads files within the repository.
- Do not read secrets, credential files, or ignored files unless the user explicitly requests it.
- Do not publish, push, or modify application source code automatically.
- Do not add generated museum data to the index unless the user asks; `.repo-museum/` is intended to be reviewable local output.

