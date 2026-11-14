#!/usr/bin/env python3
"""Build a deterministic, evidence-backed Repo Museum artifact from local Git."""

from __future__ import annotations

import html
import json
import re
import subprocess
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path.cwd()
OUTPUT = ROOT / ".repo-museum" / "museum.json"
MANIFEST_NAMES = ("package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod")


def run(*args: str) -> str:
    result = subprocess.run(["git", *args], cwd=ROOT, check=True, text=True, capture_output=True)
    return result.stdout.strip()


def maybe_run(*args: str) -> str:
    result = subprocess.run(["git", *args], cwd=ROOT, check=False, text=True, capture_output=True)
    return result.stdout.strip() if result.returncode == 0 else ""


def git_url() -> str | None:
    remote = maybe_run("config", "--get", "remote.origin.url")
    if not remote:
        return None
    remote = re.sub(r"^git@github\.com:", "https://github.com/", remote)
    remote = re.sub(r"^https?://github\.com/", "https://github.com/", remote)
    return remote.removesuffix(".git").rstrip("/")


def repo_slug(url: str | None) -> str:
    if not url:
        return ROOT.name
    return url.removeprefix("https://github.com/")


def parse_commit_lines(raw: str) -> list[dict[str, Any]]:
    commits: list[dict[str, Any]] = []
    for line in raw.splitlines():
        parts = line.split("\x1f", 4)
        if len(parts) != 5:
            continue
        sha, short_sha, date, author, subject = parts
        commits.append({"sha": sha, "shortSha": short_sha, "date": date, "author": author, "subject": subject})
    return commits


def parse_commits(limit: int = 160, earliest: int = 40) -> list[dict[str, Any]]:
    """Load a recent window plus the earliest records, then deduplicate by SHA."""
    fmt = "--format=%H%x1f%h%x1f%ad%x1f%an%x1f%s"
    recent = parse_commit_lines(run("log", f"-{limit}", "--date=iso-strict", fmt))
    try:
        total = int(maybe_run("rev-list", "--count", "HEAD") or "0")
    except ValueError:
        total = 0
    # `git log --reverse -40` still selects the newest 40 before reversing.
    # Skip into the oldest part of the graph explicitly so the origin is real.
    skip = max(0, total - earliest)
    old = parse_commit_lines(run("log", f"--skip={skip}", f"-{earliest}", "--date=iso-strict", fmt)) if earliest and total else []
    seen: set[str] = set()
    commits = []
    for commit in [*recent, *old]:
        if commit["sha"] in seen:
            continue
        seen.add(commit["sha"])
        commits.append(commit)
    return sorted(commits, key=lambda item: item["date"], reverse=True)


@lru_cache(maxsize=512)
def commit_stats(sha: str) -> dict[str, int]:
    # Partial or shallow clones can reject an individual historical object.
    # Treat that as missing evidence instead of aborting the entire collection.
    raw = maybe_run("show", "--numstat", "--format=", sha)
    added = deleted = files = 0
    for line in raw.splitlines():
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        try:
            added += int(parts[0])
            deleted += int(parts[1])
        except ValueError:
            continue
        files += 1
    return {"additions": added, "deletions": deleted, "files": files}


def tree_files() -> list[str]:
    return [item for item in run("ls-tree", "-r", "--name-only", "HEAD").splitlines() if item]


def read_tracked_text(path: str, limit: int = 120_000) -> str:
    if path not in set(tree_files()):
        return ""
    try:
        raw = run("show", f"HEAD:{path}")
    except Exception:
        return ""
    return raw[:limit]


def strip_markdown_inline(text: str) -> str:
    """Turn one Markdown line into readable prose without exposing its syntax."""
    text = re.sub(r"<!--[\s\S]*?-->", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\[[^\]]*\]", r"\1", text)
    # Reference-style links often leave an orphan label such as ``[WSGI]``
    # after their URL definition is removed. Keep the prose, not the syntax.
    text = re.sub(r"\[([^\[\]\n]{1,120})\]", r"\1", text)
    text = re.sub(r"<https?://[^>]+>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[`*_~]+", "", text)
    text = re.sub(r"\\([\[\]()#*_`])", r"\1", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def markdown_paragraphs(markdown: str) -> list[str]:
    """Extract prose paragraphs while ignoring headings, badges, lists, and code."""
    if not markdown:
        return []
    lines = markdown.replace("\r\n", "\n").replace("\r", "\n").splitlines()
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() in {"---", "..."}:
                lines = lines[index + 1 :]
                break
    paragraphs: list[str] = []
    current: list[str] = []
    in_fence = False

    def flush() -> None:
        nonlocal current
        candidate = re.sub(r"\s+", " ", " ".join(current)).strip()
        current = []
        if candidate and re.search(r"\w", candidate):
            paragraphs.append(candidate)

    for line in lines:
        stripped = line.strip()
        if re.match(r"^(`{3,}|~{3,})", stripped):
            flush()
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if not stripped:
            flush()
            continue
        if re.match(r"^\s{0,3}#{1,6}\s+", line):
            flush()
            continue
        if re.match(r"^\s*\[[^\]]+\]:\s*\S+", line):
            continue
        if re.match(r"^\s*(?:[-+*]|\d+[.)])\s+", line):
            continue
        if re.match(r"^\s*(?:\|.*\|?|[-:_]{3,})\s*$", line):
            continue
        if re.match(r"^\s*\[?!\[|<img\b", stripped, re.I):
            continue
        cleaned = strip_markdown_inline(re.sub(r"^\s*>\s?", "", stripped))
        if not cleaned or not re.search(r"[A-Za-z\u4e00-\u9fff]", cleaned):
            continue
        current.append(cleaned)
    flush()
    return paragraphs


def plain_text(markdown: str) -> str:
    return " ".join(markdown_paragraphs(markdown))


def clip_sentence(text: str, limit: int = 240) -> str:
    text = re.sub(r"\s+", " ", strip_markdown_inline(text)).strip()
    if not text:
        return ""
    match = re.search(r"[^.!?]{12,}[.!?](?:\s|$)", text)
    clipped = match.group(0).strip() if match else text
    if len(clipped) <= limit:
        return clipped
    shortened = clipped[: limit - 1].rsplit(" ", 1)[0].rstrip(" ,;:")
    return f"{shortened}…"


def description_from_readme(markdown: str, limit: int = 240) -> str:
    """Select the first credible prose paragraph, never the README's title."""
    for paragraph in markdown_paragraphs(markdown):
        words = re.findall(r"[A-Za-z0-9\u4e00-\u9fff]+", paragraph)
        if len(words) < 3 and len(paragraph) < 18:
            continue
        if re.match(r"^(table of contents|contents|installation|install|usage|license|contributing)$", paragraph, re.I):
            continue
        return clip_sentence(paragraph, limit)
    return ""


def read_readme(files: list[str]) -> tuple[str, str | None]:
    candidates = [path for path in files if path.lower() in {"readme", "readme.md", "readme.rst", "readme.txt"}]
    if not candidates:
        candidates = [path for path in files if Path(path).name.lower().startswith("readme")][:1]
    if not candidates:
        return "", None
    return read_tracked_text(candidates[0]), candidates[0]


IMPLEMENTATION_FOLDERS = {
    "src", "lib", "app", "apps", "packages", "package", "server", "backend", "api",
    "core", "client", "web", "frontend", "ui", "components", "modules", "routes",
    "handlers", "models", "services", "skills", "schema", "schemas", "migrations",
}
LEARNING_FOLDERS = {"docs", "doc", "website", "site", "examples", "example", "demo", "playground", "tests", "test", "spec", "__tests__", "e2e", "benchmarks", "benchmark", "fixtures"}
SUPPORT_FOLDERS = {"scripts", "tools", "bin", "config", "configs", "assets", "public", "static", "styles", ".github", ".repo-museum", ".vscode", ".idea"}
GENERATED_FOLDERS = {"node_modules", "vendor", "dist", "build", "coverage", "__pycache__", ".cache"}


def role_for_path(path: str, is_folder: bool = False) -> str:
    name = path.lower().strip("/")
    if is_folder:
        if name in {"src"}:
            return "Where the main implementation lives"
        if name in {"lib"}:
            return "Reusable implementation code"
        if name in {"app", "apps"}:
            return "The application composition layer"
        if name in {"packages", "package"}:
            return "Separate packages maintained in one workspace"
        if name in {"server", "backend"}:
            return "The server-side boundary"
        if name in {"api"}:
            return "The public request and response surface"
        if name in {"client", "web", "frontend", "ui"}:
            return "The visitor-facing application layer"
        if name in {"components", "modules"}:
            return "Reusable building blocks for the implementation"
        if name in {"routes", "handlers"}:
            return "Where incoming requests are routed"
        if name in {"models"}:
            return "The project's data model"
        if name in {"core"}:
            return "Core behavior shared across the project"
        if name in {"services"}:
            return "Service-level behavior and integrations"
        if name == "skills":
            return "Agent instructions and reusable tooling"
        if name in {"schema", "schemas"}:
            return "Shared data contracts"
        if name in {"migrations"}:
            return "Recorded data-model changes"
        if name in {"test", "tests", "spec", "__tests__", "e2e"}:
            return "Where behavior is checked"
        if name in {"docs", "doc", "website", "site"}:
            return "Where people learn how to use it"
        if name in {"examples", "example", "playground", "demo"}:
            return "Small spaces for trying the project"
        if name in {"scripts", "tools", "bin"}:
            return "Utilities that support the project workflow"
        if name in {"config", "configs"}:
            return "Project-wide configuration"
        if name in {"assets", "public", "static"}:
            return "Assets delivered with the project"
        if name in {"benchmarks", "benchmark"}:
            return "Measured performance scenarios"
        if name in {"fixtures"}:
            return "Controlled inputs for checks and examples"
        if name == ".github":
            return "Automation and publishing metadata"
        if name == ".repo-museum":
            return "Generated museum artifacts"
        if name.startswith("."):
            return "Repository metadata and local tooling"
        return "A tracked top-level area whose role is not stated by its name"
    basename = Path(name).name
    if basename.startswith("readme"):
        return "The project's public introduction"
    if basename in MANIFEST_NAMES:
        return "Project instructions and dependencies"
    if basename in {"package-lock.json", "pnpm-lock.yaml", "yarn.lock", "cargo.lock", "uv.lock", "poetry.lock"}:
        return "Dependency and workspace rules"
    if re.search(r"(^|[._-])(test|spec)s?[._-]", name):
        return "A check for expected behavior"
    if re.match(r"(vite|vitest|jest|eslint|tsconfig|webpack|rollup|tailwind|prettier)", name):
        return "A configuration point for the toolchain"
    if basename.startswith("."):
        return "Repository metadata and local tooling"
    stem = Path(basename).stem.lower()
    if basename == "index.html":
        return "The browser document entry point"
    if basename in {"app.js", "app.mjs", "app.ts", "app.tsx"}:
        return "A root application script"
    if basename in {"main.js", "main.mjs", "main.ts", "main.tsx", "main.py", "cli.py", "__main__.py"}:
        return "A root command or application entry point"
    if basename.endswith(".css"):
        return "The visual presentation layer"
    if stem in {"server", "api", "routes"}:
        return "A visible server or request surface"
    if basename.endswith(".py"):
        return "A tracked Python source file"
    if basename.endswith((".js", ".mjs", ".cjs")):
        return "A tracked JavaScript source file"
    if basename.endswith((".ts", ".tsx")):
        return "A tracked TypeScript source file"
    if basename.endswith((".html", ".css")):
        return "A tracked web presentation file"
    if basename.endswith((".json", ".yaml", ".yml", ".toml")):
        return "A tracked configuration or data file"
    if basename.endswith(".md"):
        return "A tracked project document"
    return "A tracked file in the current project tree"


def natural_list(items: list[str]) -> str:
    clean = [item for item in items if item]
    if not clean:
        return ""
    if len(clean) == 1:
        return clean[0]
    if len(clean) == 2:
        return f"{clean[0]} and {clean[1]}"
    return f"{', '.join(clean[:-1])}, and {clean[-1]}"


def folder_priority(name: str) -> int:
    lower = name.lower()
    if lower in IMPLEMENTATION_FOLDERS:
        return 0
    if lower in LEARNING_FOLDERS:
        return 1
    if lower in SUPPORT_FOLDERS or lower.startswith("."):
        return 4
    return 2


def is_support_folder(name: str) -> bool:
    return folder_priority(name) >= 4


def build_orientation(description: str, readme: str, language: str) -> dict[str, str]:
    readable = plain_text(readme)
    first_sentence = re.search(r"[^.!?]{20,220}[.!?]", readable)
    introduction = clip_sentence(description) or (first_sentence.group(0).strip() if first_sentence else "")
    if not introduction:
        introduction = f"A {language} project whose public record is still being read."
    return {
        "what": f"{introduction} The visible stack is {language}.",
        "oneLine": introduction,
        "use": clip_sentence(readable, 240) if readable else f"Explore the repository's {language} code and public history.",
        "how": "Read the introduction, then move through the tree and history to see how the project is assembled." if readable else "Start with the visible tree, then use commits and manifests to understand how it is assembled.",
        "outcome": "what this project does, how a request moves through it, and why its history matters.",
        "example": "Start with an ordinary person using the project. The next room follows that action through the repository.",
        "guide": "The orientation begins with the README and description, then points to structure and history." if readable else "The orientation is a rule-based reading of the local repository record.",
        "sourceNote": "Based on the tracked README and repository description." if readable else "Based on the repository description; no readable README paragraph was available.",
    }


def build_journey(files: list[str], readme_path: str | None, manifest_path: str | None, architecture: dict[str, Any]) -> dict[str, Any]:
    evidence = readme_path or manifest_path or architecture.get("files", [{}])[0].get("evidence") or "README.md"
    entry_point = next(iter(architecture.get("entrypoints", [])), None) or manifest_path or evidence
    main_area = next(
        (
            item["evidence"]
            for item in architecture.get("folders", [])
            if not is_support_folder(item.get("name", "")) and folder_priority(item.get("name", "")) <= 2
        ),
        None,
    )
    result_area = next((item["evidence"] for item in architecture.get("folders", []) if item.get("name", "").lower() in LEARNING_FOLDERS), None)
    return {
        "intro": "Before reading source code, follow one ordinary request from the person using the project to the result they receive. The repository is the machinery between those two moments.",
        "summary": "An input enters, the project transforms or coordinates it, and a result comes back. This is a teaching model inferred from the tracked tree and public project documents.",
        "steps": [
            {"number": "01", "label": "A person starts", "title": "The request begins outside the code", "plain": "Someone gives the project an input, opens it, or runs one of its commands.", "technical": "The README and visible entry files describe the first boundary into the system.", "evidence": evidence},
            {"number": "02", "label": "The project receives it", "title": "An entry point accepts the request", "plain": "One visible part of the repository is responsible for receiving that action.", "technical": "Scripts, commands, routes, or exported modules form the project's entry surface.", "evidence": entry_point},
            {"number": "03", "label": "The work happens", "title": "The project coordinates its parts", "plain": "The request moves through the main implementation and any supporting tools it needs.", "technical": "The source tree and dependency manifest reveal the components involved.", "evidence": main_area or manifest_path or evidence},
            {"number": "04", "label": "A result returns", "title": "The project produces something useful", "plain": "The person receives a page, file, answer, transformation, or other result.", "technical": "Examples, tests, and public documentation are the strongest visible clues about the output.", "evidence": result_area or readme_path or evidence},
            {"number": "05", "label": "The project is maintained", "title": "The loop starts again", "plain": "People change the project, release new versions, and keep the path working.", "technical": "Git history, manifests, and release markers show how the system continues to evolve.", "evidence": manifest_path or readme_path or evidence},
        ],
        "glossary": [
            {"term": "entry point", "plain": "A place where a person, command, or another program enters the project."},
            {"term": "implementation", "plain": "The part that performs the project's main work."},
            {"term": "dependency", "plain": "A capability the project borrows instead of building itself."},
        ],
        "sourceNote": "Teaching path inferred from the tracked README, visible tree, manifest, and Git history. It explains a likely path without claiming hidden runtime behavior.",
    }


def build_architecture(files: list[str], manifest_path: str | None, readme_path: str | None, language: str) -> dict[str, Any]:
    folder_counts: dict[str, int] = {}
    for path in files:
        if "/" not in path:
            continue
        folder = path.split("/", 1)[0]
        if folder.lower() in GENERATED_FOLDERS:
            continue
        folder_counts[folder] = folder_counts.get(folder, 0) + 1
    folders = [
        {"name": folder, "role": role_for_path(folder, True), "evidence": folder, "fileCount": count}
        for folder, count in folder_counts.items()
    ]
    folders = sorted(folders, key=lambda item: (folder_priority(item["name"]), -item["fileCount"], item["name"].lower()))[:10]
    working_folders = [item for item in folders if not is_support_folder(item["name"])]

    root_files = [path for path in files if "/" not in path]
    source_suffixes = (".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".rs", ".go", ".rb", ".java", ".html")
    entrypoint_names = re.compile(r"^(main|app|cli|server|index|__main__|manage|bin)(\.|$)", re.I)
    entry_candidates = [path for path in root_files if entrypoint_names.match(path) or path in {"app.py", "index.html"}]
    entry_candidates += [path for path in root_files if path.endswith(source_suffixes) and path not in entry_candidates]
    config_candidates = [path for path in root_files if re.search(r"workspace|config|lock|test|spec", path, re.I)]
    interesting = list(dict.fromkeys(
        [path for path in [readme_path, manifest_path] if path]
        + entry_candidates[:4]
        + config_candidates[:4]
    ))
    file_items = [{"name": path, "role": role_for_path(path), "evidence": path} for path in interesting[:10]]
    entrypoints = entry_candidates[:3] or ([manifest_path] if manifest_path else ([readme_path] if readme_path else []))
    main_folder = next((item for item in working_folders if item["name"].lower() in IMPLEMENTATION_FOLDERS), None)
    result_folder = next((item for item in working_folders if item["name"].lower() in LEARNING_FOLDERS), None)
    implementation_files = [
        item for item in file_items
        if re.search(r"source file|application script|application entry point|document entry point|presentation layer|server or request surface", item.get("role", ""), re.I)
    ]
    implementation_paths = [item["name"] for item in implementation_files[:2]]
    working_names = [item["name"] for item in working_folders[:3]]
    leading_paths = list(dict.fromkeys([*implementation_paths, *working_names]))
    if leading_paths:
        summary = f"{language} project whose visible working paths lead through {natural_list(leading_paths)}."
    else:
        summary = f"{language} project whose work is visible mainly through its tracked files."
    return {
        "summary": summary,
        "flow": [
            {"label": "Person or caller", "role": "Where the request begins", "detail": "A user, command, or another system gives the project something to do.", "evidence": readme_path or "README.md"},
            {"label": "Entry point", "role": "The front door", "detail": "A tracked source file or command surface is the clearest visible boundary into the project.", "evidence": entrypoints[0] if entrypoints else manifest_path or readme_path or "README.md"},
            {"label": "Main implementation", "role": "Where the work happens", "detail": "The most legible implementation-named area coordinates the project's main behavior.", "evidence": main_folder["evidence"] if main_folder else entrypoints[0] if entrypoints else readme_path or "README.md"},
            {"label": "Supporting tools", "role": "Capabilities the project borrows", "detail": "Dependencies and configuration fill in the parts the repository does not build alone.", "evidence": manifest_path or (file_items[0]["evidence"] if file_items else readme_path or "README.md")},
            {"label": "Result", "role": "What comes back", "detail": "Documentation, examples, tests, or the public description show the project's output.", "evidence": result_folder["evidence"] if result_folder else readme_path or manifest_path or "README.md"},
        ],
        "folders": folders,
        "files": file_items,
        "entrypoints": entrypoints,
        "sourceNote": "Roles are inferred from tracked names and paths; each item links back to the file or directory that supports the reading.",
    }


def read_manifest(path: str) -> tuple[list[dict[str, str]], dict[str, Any]]:
    file_path = ROOT / path
    if not file_path.is_file() or file_path.stat().st_size > 512_000:
        return [], {}
    text = file_path.read_text(encoding="utf-8", errors="replace")
    if path == "package.json":
        try:
            package = json.loads(text)
        except json.JSONDecodeError:
            return [], {}
        entries = []
        for section, kind in (("dependencies", "runtime"), ("optionalDependencies", "optional"), ("peerDependencies", "optional"), ("devDependencies", "build")):
            for name, version in list((package.get(section) or {}).items())[:20]:
                entries.append({"name": name, "version": str(version), "type": kind, "sourcePath": path})
        return entries, {"name": package.get("name"), "description": package.get("description")}

    if path in {"pyproject.toml", "Cargo.toml"}:
        return read_toml_manifest(text, path)

    entries: list[dict[str, str]] = []
    if path == "requirements.txt":
        for line in text.splitlines():
            candidate = re.split(r"\s+#", line, maxsplit=1)[0].strip()
            if not candidate or candidate.startswith(("-", "#", "git+", "http://", "https://")):
                continue
            name, version = split_dependency_spec(candidate)
            if name:
                entries.append({"name": name, "version": version or "declared", "type": "runtime", "sourcePath": path})
    elif path == "go.mod":
        in_require_block = False
        for line in text.splitlines():
            stripped = line.split("//", 1)[0].strip()
            if stripped.startswith("require ("):
                in_require_block = True
                continue
            if in_require_block and stripped == ")":
                in_require_block = False
                continue
            if stripped.startswith("require "):
                stripped = stripped.removeprefix("require ").strip()
            elif not in_require_block:
                continue
            parts = stripped.split()
            if len(parts) >= 2 and "/" in parts[0]:
                entries.append({"name": parts[0], "version": parts[1], "type": "runtime", "sourcePath": path})
    return dedupe_dependencies(entries)[:20], {}


def split_dependency_spec(spec: str) -> tuple[str, str]:
    """Extract a package name and visible constraint from a PEP 508-style string."""
    value = spec.strip().strip("\"'")
    value = re.split(r"\s*;\s*", value, maxsplit=1)[0].strip()
    match = re.match(r"^([A-Za-z0-9][A-Za-z0-9_.-]*)", value)
    if not match:
        return "", ""
    name = match.group(1)
    remainder = value[match.end():].strip()
    remainder = re.sub(r"^\[[^\]]*\]", "", remainder).strip()
    version = remainder
    if remainder.startswith("@"):
        version = remainder[1:].strip()
    elif remainder:
        constraint = re.search(r"(?:===|==|~=|!=|<=|>=|<|>)\s*([^,\s]+)", remainder)
        version = constraint.group(1) if constraint else remainder
    return name, version or "declared"


def toml_assignment_records(text: str) -> list[tuple[str, str, str]]:
    """Read section/key/value triples from dependency-focused TOML without a TOML dependency."""
    records: list[tuple[str, str, str]] = []
    section = ""
    lines = text.splitlines()
    index = 0
    while index < len(lines):
        line = lines[index]
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            index += 1
            continue
        header = re.match(r"^\[([^\[\]]+)\]\s*(?:#.*)?$", stripped)
        if header:
            section = header.group(1).strip()
            index += 1
            continue
        assignment = re.match(r"^\s*(?:\"([^\"]+)\"|'([^']+)'|([A-Za-z0-9_.-]+))\s*=\s*(.*)$", line)
        if not assignment:
            index += 1
            continue
        key = next(group for group in assignment.groups()[:3] if group is not None)
        value = assignment.group(4)
        while not toml_value_complete(value) and index + 1 < len(lines):
            index += 1
            value += "\n" + lines[index]
        records.append((section, key, value.strip()))
        index += 1
    return records


def toml_value_complete(value: str) -> bool:
    square = curly = 0
    quote = ""
    escaped = False
    for character in value:
        if quote:
            if escaped:
                escaped = False
            elif character == "\\" and quote == '"':
                escaped = True
            elif character == quote:
                quote = ""
            continue
        if character in {'"', "'"}:
            quote = character
        elif character == "[":
            square += 1
        elif character == "]":
            square -= 1
        elif character == "{":
            curly += 1
        elif character == "}":
            curly -= 1
    return square <= 0 and curly <= 0 and not quote


def toml_string_value(value: str) -> str:
    match = re.match(r"^\s*[\"']([^\"']*)[\"']", value)
    return html.unescape(match.group(1)) if match else ""


def strings_in_toml_value(value: str) -> list[str]:
    return [html.unescape(item) for item in re.findall(r"[\"']([^\"']+)[\"']", value)]


def dependency_section_kind(path: str, section: str, key: str) -> str | None:
    if path == "Cargo.toml":
        if section == "workspace.dependencies":
            return None
        if section.startswith("dependencies."):
            return "runtime" if key in {"version", "workspace"} else None
        if section.startswith("dev-dependencies."):
            return "build" if key in {"version", "workspace"} else None
        if section.startswith("build-dependencies."):
            return "build" if key in {"version", "workspace"} else None
        if section == "dependencies" or section.endswith(".dependencies"):
            return "runtime"
        if section == "dev-dependencies" or section.endswith(".dev-dependencies"):
            return "build"
        if section == "build-dependencies" or section.endswith(".build-dependencies"):
            return "build"
        return None
    if path != "pyproject.toml":
        return None
    if section == "project" and key == "dependencies":
        return "runtime"
    if section == "project.optional-dependencies":
        return "optional"
    if section == "build-system" and key == "requires":
        return "build"
    if section == "tool.poetry.dependencies":
        return "runtime"
    if section == "tool.poetry.dev-dependencies":
        return "build"
    if section.startswith("tool.poetry.group.") and section.endswith(".dependencies"):
        return "build"
    return None


def dedupe_dependencies(entries: list[dict[str, str]]) -> list[dict[str, str]]:
    unique: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for item in entries:
        name = item.get("name", "").strip()
        if not name:
            continue
        key = (name.lower(), item.get("type", "runtime"))
        if key in seen:
            continue
        seen.add(key)
        unique.append({**item, "name": name})
    return unique


def read_toml_manifest(text: str, path: str) -> tuple[list[dict[str, str]], dict[str, Any]]:
    records = toml_assignment_records(text)
    entries: list[dict[str, str]] = []
    meta: dict[str, Any] = {}
    for section, key, value in records:
        if (path == "pyproject.toml" and section in {"project", "tool.poetry"}) or (path == "Cargo.toml" and section == "package"):
            if key in {"name", "description"} and not meta.get(key):
                meta[key] = toml_string_value(value)
        kind = dependency_section_kind(path, section, key)
        if not kind:
            continue
        if path == "Cargo.toml":
            nested = re.match(r"^(?:dev-|build-)?dependencies\.(.+)$", section)
            if nested:
                version = "workspace" if key == "workspace" else (toml_string_value(value) or "declared")
                entries.append({"name": nested.group(1), "version": version, "type": kind, "sourcePath": path})
                continue
            if key.endswith(".workspace"):
                entries.append({"name": key.removesuffix(".workspace"), "version": "workspace", "type": kind, "sourcePath": path})
                continue
            version = toml_string_value(value)
            if not version:
                version_match = re.search(r"(?:^|[,{]\s*)version\s*=\s*[\"']([^\"']+)", value)
                version = version_match.group(1) if version_match else ""
            entries.append({"name": key, "version": version or "declared", "type": kind, "sourcePath": path})
            continue
        for spec in strings_in_toml_value(value):
            name, version = split_dependency_spec(spec)
            if name:
                entries.append({"name": name, "version": version, "type": kind, "sourcePath": path})
    return dedupe_dependencies(entries)[:20], meta


def natural_day(commit: dict[str, Any]) -> str:
    return str(commit.get("date", ""))[:10]


def group_commits_by_day(commits: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Collapse commits into natural days so one busy day is one museum marker."""
    groups: dict[str, list[dict[str, Any]]] = {}
    for commit in commits:
        day = natural_day(commit)
        if day:
            groups.setdefault(day, []).append(commit)
    return [
        {"date": day, "commits": sorted(items, key=lambda item: item["date"])}
        for day, items in sorted(groups.items())
    ]


def date_distance(left: str, right: str) -> int:
    try:
        left_date = datetime.fromisoformat(left[:10])
        right_date = datetime.fromisoformat(right[:10])
        return abs((left_date - right_date).days)
    except ValueError:
        return 9999


def tag_records() -> list[dict[str, str]]:
    raw = maybe_run(
        "for-each-ref",
        "--sort=-creatordate",
        "--format=%(refname:strip=2)|%(creatordate:iso-strict)",
        "refs/tags",
    )
    records = []
    for line in raw.splitlines():
        parts = line.split("|", 1)
        if len(parts) != 2 or not parts[0] or not parts[1]:
            continue
        records.append({"tag": parts[0], "date": parts[1][:10], "ref": parts[0], "label": parts[0]})
    return records


def nearest_tag(tags: list[dict[str, str]], day: str) -> dict[str, str] | None:
    candidates = [(date_distance(item["date"], day), item) for item in tags if item.get("date")]
    within_window = [entry for entry in candidates if entry[0] <= 3]
    return sorted(within_window, key=lambda entry: (entry[0], entry[1]["tag"]))[0][1] if within_window else None


def day_stats(day: dict[str, Any]) -> dict[str, int]:
    total = {"commits": len(day["commits"]), "files": 0, "additions": 0, "deletions": 0}
    for commit in day["commits"]:
        stats = commit_stats(commit["sha"])
        total["files"] += stats["files"]
        total["additions"] += stats["additions"]
        total["deletions"] += stats["deletions"]
    return total


def structural_subjects(day: dict[str, Any]) -> list[str]:
    pattern = r"\b(breaking|rewrite|refactor|migrat|architecture|workspace|monorepo|plugin|typescript|esm|api|release|major)\b"
    return [commit["subject"] for commit in day["commits"] if re.search(pattern, commit["subject"], re.I)]


def select_turning_day(days: list[dict[str, Any]], tags: list[dict[str, str]]) -> dict[str, Any] | None:
    """Pick an interior natural day; endpoints can never masquerade as a turning point."""
    if len(days) <= 2:
        return None
    middle = days[1:-1]
    scored = []
    for index, day in enumerate(middle, start=1):
        stats = day_stats(day)
        structural = structural_subjects(day)
        release = nearest_tag(tags, day["date"])
        centrality = min(index, len(days) - index - 1)
        score = (
            len(structural) * 7
            + min(stats["commits"], 12) * 3
            + min((stats["additions"] + stats["deletions"]) // 40, 10)
            + min(stats["files"], 10)
            + (10 if release else 0)
            + min(centrality, 6)
        )
        observations = [
            f"{stats['commits']} commit{'s' if stats['commits'] != 1 else ''} share this day",
            f"{len(structural)} subject{'s' if len(structural) != 1 else ''} use structural-change language" if structural else "no subject uses structural-change language",
            f"tag {release['tag']} is within three days" if release else "no nearby tag is visible in the local sample",
        ]
        scored.append({
            "day": day,
            "stats": stats,
            "structural": structural,
            "release": release,
            "score": score,
            "reason": f"Selected from {len(middle)} interior natural day{'s' if len(middle) != 1 else ''}: " + "; ".join(observations) + ".",
        })
    return sorted(scored, key=lambda item: (-item["score"], item["day"]["date"]))[0]


def evidence_item(item_type: str, ref: str, label: str, claim: str) -> dict[str, str]:
    return {"type": item_type, "ref": ref, "label": label, "claim": claim}


def dedupe_evidence(items: list[dict[str, Any]], limit: int | None = None) -> list[dict[str, Any]]:
    """Keep ordered evidence unique by source, not by its display label."""
    unique: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for item in items:
        ref = str(item.get("ref") or "").strip()
        if not ref:
            continue
        key = (str(item.get("type") or "file"), ref)
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return unique[:limit] if limit is not None else unique


def build_phases(days: list[dict[str, Any]], tags: list[dict[str, str]], coverage: str) -> list[dict[str, Any]]:
    if not days:
        return []

    def phase_for(day: dict[str, Any], role: str, label: str) -> dict[str, Any]:
        if role == "origin":
            representative = day["commits"][0]
        elif role == "turning":
            non_merge = [commit for commit in day["commits"] if not commit["subject"].lower().startswith("merge ")]
            candidates = non_merge or day["commits"]
            representative = max(
                candidates,
                key=lambda commit: (
                    1 if re.search(r"\b(breaking|rewrite|refactor|migrat|architecture|workspace|monorepo|plugin|typescript|esm|api|release|major)\b", commit["subject"], re.I) else 0,
                    sum(commit_stats(commit["sha"]).values()),
                ),
            )
        else:
            representative = day["commits"][-1]
        release = nearest_tag(tags, day["date"]) if role == "turning" else None
        subject = representative["subject"]
        author = representative["author"]
        count = len(day["commits"])
        if role == "origin":
            reason = f"The earliest natural day in the sampled record has {count} commit{'s' if count != 1 else ''}; it is represented once."
            lesson = "Treat this as the start of the visible record, not proof that no earlier work exists."
        elif role == "now":
            reason = f"The newest natural day in the sampled record has {count} commit{'s' if count != 1 else ''}; it is represented once."
            lesson = "This shows what the sampled record was doing most recently, not a complete measure of project health."
        else:
            reason = "Chosen from interior natural days by grouped activity, structural-change language, change size, and nearby tag evidence."
            lesson = "This is an evidence-backed reading of where the sampled history moves most legibly; it does not establish private intent."
        claim = lesson
        phase_evidence = [evidence_item("commit", representative["sha"], representative["shortSha"], claim)]
        if release:
            phase_evidence.append(evidence_item(
                "release",
                release["tag"],
                release["tag"],
                f"A public tag marker falls within three days of this natural day ({release['date']}).",
            ))
        return {
            "id": "record" if role == "now" and len(days) == 1 else role,
            "label": label,
            "role": role,
            "start": day["date"],
            "end": day["date"],
            "title": subject[:72],
            "summary": f"{author} recorded “{subject[:110]}” on {day['date']}. {count} commit{'s' if count != 1 else ''} from this natural day {'is' if count == 1 else 'are'} grouped behind one chapter.",
            "lesson": lesson,
            "commitCount": count,
            "reason": reason,
            "evidence": phase_evidence,
            "coverage": coverage,
        }

    if len(days) == 1:
        return [phase_for(days[0], "now", "Visible record")]
    origin = phase_for(days[0], "origin", "Origin")
    now = phase_for(days[-1], "now", "Now")
    if len(days) == 2:
        return [origin, now]
    turning = select_turning_day(days, tags)
    if not turning:
        return [origin, now]
    turn = phase_for(turning["day"], "turning", "Turning point")
    turn["reason"] = turning["reason"]
    turn["evidence"][0]["claim"] = turning["reason"]
    return [origin, turn, now]


def build_daily_events(days: list[dict[str, Any]], tags: list[dict[str, str]], phases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not days:
        return []
    selected_dates = {phase["start"] for phase in phases}
    selected_dates.update(day["date"] for day in days[-5:])
    selected_dates.add(days[0]["date"])
    by_day = {day["date"]: day for day in days}
    phase_by_day = {phase["start"]: phase for phase in phases}
    tags_by_day: dict[str, list[dict[str, str]]] = {}
    for tag in tags:
        tags_by_day.setdefault(tag["date"], []).append(tag)
    events = []
    for date in sorted(selected_dates, reverse=True)[:8]:
        day = by_day.get(date)
        day_tags = tags_by_day.get(date, [])
        phase = phase_by_day.get(date)
        representative = day["commits"][-1] if day else None
        if representative:
            stats = commit_stats(representative["sha"])
            count = len(day["commits"])
            meta = f"{count} commit{'s' if count != 1 else ''} grouped · latest by {representative['author']} · {stats['files']} files touched"
            if day_tags:
                meta += " · tags " + ", ".join(item["tag"] for item in day_tags)
            source = {"type": "commit", "ref": representative["sha"], "label": representative["shortSha"]}
            title = representative["subject"][:72]
            sha = representative["shortSha"]
        else:
            tag = day_tags[0]
            meta = f"Release marker · {tag['tag']}"
            source = {"type": "release", "ref": tag["tag"], "label": tag["tag"]}
            title = f"Tag {tag['tag']}"
            sha = tag["tag"]
        events.append({
            "date": date,
            "title": title,
            "meta": meta,
            "sha": sha,
            "kind": "origin" if phase and phase["role"] == "origin" else ("release" if day_tags else "commit"),
            "groupCount": len(day["commits"]) if day else 1,
            "releaseTags": [item["tag"] for item in day_tags],
            "source": source,
        })
    return events


def build_pulse(days: list[dict[str, Any]], tags: list[dict[str, str]], html_url: str | None) -> list[dict[str, Any]]:
    pulse = []
    for day in days[-18:]:
        latest = day["commits"][-1]
        stats = day_stats(day)
        structural = len(structural_subjects(day))
        release = nearest_tag(tags, day["date"])
        score = min(96, 20 + min(stats["commits"], 8) * 8 + structural * 4 + (6 if release else 0))
        base_url = html_url or ""
        pulse.append({
            "sha": latest["shortSha"],
            "date": day["date"][5:],
            "fullDate": day["date"],
            "score": score,
            "groupCount": stats["commits"],
            "url": f"{base_url}/commit/{latest['sha']}" if base_url else "",
        })
    return pulse


def build_analysis(
    commits: list[dict[str, Any]],
    files: list[str],
    dependencies: list[dict[str, str]],
    tags: list[dict[str, str]],
    coverage: str,
    project_name: str,
) -> dict[str, Any]:
    days = group_commits_by_day(commits)
    phases = build_phases(days, tags, coverage)
    distinct_dates = len(days)
    collapsed = sum(max(0, len(day["commits"]) - 1) for day in days)
    language_signal = "JavaScript" if any(path.endswith((".js", ".ts", ".tsx")) for path in files) else "Python" if any(path.endswith(".py") for path in files) else "a mixed stack"
    if not phases:
        return {
            "headline": "The archive is waiting for its first dated record.",
            "thesis": "No local Git history was available for a grounded account of change.",
            "historySummary": "There is not enough dated local evidence to stage an origin, turning point, or present state.",
            "exit": "Leave with the structural reading only; the historical chapter is explicitly unavailable.",
            "confidence": "limited local record",
            "arc": [],
            "phases": [],
            "turningPointReason": "No dated local commits were available.",
            "distinctDates": 0,
            "excludedSameDayEvents": 0,
            "coverage": coverage,
            "signals": [
                {"label": "Observed commits", "value": "0", "detail": "local Git sample"},
                {"label": "Direct dependencies", "value": str(len(dependencies)), "detail": "visible manifests"},
                {"label": "Tracked files", "value": str(len(files)), "detail": "current tree"},
            ],
        }
    origin = phases[0]
    now = phases[-1]
    turning = next((phase for phase in phases if phase["role"] == "turning"), None)
    spread = "One natural day is" if distinct_dates == 1 else f"{distinct_dates} distinct natural days are"
    sequence = " → ".join(f"“{phase['title']}”" for phase in phases)
    headline = f"{project_name}: {sequence}" if len(phases) > 1 else f"{project_name}: {origin['title']}"
    thesis = (
        f"The visible record moves through {sequence}. Each stop is a grouped natural day; the middle reading is evidence-backed, not a claim about private intent."
        if turning else
        f"The visible record supports only {len(phases)} dated chapter{'s' if len(phases) != 1 else ''}; the museum leaves a missing middle explicitly empty."
    )
    history_summary = (
        f"{spread} represented. The strongest observable turn is “{turning['title']}” on {turning['start']}. {turning['reason']}"
        if turning else
        f"{spread} represented. "
        + (
            "A turning point requires more than one dated chapter, so the museum does not invent one."
            if distinct_dates < 2 else
            "No interior day supports a turning-point claim, so the museum leaves that middle explicitly empty."
        )
    )
    exit_statement = (
        f"Retell {project_name} as {sequence}, with every stop tied to a dated commit or tag."
        if len(phases) > 1 else
        f"Retell {project_name} as one visible record: “{origin['title']}”, while naming the limits of the sample."
    )
    arc = [
        {
            "label": phase["label"],
            "title": phase["title"],
            "summary": phase["summary"],
            "lesson": phase["lesson"],
            "evidence": phase["evidence"],
        }
        for phase in phases
    ]
    return {
        "headline": headline,
        "thesis": thesis,
        "historySummary": history_summary,
        "exit": exit_statement,
        "confidence": "evidence-backed local analysis",
        "arc": arc,
        "phases": phases,
        "turningPointReason": turning["reason"] if turning else "A third distinct natural day was not available for a turning-point read.",
        "distinctDates": distinct_dates,
        "excludedSameDayEvents": collapsed,
        "coverage": coverage,
        "signals": [
            {"label": "Distinct days", "value": str(distinct_dates), "detail": f"{collapsed} same-day duplicates grouped"},
            {"label": "Direct dependencies", "value": str(len(dependencies)), "detail": "visible manifests"},
            {"label": "Tracked files", "value": str(len(files)), "detail": "current tree"},
            {"label": "Language", "value": language_signal, "detail": "tracked files"},
        ],
    }


def build_learning(
    orientation: dict[str, str],
    journey: dict[str, Any],
    architecture: dict[str, Any],
    analysis: dict[str, Any],
    dependencies: list[dict[str, str]],
    readme_path: str | None,
    manifest_path: str | None,
) -> dict[str, Any]:
    """Create the visitor-facing teaching contract shared by Agent and browser renders."""
    first_evidence = readme_path or manifest_path or "README.md"

    def file_evidence(ref: str) -> dict[str, str]:
        return {"type": "file", "ref": ref, "label": ref}

    folders = architecture.get("folders", [])
    working_folders = [item for item in folders if item.get("name") and not is_support_folder(item["name"])]
    main_area = next(
        (item.get("evidence") for item in working_folders if item.get("name", "").lower() in IMPLEMENTATION_FOLDERS),
        working_folders[0].get("evidence") if working_folders else first_evidence,
    ) or first_evidence
    phases = analysis.get("phases", [])
    origin = phases[0] if phases else None
    turning = next((phase for phase in phases if phase.get("role") == "turning"), None)
    now = phases[-1] if phases else None
    history_evidence = dedupe_evidence(
        [item for phase in phases for item in phase.get("evidence", [])],
        limit=4,
    )
    entrypoint_evidence = dedupe_evidence(
        [
            file_evidence(str(step.get("evidence") or first_evidence))
            for step in journey.get("steps", [])
        ],
        limit=3,
    )
    folder_roles = {
        str(item.get("name")): str(item.get("role") or "A tracked project area")
        for item in working_folders[:3]
    }
    dependency_names = [item.get("name", "") for item in dependencies[:3] if item.get("name")]
    sequence = list({phase["id"]: phase for phase in (origin, turning, now) if phase}.values())
    if not sequence:
        history_discovery = "The sampled record has no dated phase, so history remains explicitly unavailable."
    elif len(sequence) == 1:
        history_discovery = f"The sample contains one dated chapter, “{sequence[0]['title']}”; there is no evidence for a middle turning point."
    elif not turning:
        history_discovery = (
            f"The sampled record moves from “{sequence[0]['title']}” to “{sequence[-1]['title']}”; "
            "no interior day exists to support a turning-point claim."
        )
    else:
        history_discovery = (
            " → ".join(f"“{phase['title']}”" for phase in sequence)
            + "; each chapter groups same-day commits behind one dated marker."
        )
    overview_discovery = f"The public introduction says: “{str(orientation.get('oneLine', 'a project with a story still being written')).rstrip('.!?')}.”"
    entry_refs = [item["ref"] for item in entrypoint_evidence]
    if len(entry_refs) >= 2:
        journey_discovery = (
            f"The tracked path starts at {entry_refs[0]} and reaches {', '.join(entry_refs[1:])}. "
            "The responsibilities between those sources remain an explicitly inferred teaching model."
        )
    elif entry_refs:
        journey_discovery = (
            f"The only defensible starting point in the visible record is {entry_refs[0]}; "
            "the rest of the path is explicitly inferred rather than presented as runtime fact."
        )
    else:
        journey_discovery = "The visible record does not expose a confident entry path, so this room stays explicitly inferred."
    source_files = [
        item for item in architecture.get("files", [])
        if re.search(r"source file|application script|application entry point|document entry point|presentation layer|server or request surface", item.get("role", ""), re.I)
    ]
    source_names = [str(item.get("name")) for item in source_files[:2]]
    role_phrases = [f"{name} ({role[0].lower() + role[1:] if role else role})" for name, role in folder_roles.items()]
    if source_names and role_phrases:
        architecture_discovery = (
            f"The visible working structure pairs {natural_list(source_names)} with {natural_list(role_phrases)}."
        )
    elif role_phrases:
        architecture_discovery = f"The tracked working structure concentrates on {natural_list(role_phrases)}."
    elif source_names:
        architecture_discovery = f"The most legible working structure is carried by {natural_list(source_names)}."
    else:
        architecture_discovery = "The tree exposes too few implementation-named areas for a strong structural claim, so the blueprint stays deliberately coarse."
    dependency_discovery = (
        f"{manifest_path or 'The manifest'} declares {', '.join(dependency_names)}; these are direct capabilities, not hidden transitive dependencies."
        if dependency_names else "No readable direct dependency is exposed, so the ecosystem room is omitted rather than staged empty."
    )
    opera_discovery = analysis.get("exit", "Remember the project as a map from purpose to path, parts, and history.")

    folder_claims = [
        evidence_item(
            "file",
            str(item.get("evidence") or item.get("name")),
            str(item.get("name")),
            f"The tracked {item.get('name')} directory is described as {str(item.get('role') or 'a visible project area').lower()}.",
        )
        for item in working_folders[:3]
    ]
    source_claims = [
        evidence_item(
            "file",
            str(item.get("name")),
            str(item.get("name")),
            f"The tracked {item.get('name')} is described as {str(item.get('role') or 'a visible implementation path').lower()}.",
        )
        for item in source_files[:2]
    ]
    architecture_trail = dedupe_evidence([*source_claims, *folder_claims], limit=4)
    if not architecture_trail:
        architecture_trail = [
            evidence_item("file", main_area, main_area, "This visible path is the strongest structural clue in the sampled tree.")
        ]
    architecture_evidence = [file_evidence(item["ref"]) for item in architecture_trail]
    folder_role_lookup = {item.get("evidence") or item.get("name"): item.get("role") for item in folders}

    def entry_claim(ref: str) -> str:
        if ref == readme_path:
            return "The tracked README is the first public document on the inferred visitor path."
        if ref == manifest_path:
            return "The tracked manifest exposes the project's declared tools and command boundary."
        if ref in folder_role_lookup:
            return f"The tracked {ref} area is described as {str(folder_role_lookup[ref]).lower()}; its place in the path is inferred."
        return f"The tracked path {ref} is a visible clue for the inferred entry path."

    rooms: list[dict[str, Any]] = [
        {
            "id": "hall-overview",
            "label": "The foyer",
            "question": "What is this project for?",
            "scene": f"Start with the promise, not the tree: {orientation.get('oneLine', 'this project is introduced through its public documentation.')}",
            "plain": orientation.get("what", "Start with the project's job and the people or systems it serves."),
            "reveal": orientation.get("how", "The visible documentation and tree show the project's main boundary."),
            "whyItMatters": "Start with the job before naming the machinery.",
            "interaction": "before-after",
            "takeaway": orientation.get("outcome", "Explain what the project does and who it is for."),
            "mode": "observed",
            "discovery": overview_discovery,
            "evidence": [file_evidence(first_evidence)],
            "evidenceTrail": [
                evidence_item("file", first_evidence, first_evidence, "This tracked introduction supplies the project's first prose description.")
            ],
        },
        {
            "id": "hall-journey",
            "label": "First visitor",
            "question": "What happens when someone uses it?",
            "scene": "Follow one ordinary input from the person or caller to the result they receive.",
            "plain": journey.get("summary", "An input enters, the project coordinates its parts, and a result comes back."),
            "reveal": "This path is a conservative teaching model inferred from the README, tree, scripts, and visible entry points.",
            "whyItMatters": "A request path turns a folder tree into a sequence of responsibilities.",
            "interaction": "path",
            "takeaway": journey.get("summary", "An input enters, the project coordinates its parts, and a result comes back."),
            "mode": "inferred",
            "discovery": journey_discovery,
            "evidence": entrypoint_evidence,
            "evidenceTrail": [
                evidence_item(item["type"], item["ref"], item["label"], entry_claim(item["ref"]))
                for item in entrypoint_evidence
            ],
        },
        {
            "id": "hall-architecture",
            "label": "Blueprint room",
            "question": "Which parts make that journey possible?",
            "scene": "Read the repository as a building plan: every visible area has a possible job.",
            "plain": architecture.get("summary", "The visible tree is the project's first blueprint."),
            "reveal": architecture.get("sourceNote", "Roles are inferred from visible repository evidence."),
            "whyItMatters": "Naming a part is less useful than knowing what it helps the visitor path do.",
            "interaction": "blueprint",
            "takeaway": architecture.get("summary", "The visible tree is the project's first blueprint."),
            "mode": "observed",
            "discovery": architecture_discovery,
            "evidence": architecture_evidence,
            "evidenceTrail": architecture_trail,
        },
        {
            "id": "hall-history",
            "label": "History hall",
            "question": "Why does it look this way now?",
            "scene": (
                "Read the sampled public record without filling gaps the evidence cannot support."
                if len(sequence) <= 1 else
                "Read the sampled record as an origin and a present state, leaving the missing middle explicitly empty."
                if len(sequence) == 2 else
                "Read the public record as origin, strongest visible movement, and now."
            ),
            "plain": analysis.get("historySummary", analysis.get("thesis", "The current shape is the result of observable changes over time.")),
            "reveal": "The chapters are selected from grouped natural days and tags; they describe the record without claiming private intent.",
            "whyItMatters": "History turns today's structure into a consequence rather than a pile of facts.",
            "interaction": "chapters",
            "takeaway": analysis.get("historySummary", analysis.get("thesis", "The current shape is the result of observable changes over time.")),
            "mode": "mixed",
            "discovery": history_discovery,
            "evidence": history_evidence,
            "evidenceTrail": history_evidence,
        },
    ]
    if dependencies:
        rooms.append({
            "id": "hall-dependencies",
            "label": "Ecosystem room",
            "question": "What supports it?",
            "scene": "Meet the capabilities this project chooses to borrow.",
            "plain": f"{len(dependencies)} direct dependencies are visible in {manifest_path or 'the project manifests'}; they show which capabilities the repository delegates.",
            "reveal": "Each specimen is observed in a manifest. Its capability label is an interpretation, so keep the source link close.",
            "whyItMatters": "Dependencies reveal the project's boundaries.",
            "interaction": "specimens",
            "takeaway": f"{len(dependencies)} direct dependencies are visible in {manifest_path or 'the project manifests'}; they show which capabilities the repository borrows.",
            "mode": "observed",
            "discovery": dependency_discovery,
            "evidence": [file_evidence(manifest_path or first_evidence)],
            "evidenceTrail": [evidence_item("file", manifest_path or first_evidence, manifest_path or first_evidence, "The manifest directly declares the dependencies that make up this room.")],
        })
    exit_trail = dedupe_evidence(
        [
            evidence_item("file", first_evidence, first_evidence, "The public introduction supports the project's purpose."),
            *history_evidence[-1:],
        ]
    )
    rooms.append({
        "id": "hall-opera",
        "label": "Exit workshop",
        "question": "What should I remember?",
        "scene": "Rehearse the project story before you leave.",
        "plain": "The project is easiest to remember as a map from purpose to path, parts, and history.",
        "reveal": analysis.get("exit", "The pulse is a record of activity, not a quality score."),
        "whyItMatters": "A visitor should leave able to explain the project without reopening the code.",
        "interaction": "rehearsal",
        "takeaway": analysis.get("exit", "Remember the project as a map from purpose, path, parts, and history."),
        "mode": "mixed",
        "discovery": opera_discovery,
        "evidence": [file_evidence(item["ref"]) for item in exit_trail],
        "evidenceTrail": exit_trail,
    })
    return {
        "promise": "By the end, you can explain the project's purpose, follow one likely use path, and connect its current shape to the public history.",
        "rooms": rooms,
    }


def main() -> None:
    if not (ROOT / ".git").exists():
        raise SystemExit("Repo Museum Agent must run from a Git repository root.")
    url = git_url()
    slug = repo_slug(url)
    commits = parse_commits()
    days = group_commits_by_day(commits)
    files = tree_files()
    readme_text, readme_path = read_readme(files)
    dependencies: list[dict[str, str]] = []
    manifest_path = None
    manifest_meta: dict[str, Any] = {}
    for candidate in MANIFEST_NAMES:
        if candidate in files:
            entries, meta = read_manifest(candidate)
            dependencies = entries
            manifest_path = candidate
            manifest_meta = meta
            break
    tags = tag_records()[:24]
    try:
        total_commits = int(maybe_run("rev-list", "--count", "HEAD") or "0")
    except ValueError:
        total_commits = len(commits)
    if total_commits > len(commits):
        coverage = (
            f"Sampled {len(commits)} local commits from a repository with {total_commits}: "
            "the newest window and earliest records are present, while middle history is not loaded. "
            f"The phase reading uses {len(days)} distinct natural day{'s' if len(days) != 1 else ''}."
        )
    else:
        coverage = f"Loaded all {len(commits)} local commits and grouped them into {len(days)} distinct natural day{'s' if len(days) != 1 else ''}."
    analysis = build_analysis(commits, files, dependencies, tags, coverage, slug.split("/")[-1])
    events = build_daily_events(days, tags, analysis.get("phases", []))
    pulse = build_pulse(days, tags, url)
    language = "JavaScript" if any(path.endswith((".js", ".ts", ".tsx")) for path in files) else "Python" if any(path.endswith(".py") for path in files) else "Mixed stack"
    manifest_description = clip_sentence(str(manifest_meta.get("description") or "")) if manifest_meta.get("description") else ""
    description = manifest_description or description_from_readme(readme_text) or "A local repository examined through its own evidence."
    orientation = build_orientation(description, readme_text, language)
    architecture = build_architecture(files, manifest_path, readme_path, language)
    journey = build_journey(files, readme_path, manifest_path, architecture)
    learning = build_learning(orientation, journey, architecture, analysis, dependencies, readme_path, manifest_path)
    branch = maybe_run("symbolic-ref", "--short", "HEAD") or "main"
    artifact = {
        "version": "1.1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "project": {"repo": slug, "name": slug.replace("/", " / "), "htmlUrl": url, "description": description, "manifestPath": manifest_path, "defaultBranch": branch},
        "repo": slug,
        "name": slug.replace("/", " / "),
        "htmlUrl": url or "",
        "description": description,
        "defaultBranch": branch,
        "createdAt": commits[-1]["date"] if commits else None,
        "pushedAt": commits[0]["date"] if commits else None,
        "language": language,
        "license": "Local record",
        "stars": None,
        "forks": None,
        "issues": None,
        "contributors": [{"login": name} for name in list(dict.fromkeys(commit["author"] for commit in commits[:12]))[:6]],
        "events": events,
        "dependencies": dependencies[:12],
        "manifestPath": manifest_path,
        "orientation": orientation,
        "journey": journey,
        "architecture": architecture,
        "commits": pulse,
        "analysis": analysis,
        "learning": learning,
        "sources": (
            [{"type": "commit", "ref": commit["sha"], "label": commit["shortSha"]} for commit in commits[:10]]
            + ([{"type": "file", "ref": manifest_path, "label": manifest_path}] if manifest_path else [])
            + [{"type": "release", "ref": tag["tag"], "label": tag["tag"]} for tag in tags[:6]]
        ),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
