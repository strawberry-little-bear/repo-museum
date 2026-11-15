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


@lru_cache(maxsize=1)
def tree_files() -> list[str]:
    return [item for item in run("ls-tree", "-r", "--name-only", "HEAD").splitlines() if item]


@lru_cache(maxsize=1)
def tree_file_sizes() -> dict[str, int]:
    """Return tracked blob sizes without checking out the working tree."""
    sizes: dict[str, int] = {}
    for line in run("ls-tree", "-r", "-l", "HEAD").splitlines():
        metadata, separator, path = line.partition("\t")
        if not separator:
            continue
        parts = metadata.split()
        if len(parts) < 4 or parts[1] != "blob":
            continue
        try:
            sizes[path] = int(parts[3])
        except ValueError:
            continue
    return sizes


def read_tracked_text(path: str, limit: int = 120_000) -> str:
    if path not in tree_files():
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


def clip_reading_guide(text: str, limit: int = 300) -> str:
    """Keep a full guide passage, shortening only at the character limit."""
    text = re.sub(r"\s+", " ", strip_markdown_inline(text)).strip()
    if len(text) <= limit:
        return text
    shortened = text[: limit - 1].rsplit(" ", 1)[0].rstrip(" ,;:")
    return f"{shortened or text[: limit - 1]}…"


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
REPOSITORY_MANIFESTS = {
    "package.json", "pyproject.toml", "requirements.txt", "cargo.toml", "go.mod",
    "composer.json", "gemfile", "pom.xml", "build.gradle", "build.gradle.kts",
    "deno.json", "bun.lockb",
}
CODE_EXTENSIONS = {
    ".py", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".rs",
    ".go", ".rb", ".java", ".kt", ".kts", ".swift", ".c", ".h", ".cc", ".cpp",
    ".hpp", ".cs", ".php", ".scala", ".ex", ".exs", ".erl", ".hs", ".lua", ".r",
    ".jl", ".sh", ".bash", ".zsh", ".ps1", ".sql",
}
STYLE_EXTENSIONS = {".css", ".scss", ".sass", ".less", ".styl"}
DOCUMENT_EXTENSIONS = {".md", ".mdx", ".rst", ".adoc", ".txt"}
CONFIG_EXTENSIONS = {".json", ".jsonc", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".xml", ".gradle", ".properties"}
PREVIEW_BLOCKED_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".bmp", ".tiff",
    ".woff", ".woff2", ".ttf", ".otf", ".eot", ".pdf", ".zip", ".gz", ".tgz",
    ".bz2", ".xz", ".7z", ".rar", ".jar", ".class", ".pyc", ".wasm", ".mp3",
    ".mp4", ".mov", ".avi", ".webm", ".ogg", ".wav", ".flac", ".so", ".dylib",
    ".dll", ".exe",
}
LOCK_FILES = {"package-lock.json", "pnpm-lock.yaml", "yarn.lock", "cargo.lock", "poetry.lock", "uv.lock", "composer.lock", "gemfile.lock"}
MAX_PREVIEW_BYTES = 2_000_000
MAX_PREVIEW_CHARS = 60_000

SOURCE_LANGUAGES = {
    ".py": "Python", ".js": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
    ".jsx": "JavaScript", ".ts": "TypeScript", ".tsx": "TypeScript", ".vue": "Vue",
    ".svelte": "Svelte", ".go": "Go", ".rs": "Rust", ".rb": "Ruby", ".java": "Java",
    ".kt": "Kotlin", ".kts": "Kotlin", ".swift": "Swift", ".c": "C", ".h": "C",
    ".cc": "C++", ".cpp": "C++", ".hpp": "C++", ".cs": "C#", ".php": "PHP",
    ".scala": "Scala", ".ex": "Elixir", ".exs": "Elixir", ".erl": "Erlang",
    ".hs": "Haskell", ".lua": "Lua", ".r": "R", ".jl": "Julia", ".sh": "Shell",
    ".bash": "Shell", ".zsh": "Shell", ".ps1": "PowerShell", ".sql": "SQL",
    ".css": "CSS", ".scss": "Sass", ".sass": "Sass", ".less": "Less",
    ".md": "Markdown", ".mdx": "Markdown", ".rst": "reStructuredText", ".adoc": "AsciiDoc",
    ".json": "JSON", ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML",
}


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


def path_basename(path: str) -> str:
    return path.rsplit("/", 1)[-1]


def path_extension(path: str) -> str:
    basename = path_basename(path).lower()
    if "." not in basename.lstrip("."):
        return ""
    return "." + basename.rsplit(".", 1)[-1]


def is_generated_path(path: str) -> bool:
    return any(part.lower() in GENERATED_FOLDERS for part in path.split("/") if part)


def repository_path_category(path: str) -> str:
    lower = path.lower()
    basename = path_basename(lower)
    extension = path_extension(lower)
    if is_generated_path(lower):
        return "generated"
    if lower.startswith(".github/workflows/") or (
        re.search(r"(^|/)(ci|release|publish)(\.|/|$)", lower) and lower.endswith((".yml", ".yaml", ".sh"))
    ):
        return "automation"
    if basename in REPOSITORY_MANIFESTS:
        return "manifest"
    if (
        re.search(r"(^|/)(__tests__|tests?|specs?|e2e|testdata|fixtures)/", lower)
        or re.search(r"(^|[._-])(test|spec)([._-]|$)", basename)
    ):
        return "test"
    if re.match(r"^(readme|changelog|contributing|code_of_conduct|security|support)(\.|$)", basename) or re.search(
        r"(^|/)(docs?|documentation)/", lower
    ) or extension in DOCUMENT_EXTENSIONS:
        return "documentation"
    if re.search(r"(^|/)(examples?|demos?|playground|samples?)/", lower):
        return "example"
    if extension in STYLE_EXTENSIONS or re.search(r"(^|/)(styles?|theme|themes)/", lower):
        return "code"
    if extension in CODE_EXTENSIONS:
        return "code"
    if (
        basename in LOCK_FILES
        or re.match(
            r"^(\.?[^/]*(config|rc)|tsconfig|vite\.config|webpack|rollup|eslint|prettier|babel|jest|vitest|tailwind|postcss|dockerfile|makefile)",
            basename,
        )
        or extension in CONFIG_EXTENSIONS
    ):
        return "config"
    return "asset"


def path_read_preference(path: str, project_name: str = "", context: str = "") -> tuple[int, str]:
    depth = len(path.split("/"))
    lower = path.lower()
    segments = lower.split("/")
    basename = path_basename(lower)
    stem = basename.rsplit(".", 1)[0] if "." in basename else basename
    project_stem = project_name.split("/")[-1].lower()
    direct_test = depth == 1 or (segments[0] in {"test", "tests", "spec", "specs", "__tests__"} and depth == 2)
    score = (depth - 1) * 9
    if depth == 1 and re.match(r"^(readme|package|pyproject|requirements|cargo|go)\.", path_basename(path), re.I):
        score -= 24
    if depth == 1 and re.match(r"^readme(\.|$)", basename, re.I):
        score -= 80
    if re.search(r"(^|/)(src|lib|app|packages|server|core)/", lower):
        score -= 18
    if context in {"implementation", "entrypoint", "api"} and any(
        segment in LEARNING_FOLDERS or segment in SUPPORT_FOLDERS or segment.startswith(".") for segment in segments
    ):
        score += 30
    if context == "test" and direct_test and re.search(r"(^|\.)(test|spec)(\.|$)", stem):
        score -= 28
    if context == "test" and any(segment in {"testdata", "fixtures", "test_apps", "apps"} for segment in segments):
        score += 24
    if context == "example" and re.match(r"^readme(\.|$)", basename):
        score -= 20
    if context == "example" and re.match(r"^(main|app|index|manage|example|demo)(\.|$)", stem):
        score -= 12
    if segments[0] in {"devcontainer", "devcontainers", "docker", "deploy", "deployment", "ci"}:
        score += 30
    if context in {"implementation", "entrypoint", "api"} and project_stem and stem == project_stem:
        score -= 24
    if context == "implementation" and stem in {"__init__", "index"}:
        score += 16
    if context == "implementation" and stem in {
        "core", "engine", "server", "main", "app", "client", "router", "context", "request", "response", "handler",
    }:
        score -= 10
    if stem in {"app", "main", "index", "server", "core", "client", "lib", "router"}:
        score -= 8
    if path_extension(path) == ".sh":
        score += 10
    if is_generated_path(lower):
        score += 100
    return score, path


def choose_read_path(files: list[str], predicate: Any, project_name: str = "", context: str = "") -> str:
    candidates = [path for path in files if predicate(path)]
    return min(candidates, key=lambda path: path_read_preference(path, project_name, context)) if candidates else ""


def guide_line_text(value: str, limit: int = 180) -> str:
    return re.sub(r"\s+$", "", value.replace("\t", "  "))[:limit]


def guide_line_number(lines: list[str], fragment: str) -> int:
    needle = str(fragment or "")[:80]
    if not needle:
        return 1
    for index, line in enumerate(lines):
        if needle in line:
            return index + 1
    return 1


def guide_language(path: str) -> str:
    basename = path_basename(path).lower()
    if basename == "dockerfile":
        return "Dockerfile"
    if basename == "makefile":
        return "Makefile"
    return SOURCE_LANGUAGES.get(path_extension(path), "Plain text")


def reading_guide_symbol_rank(symbol: dict[str, Any], path: str) -> int:
    name = str(symbol.get("name") or "")
    kind = str(symbol.get("kind") or "").lower()
    stem = Path(path).stem.lower()
    score = 0 if kind in {"class", "struct", "interface", "trait", "enum", "type", "component", "module"} else 10 if kind in {"object", "implementation"} else 20 if kind == "function" else 50
    if name.startswith("_") and not (name.startswith("__") and name.endswith("__")):
        score += 55
    if re.match(r"^(get|set|is|has|should|can|to|from|with|as|of|on|by|format|shorten)_", name, re.I):
        score += 14
    if len(name) <= 3:
        score += 10
    if re.match(r"^(main|app|run|start|create|new|init|default|serve|server|render|load|build|parse|handle|use|engine|client|router|context)", name, re.I):
        score -= 12
    if name.lower() == stem:
        score -= 25
    return score * 10_000 + (int(symbol.get("line") or 0))


def build_reading_guide(path: str, text: str, truncated: bool = False) -> dict[str, Any] | None:
    """Extract a conservative reading lens from the same text exposed in the preview."""
    source = (text or "").replace("\r\n", "\n").replace("\r", "\n")
    if not source.strip():
        return None
    lines = source.split("\n")
    basename = path_basename(path).lower()
    category = repository_path_category(path)
    language = guide_language(path)
    manifest = basename in REPOSITORY_MANIFESTS or basename in {"cargo.toml", "requirements.txt", "go.mod", "pyproject.toml", "package.json"}
    document = path_extension(path) in DOCUMENT_EXTENSIONS or category == "documentation"

    if manifest:
        symbols: list[dict[str, Any]] = []
        imports: list[dict[str, Any]] = []
        seen_symbols: set[str] = set()
        seen_imports: set[str] = set()

        def add_symbol(name: str, kind: str, line: int, signature: str) -> None:
            key = f"{kind}:{name}"
            if not name or key in seen_symbols or len(symbols) >= 12:
                return
            seen_symbols.add(key)
            symbols.append({"name": name[:90], "kind": kind, "line": line, "signature": guide_line_text(signature)})

        def add_import(name: str, line: int, detail: str = "") -> None:
            if not name or name in seen_imports or len(imports) >= 12:
                return
            seen_imports.add(name)
            imports.append({"source": name[:120], "names": [detail[:80]] if detail else [], "line": line})

        if basename == "package.json":
            try:
                parsed = json.loads(source)
                scripts = list((parsed.get("scripts") or {}).items())
                dependencies = {**parsed.get("dependencies", {}), **parsed.get("devDependencies", {})}
                for name, command in scripts[:6]:
                    add_symbol(str(name), "script", guide_line_number(lines, f'"{name}"'), f'"{name}": "{command}"')
                for name, version in list(dependencies.items())[:8]:
                    add_import(str(name), guide_line_number(lines, f'"{name}"'), str(version))
                command_names = [str(name) for name, _ in scripts[:3]]
                headline = f"This manifest declares {len(scripts)} command{'s' if len(scripts) != 1 else ''} and {len(dependencies)} dependency entr{'y' if len(dependencies) == 1 else 'ies'}."
                notice = (
                    f"Start with the {natural_list([f'“{name}”' for name in command_names])} command{'s' if len(command_names) != 1 else ''}; they connect the repository to a reproducible workflow."
                    if command_names
                    else "No command scripts are declared here, so read the dependency entries as the project's visible capability boundary."
                )
            except (json.JSONDecodeError, TypeError):
                headline = "This package manifest is not valid JSON in the readable sample."
                notice = "The original manifest is still linked below; the museum does not infer commands from malformed JSON."
        elif basename == "go.mod":
            for index, line in enumerate(lines):
                module = re.match(r"^\s*module\s+(\S+)", line)
                if module:
                    add_symbol(module.group(1), "module", index + 1, line)
                requirement = re.match(r"^\s*(?:require\s+)?([A-Za-z0-9._~-]+\.[A-Za-z]{2,}/\S+)\s+v?\S+", line)
                if requirement and not requirement.group(1).startswith("//"):
                    add_import(requirement.group(1), index + 1)
            module = next((item for item in symbols if item["kind"] == "module"), None)
            headline = (
                f"This module manifest names {module['name']} as the import root and exposes {len(imports)} visible module requirement{'s' if len(imports) != 1 else ''}."
                if module
                else f"This Go module manifest exposes {len(imports)} readable module requirement{'s' if len(imports) != 1 else ''}."
            )
            notice = (
                f"Begin with the module path {module['name']}, then inspect the requirements to see which external packages the source tree can borrow."
                if module
                else "Begin with the declared requirements; they form the project's visible external capability boundary."
            )
        elif basename == "cargo.toml":
            for index, line in enumerate(lines):
                package_name = re.match(r"^\s*name\s*=\s*[\"']([^\"']+)[\"']", line)
                if package_name and not symbols:
                    add_symbol(package_name.group(1), "package", index + 1, line)
                dependency = re.match(r"^\s*([A-Za-z0-9_-]+)\s*=\s*(?:\{[^}]*version\s*=\s*)?[\"']([^\"']+)[\"']", line)
                if dependency and dependency.group(1) not in {"name", "version", "edition", "rust-version", "description"}:
                    add_import(dependency.group(1), index + 1, dependency.group(2))
            headline = f"This Cargo manifest declares {len(imports)} visible dependency entr{'y' if len(imports) == 1 else 'ies'} around {symbols[0]['name'] if symbols else 'the crate'}."
            notice = "Read the package identity first, then the dependency sections to see which capabilities the Rust crate delegates."
        elif basename == "pyproject.toml":
            records = toml_assignment_records(source)
            project_name = next((record for record in records if record[0] == "project" and record[1] == "name"), None)
            if project_name:
                add_symbol(toml_string_value(project_name[2]), "package", project_name[3], lines[project_name[3] - 1])
            commands = [record for record in records if record[0] in {"project.scripts", "tool.poetry.scripts"}][:8]
            for section, key, _value, line in commands:
                add_symbol(key, "script", line, lines[line - 1])
            for dependency in toml_dependency_entries(source, "pyproject.toml")[:12]:
                add_import(str(dependency.get("name", "")), int(dependency.get("line", 1)), str(dependency.get("version", "")))
            package = next((symbol for symbol in symbols if symbol["kind"] == "package"), None)
            headline = f"This Python project manifest establishes {package['name'] if package else 'the package'}, {len(imports)} visible dependency entr{'y' if len(imports) == 1 else 'ies'}, and {len(commands)} command{'s' if len(commands) != 1 else ''}."
            notice = (
                f"Start with the {natural_list([f'“{section_key}”' for _section, section_key, _value, _line in commands[:3]])} command{'s' if len(commands) != 1 else ''}, then read the dependency groups as the project's visible capability boundary."
                if commands
                else "Read the package identity, then the dependency groups: together they define what the project claims and what it borrows."
            )
        else:
            for index, line in enumerate(lines):
                requirement = re.match(r"^\s*([A-Za-z0-9_.-]+)(?:\[[^\]]+\])?\s*(?:[<>=!~].*)?$", line)
                if requirement and not requirement.group(1).startswith("#"):
                    add_import(requirement.group(1), index + 1)
            headline = f"This manifest lists {len(imports)} visible dependency entr{'y' if len(imports) == 1 else 'ies'}."
            notice = "Use the declarations as a capability boundary, not as proof that every package is active in the same code path."
        return {
            "model": "text-structure/v1",
            "mode": "manifest",
            "language": language,
            "headline": clip_reading_guide(headline, 220),
            "notice": clip_reading_guide(notice, 300),
            "facts": [{"label": "Declarations", "value": str(len(symbols))}, {"label": "Dependencies", "value": str(len(imports))}, {"label": "Lines", "value": str(len(lines))}],
            "symbols": symbols,
            "imports": imports,
            "boundary": "Structural scan of the readable preview only; the manifest continues beyond this sample." if truncated else "Structural scan of the readable manifest; no install or command execution was observed.",
        }

    if document:
        headings: list[dict[str, Any]] = []
        first_paragraph = ""
        in_fence = False
        for index, raw in enumerate(lines):
            stripped = raw.strip()
            if re.match(r"^(?:```|~~~)", stripped):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            heading = re.match(r"^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$", raw)
            if heading and len(headings) < 24:
                headings.append({"name": strip_markdown_inline(heading.group(2))[:100], "kind": "section", "line": index + 1, "signature": guide_line_text(stripped)})
                continue
            if not first_paragraph and stripped and not re.match(r"^\s*(?:[-+*]|\d+[.)])\s+", raw) and not re.match(r"^\[[^\]]+\]:", stripped) and not stripped.startswith(("|", "<", ">")):
                cleaned = strip_markdown_inline(stripped)
                if len(cleaned) >= 28:
                    first_paragraph = cleaned
        primary = headings[0]["name"] if headings else path_basename(path)
        headline = (
            f"This document opens with “{primary}” and is organised into {len(headings)} visible heading{'s' if len(headings) != 1 else ''}."
            if headings
            else f"This document offers a {len(lines)}-line readable record without Markdown headings."
        )
        notice = (
            f"Start with the section “{primary}”. The first substantive passage says: “{clip_reading_guide(first_paragraph, 180)}”"
            if first_paragraph
            else f"Start at “{primary}”; the scan did not find a plain introductory paragraph to quote without risking misrepresentation."
        )
        return {
            "model": "text-structure/v1",
            "mode": "document",
            "language": language,
            "headline": clip_reading_guide(headline, 220),
            "notice": clip_reading_guide(notice, 340),
            "facts": [{"label": "Sections", "value": str(len(headings))}, {"label": "Lines", "value": str(len(lines))}],
            "symbols": headings,
            "imports": [],
            "boundary": "Structural scan of the readable preview only; later sections may be outside this sample." if truncated else "Structural scan of the readable document; quoted language remains the project's own wording.",
        }

    symbols = []
    imports = []
    seen_symbols = set()
    seen_imports = set()

    def add_symbol(name: str, kind: str, line: int, signature: str) -> None:
        key = f"{kind}:{name}"
        if not name or key in seen_symbols or len(symbols) >= 36:
            return
        seen_symbols.add(key)
        symbols.append({"name": name[:100], "kind": kind, "line": line, "signature": guide_line_text(signature, 200)})

    def add_import(name: str, line: int, names: list[str] | None = None) -> None:
        if not name or name in seen_imports or len(imports) >= 24:
            return
        seen_imports.add(name)
        imports.append({"source": name[:160], "line": line, "names": [item[:70] for item in (names or [])[:5]]})

    extension = path_extension(path).lower()
    in_go_import_block = False
    in_comment_block = False
    for index, raw in enumerate(lines):
        line = raw.strip()
        line_number = index + 1
        if not line:
            continue
        if in_comment_block:
            if "*/" in line:
                in_comment_block = False
            continue
        if line.startswith("/*"):
            if "*/" not in line:
                in_comment_block = True
            continue
        top_level = raw == raw.lstrip()
        if extension == ".py":
            declaration = re.match(r"^(?:async\s+)?(class|def)\s+([A-Za-z_]\w*)\s*(?:\([^)]*\))?\s*:?", raw)
            if declaration:
                add_symbol(declaration.group(2), "class" if declaration.group(1) == "class" else "function", line_number, line)
            from_import = re.match(r"^from\s+([.\w]+)\s+import\s+(.+)$", line)
            if from_import:
                names = [item.strip().split(" as ")[0] for item in from_import.group(2).replace("(", "").replace(")", "").split(",") if item.strip()]
                add_import(from_import.group(1), line_number, names)
            plain_import = re.match(r"^import\s+(.+)$", line)
            if plain_import:
                for name in plain_import.group(1).split(","):
                    add_import(name.strip().split(" as ")[0], line_number)
        elif extension in {".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte"}:
            from_import = re.match(r"^import\s+(.+?)\s+from\s+[\"']([^\"']+)[\"']", line)
            if from_import:
                add_import(from_import.group(2), line_number, [re.sub(r"[{}*]", "", from_import.group(1)).strip()])
            side_import = re.match(r"^import\s+[\"']([^\"']+)[\"']", line)
            if side_import:
                add_import(side_import.group(1), line_number)
            required = re.search(r"(?:require|import)\(\s*[\"']([^\"']+)[\"']\s*\)", line)
            if required:
                add_import(required.group(1), line_number)
            if top_level:
                fn = re.match(r"^(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)", raw)
                cls = re.match(r"^(?:export\s+(?:default\s+)?)?class\s+([A-Za-z_$][\w$]*)", raw)
                typed = re.match(r"^(?:export\s+)?(interface|type|enum)\s+([A-Za-z_$][\w$]*)", raw)
                arrow = re.match(r"^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>", raw)
                plain_fn = re.match(r"^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\b", raw)
                if fn:
                    add_symbol(fn.group(1), "function", line_number, line)
                if cls:
                    add_symbol(cls.group(1), "class", line_number, line)
                if typed:
                    add_symbol(typed.group(2), typed.group(1), line_number, line)
                if arrow:
                    add_symbol(arrow.group(1), "component" if arrow.group(1)[:1].isupper() else "function", line_number, line)
                if plain_fn:
                    add_symbol(plain_fn.group(1), "function", line_number, line)
        elif extension == ".go":
            if re.match(r"^import\s*\(", line):
                in_go_import_block = True
                continue
            if in_go_import_block and line == ")":
                in_go_import_block = False
                continue
            if in_go_import_block:
                imported = re.search(r"(?:[._A-Za-z]\w*\s+)?[\"']([^\"']+)[\"']", line)
                if imported:
                    add_import(imported.group(1), line_number)
            single_import = re.match(r"^import\s+(?:[._A-Za-z]\w*\s+)?[\"']([^\"']+)[\"']", line)
            if single_import:
                add_import(single_import.group(1), line_number)
            type_decl = re.match(r"^type\s+([A-Za-z_]\w*)\s+(struct|interface)\b", raw)
            function = re.match(r"^func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)\s*\(", raw)
            if type_decl:
                add_symbol(type_decl.group(1), type_decl.group(2), line_number, line)
            if function:
                add_symbol(function.group(1), "function", line_number, line)
        elif extension == ".rs":
            imported = re.match(r"^use\s+([^;]+);", line)
            if imported:
                add_import("::".join(imported.group(1).split("::")[:2]), line_number, [imported.group(1)])
            declaration = re.match(r"^(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?(fn|struct|enum|trait|mod)\s+([A-Za-z_]\w*)", raw)
            implementation = re.match(r"^impl(?:<[^>]+>)?\s+(?:[^ ]+\s+for\s+)?([A-Za-z_]\w*)", raw)
            if declaration:
                add_symbol(declaration.group(2), declaration.group(1), line_number, line)
            if implementation:
                add_symbol(implementation.group(1), "implementation", line_number, line)
        elif extension == ".rb":
            declaration = re.match(r"^\s*(class|module|def)\s+([A-Za-z_][\w:!?=]*)", raw)
            if declaration:
                add_symbol(declaration.group(2), declaration.group(1), line_number, line)
            required = re.match(r"^require(?:_relative)?\s+[\"']([^\"']+)[\"']", line)
            if required:
                add_import(required.group(1), line_number)
        elif extension in {".java", ".kt", ".kts", ".cs", ".scala"}:
            imported = re.match(r"^import\s+([\w.*]+);?", line)
            if imported:
                add_import(imported.group(1), line_number)
            declaration = re.match(r"^\s*(?:(?:public|private|protected|internal|open|abstract|final|static|sealed|data)\s+)*(class|interface|enum|record|fun|object)\s+([A-Za-z_]\w*)", raw)
            if declaration:
                add_symbol(declaration.group(2), declaration.group(1), line_number, line)
        elif extension == ".php":
            required = re.search(r"(?:require|include)(?:_once)?\s*\(?\s*[\"']([^\"']+)[\"']", line)
            if required:
                add_import(required.group(1), line_number)
            declaration = re.match(r"^\s*(?:abstract\s+|final\s+)?(class|interface|trait|function)\s+([A-Za-z_]\w*)", raw)
            if declaration:
                add_symbol(declaration.group(2), declaration.group(1), line_number, line)
        elif extension in {".sh", ".bash", ".zsh"}:
            function = re.match(r"^(?:function\s+)?([A-Za-z_][\w-]*)\s*(?:\(\))?\s*\{", raw)
            if function:
                add_symbol(function.group(1), "function", line_number, line)

    if not symbols:
        fallback = next((line for line in lines if line.strip() and not line.strip().startswith(("#", "/", "*"))), "")
        if fallback:
            add_symbol(path_basename(path), "file", guide_line_number(lines, fallback.strip()), fallback)
    ranked_symbols = sorted(symbols, key=lambda item: reading_guide_symbol_rank(item, path))
    symbol_names = [item["name"] for item in ranked_symbols[:3]]
    import_sources = [item["source"] for item in imports[:3]]
    headline = (
        f"{language} source. The structural scan finds {len(ranked_symbols)} top-level declaration{'s' if len(ranked_symbols) != 1 else ''}"
        f"{f', led by {natural_list(symbol_names)}' if symbol_names else ''}."
        if ranked_symbols
        else f"{language} source. The structural scan finds no named top-level declaration pattern."
    )
    first = ranked_symbols[0] if ranked_symbols else None
    notice = (
        f"Start with {first['kind']} {first['name']} at line {first['line']}."
        f"{f' It also borrows from {natural_list(import_sources)}.' if import_sources else ''} Read the declaration sites as navigation clues, not as proof of the runtime path."
        if first
        else f"Read the file as a supporting record;{f' its visible imports point to {natural_list(import_sources)}.' if import_sources else ' no top-level declaration or import pattern is available.'}"
    )
    return {
        "model": "text-structure/v1",
        "mode": "source",
        "language": language,
        "headline": clip_reading_guide(headline, 230),
        "notice": clip_reading_guide(notice, 320),
        "facts": [{"label": "Declarations", "value": str(len(ranked_symbols))}, {"label": "Imports", "value": str(len(imports))}, {"label": "Lines", "value": str(len(lines))}],
        "symbols": ranked_symbols,
        "imports": imports,
        "boundary": "Structural scan of the first 60,000 readable characters only; later declarations may be outside this sample." if truncated else "Structural scan of the readable source text; declarations and imports are not an execution trace.",
    }


def preview_text_for(path: str, size: int | None) -> str | None:
    basename = path_basename(path).lower()
    if path_extension(path) in PREVIEW_BLOCKED_EXTENSIONS or basename in LOCK_FILES or re.search(r"\.min\.(?:js|css)$", basename):
        return None
    if size is None or size < 0 or size > MAX_PREVIEW_BYTES:
        return None
    try:
        result = subprocess.run(
            ["git", "show", f"HEAD:{path}"],
            cwd=ROOT,
            check=False,
            text=True,
            capture_output=True,
        )
    except (OSError, UnicodeError):
        return None
    if result.returncode != 0:
        return None
    text = result.stdout
    sample = text[:4000]
    controls = sum(1 for character in sample if ord(character) < 9 or 13 < ord(character) < 32)
    if "\x00" in sample or (sample and controls / len(sample) > 0.03):
        return None
    return text[:MAX_PREVIEW_CHARS]


def build_read_order(files: list[str], project_name: str = "") -> list[dict[str, str]]:
    eligible = [path for path in files if not is_generated_path(path)]
    used: set[str] = set()
    route: list[dict[str, str]] = []

    def add(path: str, role: str, why: str, kind: str) -> None:
        if not path or path in used:
            return
        used.add(path)
        route.append({"path": path, "role": role, "why": why, "kind": kind, "evidence": path})

    root_readme = choose_read_path(
        eligible,
        lambda path: "/" not in path and bool(re.match(r"^readme(\.|$)", path_basename(path), re.I)),
        project_name,
        "documentation",
    )
    readme = root_readme or choose_read_path(
        eligible,
        lambda path: bool(re.match(r"^readme(\.|$)", path_basename(path), re.I)),
        project_name,
        "documentation",
    )
    root_manifest = choose_read_path(
        eligible,
        lambda path: "/" not in path and path_basename(path).lower() in REPOSITORY_MANIFESTS,
        project_name,
        "manifest",
    )
    manifest = root_manifest or choose_read_path(
        eligible,
        lambda path: path_basename(path).lower() in REPOSITORY_MANIFESTS,
        project_name,
        "manifest",
    )
    source_candidates = [path for path in eligible if path_extension(path) in CODE_EXTENSIONS]
    entrypoint = choose_read_path(
        source_candidates,
        lambda path: bool(re.match(r"^(main|app|cli|server|index|__main__|manage|bin)(\.|$)", path_basename(path), re.I)),
        project_name,
        "entrypoint",
    )
    entrypoint_why = "Follow the most plausible boundary from a caller or command into the source tree."
    if not entrypoint:
        project_stem = project_name.split("/")[-1].lower()
        entrypoint = choose_read_path(
            source_candidates,
            lambda path: bool(project_stem)
            and path_basename(path).rsplit(".", 1)[0].lower() == project_stem
            and repository_path_category(path) not in {"test", "example", "generated"},
            project_name,
            "entrypoint",
        )
        if entrypoint:
            entrypoint_why = "This project-named source is the clearest public boundary available without assuming an executable command."
    entry_set = {readme, manifest, entrypoint}
    implementation = choose_read_path(
        source_candidates,
        lambda path: path not in entry_set
        and repository_path_category(path) not in {"test", "example", "generated"}
        and not re.match(r"^(vite|vitest|jest|webpack|rollup|eslint|tsconfig|babel|postcss|tailwind)\.", path_basename(path), re.I),
        project_name,
        "implementation",
    )
    api_surface = choose_read_path(
        source_candidates,
        lambda path: path not in entry_set
        and path != implementation
        and bool(re.search(r"(^|/)(api|routes?|handlers?|controllers?|endpoints?|server)(/|\.|$)", path.lower())),
        project_name,
        "api",
    )
    example = choose_read_path(
        eligible,
        lambda path: bool(re.search(r"(^|/)(examples?|demos?|playground|samples?)/", path, re.I))
        and bool(re.match(r"^(readme|main|app|index|manage|example|demo)(\.|$)", path_basename(path), re.I)),
        project_name,
        "example",
    )
    test = choose_read_path(
        eligible,
        lambda path: repository_path_category(path) == "test"
        and bool(re.search(r"(^|[._-])(test|spec)([._-]|$)", path_basename(path), re.I)),
        project_name,
        "test",
    )
    automation = choose_read_path(
        eligible,
        lambda path: repository_path_category(path) == "automation",
        project_name,
        "automation",
    )
    add(readme, "Public promise", "Start with the project's own account of what it does and who it serves.", "documentation")
    add(manifest, "Dependency boundary", "See the declared commands and the capabilities the project chooses to borrow.", "manifest")
    add(entrypoint, "Visible entry point", entrypoint_why, "entrypoint")
    add(implementation, "Main implementation", "Read the largest implementation trail after the public and entry-point claims are clear.", "implementation")
    add(api_surface, "Public working surface", "Look for the names that expose behavior to callers rather than internal helpers.", "api")
    add(example, "Worked example", "Connect the code to an ordinary use without guessing about runtime behavior.", "example")
    add(test, "Expected behavior", "Read what the project treats as correct when the happy path is exercised.", "test")
    if len(route) < 4:
        add(automation, "Maintenance path", "Finish with the checks and publication steps that keep the reading current.", "automation")
    if not route and files:
        add(files[0], "Repository record", "Begin with the first tracked file available in this partial map.", "fallback")
    return route


def investigation_prompt_for(item: dict[str, Any]) -> str:
    """Turn one reading stop into a concrete, evidence-bounded task."""
    guide = item.get("readingGuide") or {}
    symbols = guide.get("symbols") or []
    primary = symbols[0] if symbols else {}
    import_entries = guide.get("imports") or []
    imports = [str(entry.get("source")) for entry in import_entries[:3] if entry.get("source")]
    quoted_imports = [f"“{name}”" for name in imports]
    role = str(item.get("role") or "Tracked evidence")
    kind = str(item.get("kind") or "reading")

    if kind == "documentation":
        if primary.get("name"):
            return f"Read “{clip_reading_guide(str(primary['name']), 72)}” first. Record one user action and one promised outcome before following their code-shaped labels."
        return "Read the opening claim first. Record one user action and one promised outcome before following code-shaped labels."
    if kind == "manifest":
        if quoted_imports:
            return f"Separate declared capability from observed use. The manifest visibly names {natural_list(quoted_imports)}; none is proven active by the declaration alone."
        return "Separate declared capability from observed use. Start with commands and package names, then look for source evidence elsewhere."
    if kind in {"entrypoint", "implementation", "api", "example", "test", "automation"}:
        if primary.get("name"):
            import_note = f" The same scan finds {natural_list(quoted_imports)} at its visible boundary." if quoted_imports else ""
            return f"Locate {primary.get('kind') or 'signal'} {primary['name']} at line {primary.get('line') or 1}. Infer only the responsibility its name and signature support.{import_note}"
        return f"{role}. Follow names and imports as reading clues; do not turn this file into a runtime call-path claim."
    return str(item.get("why") or "Read this path for a structural clue, then check the linked source before drawing a conclusion.")


def investigation_finding_for(investigation_id: str, steps: list[dict[str, Any]]) -> str:
    """State what the combined reading route supports without overclaiming."""
    paths = [str(step.get("path")) for step in steps if step.get("path")]
    implementation = next(
        (step for step in steps if step.get("kind") in {"implementation", "api", "entrypoint"}),
        None,
    )
    if not implementation:
        implementation = next(
            (step for step in steps if (step.get("readingGuide") or {}).get("symbols")),
            None,
        )
    guide = (implementation or {}).get("readingGuide") or {}
    symbols = guide.get("symbols") or []
    primary = symbols[0] if symbols else {}
    facts = guide.get("facts") or []
    declaration_fact = next((fact for fact in facts if re.search(r"declaration", str(fact.get("label", "")), re.I)), None)
    imports = [str(entry.get("source")) for entry in (guide.get("imports") or [])[:3] if entry.get("source")]
    quoted_imports = [f"“{name}”" for name in imports]
    source_note = ""
    if implementation and primary.get("name"):
        declaration_note = ""
        if declaration_fact:
            count = str(declaration_fact.get("value"))
            declaration_note = f" across {count} visible declaration{'s' if count != '1' else ''}"
        import_note = f" and references {natural_list(quoted_imports)}" if quoted_imports else ""
        source_note = (
            f" On the structural scan, {implementation['path']} opens with "
            f"{primary.get('kind') or 'signal'} {primary['name']} at line {primary.get('line') or 1}"
            f"{declaration_note}{import_note}."
        )
    elif implementation and declaration_fact:
        count = str(declaration_fact.get("value"))
        source_note = f" {implementation['path']} exposes {count} visible declaration{'s' if count != '1' else ''} in the bounded scan."

    if investigation_id == "promise-check":
        checks = [str(step["path"]) for step in steps if step.get("kind") in {"example", "test"} and step.get("path")]
        maintenance = [str(step["path"]) for step in steps if step.get("kind") == "automation" and step.get("path")]
        if not checks:
            return f"This route reaches {natural_list(maintenance or paths[1:])}, but no worked example or test file enters the investigation. It can show how the project is described or maintained, not whether its public behavior works."
        return f"This route pairs the public account with {natural_list([*checks, *maintenance])}. Compare what the project says with the worked or checked behavior available in the tree; the presence of a check does not prove that it passes."
    if investigation_id == "technical-boundary":
        manifest = next((step for step in steps if step.get("kind") == "manifest"), None)
        facts = (manifest or {}).get("readingGuide", {}).get("facts") or []
        dependency_fact = next((fact for fact in facts if re.search(r"dependenc|declaration", str(fact.get("label", "")), re.I)), None)
        if not manifest:
            return f"Start with {natural_list(paths[:3])}.{source_note} No manifest enters this bounded route, so the investigation can compare visible declarations and imports but cannot establish the project's declared packages."
        fact_note = ""
        if dependency_fact:
            fact_note = f" The manifest records {dependency_fact.get('value')} {str(dependency_fact.get('label', '')).lower()}."
        return f"Start with {natural_list(paths[:3])}.{fact_note}{source_note} Read declarations and imports as boundaries; the museum did not resolve runtime calls or prove that every package is used."
    roles = [f"{step.get('role') or str(step.get('kind') or 'reading').title()} ({step['path']})" for step in steps[:4] if step.get("path")]
    if investigation_id == "first-reading":
        return f"This short route connects {natural_list(roles)}. It offers a structural starting point, but the available categories do not support a claim about a public-to-implementation hand-off."
    return f"The route connects {natural_list(roles)}.{source_note} This exposes a defensible hand-off between public language, entry points, and implementation; it does not establish that a request executes through these files."


def build_reading_investigations(read_order: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Build cross-file questions from the same bounded evidence as the reading route."""
    available = [item for item in read_order if item.get("path")]

    def pick(kinds: list[str]) -> list[dict[str, Any]]:
        selected: list[dict[str, Any]] = []
        for kind in kinds:
            match = next((item for item in available if item.get("kind") == kind), None)
            if match:
                selected.append(match)
        return selected

    def unique_steps(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
        seen: set[str] = set()
        unique: list[dict[str, Any]] = []
        for item in items:
            path = str(item.get("path"))
            if path in seen:
                continue
            seen.add(path)
            unique.append(item)
        return unique

    definitions = [
        {
            "id": "public-path",
            "label": "Trace the public path",
            "question": "How does the project's public promise become a visible code path?",
            "why": "Begin with the project's own account, then follow the first tracked boundary into implementation.",
            "steps": unique_steps(pick(["documentation", "entrypoint", "implementation", "api"])),
        },
        {
            "id": "promise-check",
            "label": "Check the promise",
            "question": "What in the repository lets you compare a claim with exercised behavior?",
            "why": "Look for examples, checks, and maintenance automation before treating the README as proof.",
            "steps": unique_steps(pick(["documentation", "example", "test", "automation"])),
        },
        {
            "id": "technical-boundary",
            "label": "Map the technical boundary",
            "question": "What does the project declare, borrow, and implement itself?",
            "why": "Read the manifest alongside source declarations and imports to separate declared capability from observed structure.",
            "steps": unique_steps(pick(["manifest", "entrypoint", "implementation", "api", "test"])),
        },
    ]
    investigations: list[dict[str, Any]] = []
    for definition in definitions:
        steps = definition["steps"]
        if len(steps) < 2:
            continue
        investigations.append(
            {
                "id": definition["id"],
                "label": definition["label"],
                "question": definition["question"],
                "why": definition["why"],
                "steps": [
                    {
                        "path": item["path"],
                        "role": item.get("role") or str(item.get("kind") or "reading").replace("_", " ").title(),
                        "kind": item.get("kind") or "reading",
                        "prompt": investigation_prompt_for(item),
                        "evidence": item.get("evidence") or item["path"],
                    }
                    for item in steps
                ],
                "finding": investigation_finding_for(definition["id"], steps),
                "boundary": "Built from tracked paths and bounded text scans only; this investigation does not resolve runtime calls, execute code, or prove a dependency was used.",
            }
        )
    if investigations:
        return investigations
    if len(available) < 2:
        return []
    steps = available[:5]
    return [
        {
            "id": "first-reading",
            "label": "First reading",
            "question": "Which visible files give the clearest first account of this repository?",
            "why": "The available tree supports a short structural route, but not a more specific multi-file investigation.",
            "steps": [
                {
                    "path": item["path"],
                    "role": item.get("role") or str(item.get("kind") or "reading").replace("_", " ").title(),
                    "kind": item.get("kind") or "reading",
                    "prompt": investigation_prompt_for(item),
                    "evidence": item.get("evidence") or item["path"],
                }
                for item in steps
            ],
            "finding": investigation_finding_for("first-reading", steps),
            "boundary": "Built from the available reading route only; missing evidence was left out rather than invented.",
        }
    ]


def build_repository_map(files: list[str], branch: str = "main", project_name: str = "") -> dict[str, Any]:
    """Build the same full-tree reading contract used by the browser collector."""
    unique_files = sorted({path.strip("/") for path in files if path and path.strip("/")})
    directory_paths: set[str] = set()
    for path in unique_files:
        parts = path.split("/")
        for index in range(1, len(parts)):
            directory_paths.add("/".join(parts[:index]))
    directory_counts = {path: 0 for path in directory_paths}
    for path in unique_files:
        parts = path.split("/")
        for index in range(1, len(parts)):
            parent = "/".join(parts[:index])
            directory_counts[parent] = directory_counts.get(parent, 0) + 1

    sizes = tree_file_sizes()
    entries: list[dict[str, Any]] = [
        {"path": path, "type": "directory", "category": "directory", "role": role_for_path(path, True), "count": count}
        for path, count in sorted(directory_counts.items())
    ]
    extension_counts: dict[str, int] = {}
    for path in unique_files:
        extension = path_extension(path) or "(none)"
        extension_counts[extension] = extension_counts.get(extension, 0) + 1
        entries.append(
            {
                "path": path,
                "type": "file",
                "category": repository_path_category(path),
                "role": role_for_path(path),
                "extension": extension,
                "size": sizes.get(path),
            }
        )

    read_order = build_read_order(unique_files, project_name)
    previews: dict[str, str] = {}
    for item in read_order:
        preview = preview_text_for(item["path"], sizes.get(item["path"]))
        if preview:
            item["preview"] = preview
            item["readingGuide"] = build_reading_guide(item["path"], preview, truncated=len(preview) >= MAX_PREVIEW_CHARS)
            previews[item["path"]] = preview
    for item in entries:
        if item["path"] in previews:
            item["preview"] = previews[item["path"]]

    return {
        "root": "",
        "branch": branch,
        "truncated": False,
        "totalFiles": len(unique_files),
        "totalDirectories": len(directory_paths),
        "indexedEntries": len(entries),
        "extensions": [
            {"extension": extension, "count": count}
            for extension, count in sorted(extension_counts.items(), key=lambda item: (-item[1], item[0]))
        ],
        "directories": [
            {"path": path, "count": count}
            for path, count in sorted(directory_counts.items(), key=lambda item: (-item[1], item[0]))[:80]
        ],
        "readOrder": read_order,
        "investigations": build_reading_investigations(read_order),
        "entries": entries,
        "coverageNote": "Every path in the tracked HEAD tree is indexed; reading roles are inferred from names and paths.",
    }


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


def build_architecture(
    files: list[str],
    manifest_path: str | None,
    readme_path: str | None,
    language: str,
    repository_map: dict[str, Any] | None = None,
) -> dict[str, Any]:
    paths = [path for path in files if not is_generated_path(path)]
    folder_counts: dict[str, int] = {}
    for path in paths:
        if "/" not in path:
            continue
        folder = path.split("/", 1)[0]
        folder_counts[folder] = folder_counts.get(folder, 0) + 1
    folders = [
        {"name": folder, "role": role_for_path(folder, True), "evidence": folder, "fileCount": count}
        for folder, count in folder_counts.items()
    ]
    folders = sorted(folders, key=lambda item: (folder_priority(item["name"]), -item["fileCount"], item["name"].lower()))[:10]
    working_folders = [item for item in folders if not is_support_folder(item["name"])]

    entrypoint_names = re.compile(r"^(main|app|cli|server|index|__main__|manage|bin)(\.|$)", re.I)
    entry_candidates = [path for path in paths if entrypoint_names.match(path_basename(path))]
    entry_candidates += [path for path in paths if path_extension(path) in CODE_EXTENSIONS and path not in entry_candidates]
    entry_candidates = sorted(entry_candidates, key=path_read_preference)
    config_candidates = [path for path in paths if re.search(r"workspace|config|lock|test|spec", path_basename(path), re.I)]
    read_order = repository_map.get("readOrder", []) if repository_map else []
    order_path = lambda kind: next((str(item.get("path")) for item in read_order if item.get("kind") == kind), "")
    actual_entrypoints = [
        path
        for path in dict.fromkeys(
            [
                order_path("entrypoint"),
                order_path("api"),
                *entry_candidates[:3],
            ]
        )
        if path
    ][:3]
    entrypoints = actual_entrypoints or [path for path in [manifest_path, readme_path, "README.md"] if path]
    ordered_files = [
        {"name": item["path"], "role": item.get("role") or role_for_path(item["path"]), "evidence": item["path"], "why": item.get("why", "")}
        for item in read_order
        if item.get("path")
    ]
    interesting = list(dict.fromkeys(
        [path for path in [readme_path, manifest_path] if path]
        + [item["name"] for item in ordered_files]
        + entry_candidates[:4]
        + config_candidates[:4]
    ))
    file_items = [{"name": path, "role": role_for_path(path), "evidence": path} for path in interesting[:10]]
    main_folder = next((item for item in working_folders if item["name"].lower() in IMPLEMENTATION_FOLDERS), None)
    result_folder = next((item for item in working_folders if item["name"].lower() in LEARNING_FOLDERS), None)
    implementation_files = [
        item for item in file_items
        if re.search(r"source file|application script|application entry point|document entry point|presentation layer|server or request surface", item.get("role", ""), re.I)
    ]
    leading_paths = list(
        dict.fromkeys(
            [
                order_path("documentation"),
                order_path("manifest"),
                order_path("entrypoint"),
                order_path("implementation"),
                *[item["name"] for item in implementation_files[:2]],
                *[item["name"] for item in working_folders[:2]],
            ]
        )
    )[:5]
    if leading_paths:
        summary = (
            f"{language} project with {len(files)} tracked files across {repository_map.get('totalDirectories', 0) if repository_map else 0} folders. "
            f"A first reading route runs through {natural_list(leading_paths)}."
        )
    else:
        summary = f"{language} project whose work is visible mainly through its {len(files)} tracked files."
    return {
        "summary": summary,
        "flow": [
            {"label": "Person or caller", "role": "Where the request begins", "detail": "Start with the public promise, then follow the files that translate it into a working boundary.", "evidence": readme_path or order_path("documentation") or "README.md"},
            {"label": "Entry point", "role": "The front door", "detail": "The reading route identifies a tracked source or command surface before descending into helpers.", "evidence": order_path("entrypoint") or entrypoints[0]},
            {"label": "Main implementation", "role": "Where the work happens", "detail": "The implementation trail is selected from the recursive tree, not just a top-level folder name.", "evidence": order_path("implementation") or (main_folder["evidence"] if main_folder else entrypoints[0])},
            {"label": "Supporting tools", "role": "Capabilities the project borrows", "detail": "The manifest and configuration make the project's dependency and build boundaries visible.", "evidence": manifest_path or order_path("manifest") or (file_items[0]["evidence"] if file_items else readme_path or "README.md")},
            {"label": "Result", "role": "What comes back", "detail": "Examples, documentation, and checks show what the project expects a usable result to look like.", "evidence": order_path("example") or order_path("test") or (result_folder["evidence"] if result_folder else readme_path or manifest_path or "README.md")},
        ],
        "folders": folders,
        "files": file_items,
        "entrypoints": entrypoints,
        "sourceNote": (
            f"Roles are inferred from {len(files)} recursively indexed files; the suggested route never claims to have executed the project."
            if repository_map
            else "Roles are inferred from tracked names and paths; each item links back to the file or directory that supports the reading."
        ),
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


def toml_assignment_records(text: str) -> list[tuple[str, str, str, int]]:
    """Read section/key/value triples and source lines from dependency-focused TOML."""
    records: list[tuple[str, str, str, int]] = []
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
        start_line = index + 1
        key = next(group for group in assignment.groups()[:3] if group is not None)
        value = assignment.group(4)
        while not toml_value_complete(value) and index + 1 < len(lines):
            index += 1
            value += "\n" + lines[index]
        records.append((section, key, value.strip(), start_line))
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


def toml_string_records(value: str, start_line: int = 1) -> list[tuple[str, int]]:
    return [
        (html.unescape(match.group(1)), start_line + value[:match.start()].count("\n"))
        for match in re.finditer(r"[\"']([^\"']+)[\"']", value)
        if not re.search(r"include-group\s*=\s*$", value[:match.start()][-80:])
    ]


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
    if section == "dependency-groups":
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


def toml_dependency_entries(text: str, path: str) -> list[dict[str, Any]]:
    records = toml_assignment_records(text)
    entries: list[dict[str, Any]] = []
    for section, key, value, line in records:
        kind = dependency_section_kind(path, section, key)
        if not kind:
            continue
        if path == "Cargo.toml":
            nested = re.match(r"^(?:dev-|build-)?dependencies\.(.+)$", section)
            if nested:
                version = "workspace" if key == "workspace" else (toml_string_value(value) or "declared")
                entries.append({"name": nested.group(1), "version": version, "type": kind, "sourcePath": path, "line": line})
                continue
            if key.endswith(".workspace"):
                entries.append({"name": key.removesuffix(".workspace"), "version": "workspace", "type": kind, "sourcePath": path, "line": line})
                continue
            version = toml_string_value(value)
            if not version:
                version_match = re.search(r"(?:^|[,{]\s*)version\s*=\s*[\"']([^\"']+)", value)
                version = version_match.group(1) if version_match else ""
            entries.append({"name": key, "version": version or "declared", "type": kind, "sourcePath": path, "line": line})
            continue
        poetry_section = section in {"tool.poetry.dependencies", "tool.poetry.dev-dependencies"} or (
            section.startswith("tool.poetry.group.") and section.endswith(".dependencies")
        )
        if poetry_section:
            if key.lower() == "python":
                continue
            version = toml_string_value(value)
            if not version:
                version_match = re.search(r"(?:^|[,{]\s*)version\s*=\s*[\"']([^\"']+)", value)
                version = version_match.group(1) if version_match else ""
            entries.append({"name": key, "version": version or "declared", "type": kind, "sourcePath": path, "line": line})
            continue
        for spec, spec_line in toml_string_records(value, line):
            name, version = split_dependency_spec(spec)
            if name:
                entries.append({"name": name, "version": version, "type": kind, "sourcePath": path, "line": spec_line})
    return dedupe_dependencies(entries)


def read_toml_manifest(text: str, path: str) -> tuple[list[dict[str, str]], dict[str, Any]]:
    meta: dict[str, Any] = {}
    for section, key, value, _line in toml_assignment_records(text):
        if (path == "pyproject.toml" and section in {"project", "tool.poetry"}) or (path == "Cargo.toml" and section == "package"):
            if key in {"name", "description"} and not meta.get(key):
                meta[key] = toml_string_value(value)
    entries = [{key: value for key, value in entry.items() if key != "line"} for entry in toml_dependency_entries(text, path)]
    return entries[:20], meta


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
    repository_map: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Create the visitor-facing teaching contract shared by Agent and browser renders."""
    read_order = repository_map.get("readOrder", []) if repository_map else []
    route_path = lambda kind: next((str(item.get("path")) for item in read_order if item.get("kind") == kind), "")
    first_evidence = readme_path or route_path("documentation") or manifest_path or "README.md"

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
    route_evidence = [
        file_evidence(str(item.get("path")))
        for item in read_order
        if item.get("path") and item.get("kind") in {"entrypoint", "implementation", "api", "example", "test"}
    ]
    journey_evidence = [
        file_evidence(str(step.get("evidence") or first_evidence))
        for step in journey.get("steps", [])
    ]
    entrypoint_evidence = dedupe_evidence([*route_evidence, *journey_evidence], limit=5)
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
    architecture_source_files = [
        item for item in architecture.get("files", [])
        if re.search(r"source file|application script|application entry point|document entry point|presentation layer|server or request surface", item.get("role", ""), re.I)
    ]
    route_source_files = [
        {"name": str(item.get("path")), "role": str(item.get("role") or role_for_path(str(item.get("path")))), "evidence": str(item.get("path"))}
        for item in read_order
        if item.get("kind") in {"entrypoint", "implementation", "api"}
    ]
    source_files = list({str(item.get("name")): item for item in [*route_source_files, *architecture_source_files] if item.get("name")}.values())
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
    if repository_map and read_order:
        architecture_discovery += (
            f" The atlas selected {len(read_order)} reading stops from {repository_map.get('totalFiles', 0)} tracked files; "
            "these are suggested paths, not proof of runtime execution."
        )
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
    branch = maybe_run("symbolic-ref", "--short", "HEAD") or "main"
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
    repository_map = build_repository_map(files, branch, slug)
    architecture = build_architecture(files, manifest_path, readme_path, language, repository_map)
    journey = build_journey(files, readme_path, manifest_path, architecture)
    learning = build_learning(orientation, journey, architecture, analysis, dependencies, readme_path, manifest_path, repository_map)
    artifact = {
        "version": "1.3",
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
        "repositoryMap": repository_map,
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
