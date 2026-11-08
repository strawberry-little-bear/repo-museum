#!/usr/bin/env python3
"""Build a deterministic, evidence-backed Repo Museum artifact from local Git."""

from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
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


def parse_commits(limit: int = 80) -> list[dict[str, Any]]:
    raw = run("log", f"-{limit}", "--date=iso-strict", "--format=%H%x1f%h%x1f%ad%x1f%an%x1f%s")
    commits: list[dict[str, Any]] = []
    for line in raw.splitlines():
        parts = line.split("\x1f", 4)
        if len(parts) != 5:
            continue
        sha, short_sha, date, author, subject = parts
        commits.append({"sha": sha, "shortSha": short_sha, "date": date, "author": author, "subject": subject})
    return commits


def commit_stats(sha: str) -> dict[str, int]:
    raw = run("show", "--numstat", "--format=", sha)
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
        for section, kind in (("dependencies", "runtime"), ("devDependencies", "build")):
            for name, version in list((package.get(section) or {}).items())[:20]:
                entries.append({"name": name, "version": str(version), "type": kind, "sourcePath": path})
        return entries, {"name": package.get("name"), "description": package.get("description")}
    entries = []
    pattern = re.compile(r"^\s*([A-Za-z0-9_.@/-]+)\s*(?:=|:|>=|==|\^)?\s*[\"']?([^\"' #]+)")
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith(("#", "[")):
            continue
        match = pattern.match(line)
        if match and match.group(1).lower() not in {"python", "name", "version", "edition"}:
            entries.append({"name": match.group(1), "version": match.group(2), "type": "runtime", "sourcePath": path})
    return entries[:20], {}


def event(commit: dict[str, Any], kind: str = "commit", title: str | None = None) -> dict[str, Any]:
    stats = commit_stats(commit["sha"])
    return {
        "date": commit["date"],
        "title": title or commit["subject"][:72],
        "meta": f"{commit['author']} · {stats['files']} files · +{stats['additions']}/-{stats['deletions']}",
        "sha": commit["shortSha"],
        "kind": kind,
        "url": f"commit://{commit['sha']}",
        "source": {"type": "commit", "ref": commit["sha"], "label": commit["shortSha"]},
    }


def find_turning_point(commits: list[dict[str, Any]]) -> tuple[dict[str, Any], dict[str, int]]:
    scored = []
    for commit in commits:
        stats = commit_stats(commit["sha"])
        keyword = 18 if re.search(r"\b(rewrite|refactor|migrat|release|v[0-9]|architecture|workspace|plugin)\b", commit["subject"], re.I) else 0
        scored.append((stats["additions"] + stats["deletions"] + stats["files"] * 8 + keyword, commit, stats))
    return max(scored, key=lambda item: item[0])[1:] if scored else ({}, {})


def build_analysis(commits: list[dict[str, Any]], files: list[str], dependencies: list[dict[str, str]]) -> dict[str, Any]:
    if not commits:
        return {"headline": "The archive is waiting for its first record.", "thesis": "No local Git history was available for a grounded account of change.", "confidence": "limited", "arc": [], "signals": []}
    oldest = commits[-1]
    newest = commits[0]
    turning, turning_stats = find_turning_point(commits)
    language_signal = "JavaScript" if any(path.endswith((".js", ".ts", ".tsx")) for path in files) else "Python" if any(path.endswith(".py") for path in files) else "a mixed stack"
    arc = [
        {"label": "Origin", "title": oldest["subject"][:64], "summary": f"The oldest visible record starts the project with {oldest['author']} on {oldest['date'][:10]}.", "evidence": [{"type": "commit", "ref": oldest["sha"], "label": oldest["shortSha"]}]},
        {"label": "Turning point", "title": turning["subject"][:64], "summary": f"This is the largest observed change in the local sample: {turning_stats.get('files', 0)} files, +{turning_stats.get('additions', 0)}/-{turning_stats.get('deletions', 0)} lines.", "evidence": [{"type": "commit", "ref": turning["sha"], "label": turning["shortSha"]}]},
        {"label": "Now", "title": newest["subject"][:64], "summary": f"The latest record keeps the archive current in {language_signal}, with {len(dependencies)} direct dependencies found in the visible manifests.", "evidence": [{"type": "commit", "ref": newest["sha"], "label": newest["shortSha"]}]},
    ]
    return {
        "headline": f"A project shaped by {len(commits)} visible changes.",
        "thesis": f"The local record reads as a {language_signal} project whose story is best understood through its first commit, its largest structural movement, and its current cadence.",
        "confidence": "evidence-backed local analysis",
        "arc": arc,
        "signals": [
            {"label": "Observed commits", "value": str(len(commits)), "detail": "local Git sample"},
            {"label": "Direct dependencies", "value": str(len(dependencies)), "detail": "visible manifests"},
            {"label": "Tracked files", "value": str(len(files)), "detail": "current tree"},
        ],
    }


def main() -> None:
    if not (ROOT / ".git").exists():
        raise SystemExit("Repo Museum Agent must run from a Git repository root.")
    url = git_url()
    slug = repo_slug(url)
    commits = parse_commits()
    files = tree_files()
    dependencies: list[dict[str, str]] = []
    manifest_path = None
    manifest_meta: dict[str, Any] = {}
    for candidate in MANIFEST_NAMES:
        entries, meta = read_manifest(candidate)
        if entries:
            dependencies = entries
            manifest_path = candidate
            manifest_meta = meta
            break
    tags = run("tag", "--sort=-creatordate").splitlines()[:8]
    events = [event(commit) for commit in commits[:8]]
    for tag in tags[:3]:
        matching = next((commit for commit in commits if tag in commit["subject"]), None)
        if matching:
            events.append(event(matching, "release", f"Tag {tag}"))
    events.sort(key=lambda item: item["date"], reverse=True)
    analysis = build_analysis(commits, files, dependencies)
    branch = maybe_run("symbolic-ref", "--short", "HEAD") or "main"
    artifact = {
        "version": "1.0",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "project": {"repo": slug, "name": slug.replace("/", " / "), "htmlUrl": url, "description": manifest_meta.get("description") or "A local repository examined through its own evidence.", "manifestPath": manifest_path, "defaultBranch": branch},
        "repo": slug,
        "name": slug.replace("/", " / "),
        "htmlUrl": url or "",
        "description": manifest_meta.get("description") or "A local repository examined through its own evidence.",
        "defaultBranch": branch,
        "createdAt": commits[-1]["date"] if commits else None,
        "pushedAt": commits[0]["date"] if commits else None,
        "language": "Mixed stack",
        "license": "Local record",
        "stars": None,
        "forks": None,
        "issues": None,
        "contributors": [{"login": name} for name in list(dict.fromkeys(commit["author"] for commit in commits[:8]))[:6]],
        "events": events[:10],
        "dependencies": dependencies[:12],
        "manifestPath": manifest_path,
        "commits": [{"sha": commit["shortSha"], "date": commit["date"][:10], "score": min(100, 20 + sum(commit_stats(commit["sha"]).values()))} for commit in commits[:20]],
        "analysis": analysis,
        "sources": [{"type": "commit", "ref": commit["sha"], "label": commit["shortSha"]} for commit in commits[:10]] + ([{"type": "file", "ref": manifest_path, "label": manifest_path}] if manifest_path else []),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()

