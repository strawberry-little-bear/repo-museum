const API_ROOT = "https://api.github.com";

const demoData = {
  repo: "vitejs/vite",
  name: "vitejs / vite",
  description: "Next generation frontend tooling. It is fast!",
  htmlUrl: "https://github.com/vitejs/vite",
  defaultBranch: "main",
  manifestPath: "package.json",
  createdAt: "2020-05-13T00:00:00Z",
  pushedAt: "2025-03-18T00:00:00Z",
  language: "JavaScript",
  license: "MIT",
  stars: 74200,
  forks: 6700,
  issues: 830,
  contributors: [
    { login: "yyx990803", avatar_url: "https://avatars.githubusercontent.com/u/499550?v=4" },
    { login: "sapphi-red", avatar_url: "https://avatars.githubusercontent.com/u/44733677?v=4" },
    { login: "bluwy", avatar_url: "https://avatars.githubusercontent.com/u/63949270?v=4" },
    { login: "antfu", avatar_url: "https://avatars.githubusercontent.com/u/11247099?v=4" },
  ],
  events: [
    { date: "Mar 18, 2025", title: "A fresh layer of paint", meta: "feat: improve dev server overlay · yyx990803", sha: "9c9b2a1", kind: "commit" },
    { date: "Feb 25, 2025", title: "The ecosystem widens", meta: "release v6.1.0 · 41 contributors", sha: "v6.1.0", kind: "release" },
    { date: "Jan 17, 2025", title: "A small change with a long shadow", meta: "refactor: shared module graph · sapphi-red", sha: "1a82d6c", kind: "commit" },
    { date: "Nov 08, 2024", title: "The toolkit settles into place", meta: "release v6.0.0 · 52 contributors", sha: "v6.0.0", kind: "release" },
    { date: "May 13, 2020", title: "The first room opens", meta: "Initial commit · Evan You", sha: "9a4f3cf", kind: "origin" },
  ],
  dependencies: [
    { name: "esbuild", version: "^0.25.0", type: "build" },
    { name: "rollup", version: "^4.30.1", type: "build" },
    { name: "postcss", version: "^8.5.3", type: "runtime" },
    { name: "chokidar", version: "^4.0.3", type: "runtime" },
    { name: "picocolors", version: "^1.1.1", type: "runtime" },
    { name: "sirv", version: "^3.0.1", type: "runtime" },
  ],
  commits: [
    { sha: "9c9b2a1", date: "Mar 18", score: 84 }, { sha: "1f4c8ab", date: "Mar 12", score: 35 },
    { sha: "1a82d6c", date: "Mar 03", score: 66 }, { sha: "6b0c5d1", date: "Feb 25", score: 48 },
    { sha: "a77d19f", date: "Feb 19", score: 92 }, { sha: "0bc97aa", date: "Feb 08", score: 30 },
    { sha: "4db2fca", date: "Jan 31", score: 53 }, { sha: "bb4a920", date: "Jan 17", score: 74 },
    { sha: "ed3a8a0", date: "Jan 09", score: 44 }, { sha: "fa3b120", date: "Dec 22", score: 59 },
    { sha: "18a9c12", date: "Dec 15", score: 37 }, { sha: "a8321ce", date: "Dec 02", score: 69 },
  ],
  analysis: {
    headline: "A fast-moving tool that keeps widening its room.",
    thesis: "The public record reads as a project that began with a focused development tool, then expanded its architecture and ecosystem without losing the speed that defines its identity.",
    confidence: "Demo curator reading",
    arc: [
      { label: "Origin", title: "The first room opens", summary: "A compact tool takes shape around a clear promise: make frontend development feel immediate.", evidence: [{ type: "commit", ref: "9a4f3cf", label: "9a4f3cf" }] },
      { label: "Turning point", title: "The ecosystem widens", summary: "Release markers and shared module work show the project moving from a useful tool toward a broader platform.", evidence: [{ type: "release", ref: "v6.1.0", label: "v6.1.0" }] },
      { label: "Now", title: "A fresh layer of paint", summary: "Recent changes keep the developer-facing surface active while the surrounding dependency system stays deliberately visible.", evidence: [{ type: "commit", ref: "9c9b2a1", label: "9c9b2a1" }] },
    ],
    signals: [
      { label: "Observed commits", value: "12", detail: "recent public markers" },
      { label: "Direct dependencies", value: "6", detail: "package manifest" },
      { label: "Visible releases", value: "2", detail: "history hall" },
    ],
  },
};

const state = {
  data: demoData,
  isPlaying: false,
  isMuted: false,
  audioContext: null,
  scoreTimer: null,
  scoreIndex: 0,
  currentRepo: "vitejs/vite",
  artifactPath: null,
  mode: "demo",
};

const el = (id) => document.getElementById(id);

function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatDate(value, withYear = true) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(withYear ? { year: "numeric" } : {}) }).format(new Date(value));
}

function relativeDate(value) {
  if (!value) return "—";
  const days = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 365)} years ago`;
}

function shortenSha(sha) {
  return sha ? sha.slice(0, 7) : "—";
}

function parseRepo(input) {
  const value = input.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/^\//, "").replace(/\.git\/?$/, "");
  const parts = value.split("/").filter(Boolean);
  if (parts.length !== 2 || parts.some((part) => !/^[a-z\d_.-]+$/i.test(part))) return null;
  return `${parts[0]}/${parts[1]}`;
}

function githubFetch(path) {
  return fetch(`${API_ROOT}${path}`, { headers: { Accept: "application/vnd.github+json" } }).then(async (response) => {
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Repository not found or not public." : `GitHub returned ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  });
}

async function readManifest(repo, path) {
  try {
    const file = await githubFetch(`/repos/${repo}/contents/${path}`);
    if (!file.content) return null;
    return decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
  } catch {
    return null;
  }
}

function parseDependencies(contents, path) {
  if (!contents) return [];
  if (path === "package.json") {
    try {
      const packageJson = JSON.parse(contents);
      return Object.entries({ ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) }).slice(0, 12).map(([name, version]) => ({ name, version, type: packageJson.devDependencies?.[name] ? "build" : "runtime", sourcePath: path }));
    } catch { return []; }
  }
  return contents.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("[") && /[=:]/.test(trimmed);
  }).slice(0, 12).map((line) => {
    const match = line.trim().match(/^([A-Za-z0-9_.-]+)\s*(?:=|:|>=|==)\s*["']?([^"' ]+)/);
    return match ? { name: match[1], version: match[2], type: "runtime", sourcePath: path } : null;
  }).filter(Boolean);
}

function commitToEvent(commit, index, total) {
  const message = commit.commit?.message?.split("\n")[0] || "A new mark in the archive";
  return { date: formatDate(commit.commit?.author?.date), title: message.slice(0, 58), meta: `${commit.commit?.author?.name || commit.author?.login || "Unknown author"} · public commit`, sha: shortenSha(commit.sha), kind: index === total - 1 ? "origin" : "commit", url: commit.html_url || `https://github.com/${commit.committer?.login || ""}` };
}

function buildBrowserAnalysis(data) {
  const events = data.events || [];
  const commits = data.commits || [];
  const first = events[events.length - 1] || { title: "The first room opens", sha: "origin", date: data.createdAt };
  const latest = events[0] || { title: "The latest public record", sha: "latest", date: data.pushedAt };
  const turning = events.find((event) => event.kind === "release") || events[Math.min(1, events.length - 1)] || latest;
  return {
    headline: `${data.name.split("/").pop()?.trim() || "This project"} is a story of visible change.`,
    thesis: `The public record begins with “${first.title}” and now reads through ${commits.length || events.length} recent markers. The most legible turn is “${turning.title}”, which gives this collection a shape beyond a list of metrics.`,
    confidence: "Browser evidence reading",
    arc: [
      { label: "Origin", title: first.title, summary: `The earliest visible marker in this public scan, dated ${first.date || "the beginning"}.`, evidence: [{ type: first.kind || "commit", ref: first.sha, label: first.sha }] },
      { label: "Turning point", title: turning.title, summary: "A release or structural marker selected from the public history as the clearest change in the current scan.", evidence: [{ type: turning.kind || "commit", ref: turning.sha, label: turning.sha }] },
      { label: "Now", title: latest.title, summary: `The newest public marker currently available to the browser, dated ${latest.date || "now"}.`, evidence: [{ type: latest.kind || "commit", ref: latest.sha, label: latest.sha }] },
    ],
    signals: [
      { label: "Observed markers", value: String(events.length), detail: "public history scan" },
      { label: "Direct dependencies", value: String((data.dependencies || []).length), detail: data.manifestPath || "visible manifests" },
      { label: "Recent commits", value: String(commits.length), detail: "commit opera" },
    ],
  };
}

function buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath) {
  const repoName = `${repository.owner.login} / ${repository.name}`;
  const releaseEvents = releases.slice(0, 3).map((release) => ({ date: formatDate(release.published_at || release.created_at), title: `Release ${release.tag_name}`, meta: `${release.name || "A new public release"} · ${release.author?.login || "maintainers"}`, sha: release.tag_name, kind: "release", url: release.html_url }));
  const commitEvents = commits.slice(0, 5).map((commit, index) => commitToEvent(commit, index, commits.length));
  const events = [...releaseEvents, ...commitEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (events.length === 0) events.push({ date: formatDate(repository.created_at), title: "The first room opens", meta: "Repository created · public record", sha: "origin", kind: "origin", url: repository.html_url });
  const language = repository.language || Object.keys(languages)[0] || "Mixed stack";
  const data = {
    repo, name: repoName, description: repository.description || "A public repository with a story still being written.", htmlUrl: repository.html_url, defaultBranch: repository.default_branch || "main",
    createdAt: repository.created_at, pushedAt: repository.pushed_at, language, license: repository.license?.spdx_id || "Unspecified",
    stars: repository.stargazers_count, forks: repository.forks_count, issues: repository.open_issues_count, contributors,
    events: events.slice(0, 6), dependencies, manifestPath, commits: commits.slice(0, 12).map((commit, index) => ({ sha: shortenSha(commit.sha), date: formatDate(commit.commit?.author?.date, false), score: 22 + ((commit.sha.charCodeAt(0) * 7 + index * 23) % 78) })),
  };
  data.analysis = buildBrowserAnalysis(data);
  return data;
}

async function fetchMuseumData(repo) {
  const [repository, commits, releases, contributors, languages] = await Promise.all([
    githubFetch(`/repos/${repo}`),
    githubFetch(`/repos/${repo}/commits?per_page=12`),
    githubFetch(`/repos/${repo}/releases?per_page=5`),
    githubFetch(`/repos/${repo}/contributors?per_page=6`),
    githubFetch(`/repos/${repo}/languages`),
  ]);
  const manifests = ["package.json", "pyproject.toml", "requirements.txt", "Cargo.toml"];
  let dependencies = [];
  let manifestPath = null;
  for (const manifest of manifests) {
    const contents = await readManifest(repo, manifest);
    dependencies = parseDependencies(contents, manifest);
    if (dependencies.length) { manifestPath = manifest; break; }
  }
  return buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath);
}

function setLoading(isLoading) {
  el("loading-state").hidden = !isLoading;
  el("museum-content").hidden = isLoading;
  el("error-state").hidden = true;
}

function showError(message) {
  el("loading-state").hidden = true;
  el("museum-content").hidden = true;
  el("error-state").hidden = false;
  el("collection-status").textContent = `Collection unavailable · ${state.currentRepo}`;
  el("error-message").textContent = message;
}

function renderStats(data) {
  const stats = [
    ["Stars", formatNumber(data.stars)],
    ["Forks", formatNumber(data.forks)],
    ["Open issues", formatNumber(data.issues)],
    ["Observed", relativeDate(data.pushedAt)],
  ];
  el("stat-strip").replaceChildren(...stats.map(([label, value]) => {
    const item = document.createElement("div"); item.className = "stat";
    const labelNode = document.createElement("span"); labelNode.className = "stat-label"; labelNode.textContent = label;
    const valueNode = document.createElement("strong"); valueNode.className = "stat-value"; valueNode.textContent = value;
    item.append(labelNode, valueNode); return item;
  }));
}

function renderAvatars(data) {
  const stack = el("avatar-stack");
  stack.replaceChildren(...(data.contributors || []).slice(0, 4).map((contributor) => {
    if (!contributor.avatar_url) { const initials = document.createElement("span"); initials.className = "avatar-fallback"; initials.textContent = (contributor.login || "?").slice(0, 1).toUpperCase(); initials.title = contributor.login || "Contributor"; return initials; }
    const image = document.createElement("img"); image.src = contributor.avatar_url; image.alt = contributor.login || "Contributor"; image.title = contributor.login || "Contributor"; return image;
  }));
  el("fact-contributors").textContent = data.contributors?.length ? `${formatNumber(data.contributors.length)}+ visible` : "Public record";
}

function renderTimeline(data) {
  const timeline = el("timeline");
  timeline.replaceChildren(...data.events.map((event) => {
    const item = document.createElement("article"); item.className = "timeline-item";
    const date = document.createElement("time"); date.className = "timeline-date"; date.textContent = event.date;
    const dot = document.createElement("span"); dot.className = "timeline-dot";
    const copy = document.createElement("div");
    const title = document.createElement("h5"); title.className = "timeline-title";
    const sourceRef = event.source?.ref || event.sha;
    const sourceUrl = event.url?.startsWith("commit://") ? `${data.htmlUrl}/commit/${sourceRef}` : event.url;
    const titleLink = document.createElement("a"); titleLink.href = sourceUrl || `${data.htmlUrl}/commits`; titleLink.target = "_blank"; titleLink.rel = "noreferrer"; titleLink.textContent = event.title; title.append(titleLink);
    const meta = document.createElement("p"); meta.className = "timeline-meta"; meta.textContent = event.meta;
    const sha = document.createElement("a"); sha.className = "timeline-sha"; sha.href = sourceUrl || `${data.htmlUrl}/commits`; sha.target = "_blank"; sha.rel = "noreferrer"; sha.textContent = `${event.sha} ↗`;
    copy.append(title, meta, sha); item.append(date, dot, copy); return item;
  }));
  el("history-note").textContent = data.events.length ? `Showing ${data.events.length} public markers in this collection` : "No public markers observed";
  el("history-source").href = `${data.htmlUrl}/commits`;
}

function renderAnalysis(data) {
  const analysis = data.analysis || buildBrowserAnalysis(data);
  el("analysis-headline").textContent = analysis.headline || "A project shaped by its own trail.";
  el("analysis-thesis").textContent = analysis.thesis || "The archive is still being read.";
  el("analysis-confidence").textContent = analysis.confidence || "Evidence-backed reading";
  el("story-arc").replaceChildren(...(analysis.arc || []).slice(0, 3).map((chapter) => {
    const article = document.createElement("article"); article.className = "story-chapter";
    const label = document.createElement("span"); label.className = "story-label"; label.textContent = chapter.label || "Chapter";
    const title = document.createElement("h6"); title.textContent = chapter.title || "Untitled record";
    const summary = document.createElement("p"); summary.textContent = chapter.summary || "No supporting note was supplied.";
    const evidence = document.createElement("div"); evidence.className = "story-evidence";
    (chapter.evidence || []).slice(0, 2).forEach((item) => {
      const chip = document.createElement("a");
      const ref = item.ref || item.label || "";
      const base = data.htmlUrl || "#";
      chip.href = item.url || (item.type === "file" ? `${base}/blob/${data.defaultBranch || "main"}/${ref}` : item.type === "release" ? `${base}/releases/tag/${ref}` : `${base}/commit/${ref}`);
      chip.target = "_blank"; chip.rel = "noreferrer"; chip.textContent = `${item.label || ref || "evidence"} ↗`; evidence.append(chip);
    });
    article.append(label, title, summary, evidence); return article;
  }));
  el("analysis-signals").replaceChildren(...(analysis.signals || []).slice(0, 3).map((signal) => {
    const item = document.createElement("div"); item.className = "analysis-signal";
    const value = document.createElement("strong"); value.textContent = signal.value || "—";
    const label = document.createElement("span"); label.textContent = signal.label || "Signal";
    const detail = document.createElement("small"); detail.textContent = signal.detail || "";
    item.append(value, label, detail); return item;
  }));
}

function renderAquarium(data) {
  const stage = el("aquarium-stage");
  const list = el("dependency-list");
  const dependencies = (data.dependencies || []).slice(0, 8);
  const aquariumPanel = document.getElementById("hall-dependencies");
  const aquariumIndex = document.querySelector('.index-item[data-target="hall-dependencies"]');
  const hasDependencies = dependencies.length > 0;
  aquariumPanel.hidden = !hasDependencies;
  aquariumIndex.hidden = !hasDependencies;
  el("dependency-count").textContent = `${dependencies.length} specimen${dependencies.length === 1 ? "" : "s"} observed`;
  el("dependency-source").href = data.manifestPath ? `${data.htmlUrl}/blob/${data.defaultBranch || "main"}/${data.manifestPath}` : `${data.htmlUrl}/tree/${data.defaultBranch || "main"}`;
  if (!hasDependencies) {
    stage.replaceChildren(Object.assign(document.createElement("div"), { className: "empty-aquarium", textContent: "No manifest dependencies surfaced in the public scan." }));
    list.replaceChildren();
    return;
  }
  stage.replaceChildren();
  const center = document.createElement("div"); center.className = "aquarium-node center";
  const centerName = document.createElement("strong"); centerName.textContent = data.repo.split("/")[1];
  const centerType = document.createElement("small"); centerType.textContent = "THE PROJECT";
  center.append(centerName, centerType); stage.append(center);
  const positions = [[12, 20], [38, 9], [72, 17], [82, 54], [54, 72], [18, 62], [7, 42], [64, 39]];
  dependencies.forEach((dependency, index) => {
    const [left, top] = positions[index % positions.length];
    const node = document.createElement("a"); node.className = "aquarium-node"; node.style.left = `${left}%`; node.style.top = `${top}%`; node.href = `${data.htmlUrl}/blob/${data.defaultBranch || "main"}/${dependency.sourcePath || data.manifestPath || "package.json"}`; node.target = "_blank"; node.rel = "noreferrer";
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const version = document.createElement("small"); version.textContent = dependency.version || "direct";
    node.append(name, version); stage.append(node);
    const link = document.createElement("i"); link.className = "aquarium-link"; const x1 = 50; const y1 = 50; const x2 = left + 5; const y2 = top + 5; const dx = x2 - x1; const dy = y2 - y1;
    link.style.left = `${x1}%`; link.style.top = `${y1}%`; link.style.width = `${Math.sqrt(dx * dx + dy * dy)}%`; link.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`; stage.prepend(link);
  });
  list.replaceChildren(...dependencies.slice(0, 6).map((dependency) => {
    const item = document.createElement("a"); item.className = "dependency-item"; item.href = `${data.htmlUrl}/blob/${data.defaultBranch || "main"}/${dependency.sourcePath || data.manifestPath || "package.json"}`; item.target = "_blank"; item.rel = "noreferrer";
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const detail = document.createElement("span"); detail.textContent = `${dependency.version || "direct"} · ${dependency.type || "runtime"}`;
    item.append(name, detail); return item;
  }));
}

function renderScore(data) {
  const commits = data.commits?.length ? data.commits : demoData.commits;
  const bars = el("score-bars"); const dates = el("score-dates");
  bars.replaceChildren(...commits.map((commit, index) => { const bar = document.createElement("i"); bar.className = "score-bar"; bar.style.setProperty("--height", `${Math.max(8, commit.score)}%`); bar.style.setProperty("--delay", `${index * 70}ms`); bar.title = `${commit.sha} · ${commit.date}`; return bar; }));
  dates.replaceChildren(...commits.map((commit) => { const date = document.createElement("span"); date.textContent = commit.date; return date; }));
}

function render(data) {
  state.data = data;
  state.currentRepo = data.repo;
  el("collection-status").textContent = state.mode === "agent" ? `Agent collection · ${data.repo}` : data.repo === demoData.repo ? "Demo collection · ready to explore" : `Public collection · ${data.repo}`;
  el("project-number").textContent = data.repo === demoData.repo ? "001" : "LIVE";
  el("project-title").textContent = data.name;
  el("project-description").textContent = data.description;
  el("source-link").href = data.htmlUrl || "#";
  el("poster-language").textContent = (data.language || "MIXED STACK").toUpperCase();
  el("poster-license").textContent = data.license || "OPEN";
  el("poster-title").textContent = (data.repo.split("/")[1] || "PROJECT").toUpperCase();
  el("poster-stars").textContent = `${formatNumber(data.stars)} ★`;
  el("fact-created").textContent = formatDate(data.createdAt);
  el("fact-pushed").textContent = relativeDate(data.pushedAt);
  el("fact-language").textContent = data.language || "Mixed stack";
  el("fact-license").textContent = data.license || "Unspecified";
  renderStats(data); renderAvatars(data); renderTimeline(data); renderAquarium(data); renderScore(data); renderAnalysis(data);
}

async function fetchMuseumArtifact(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Museum artifact returned ${response.status}.`);
  const data = await response.json();
  if (!data.repo || !data.name || !Array.isArray(data.events) || !data.analysis) throw new Error("This file is not a valid Repo Museum artifact.");
  return data;
}

async function loadArtifact(path) {
  if (state.isPlaying) stopOpera();
  state.mode = "agent"; state.artifactPath = path;
  setLoading(true); el("refresh-button").classList.add("is-loading"); el("collection-status").textContent = `Reading Agent artifact · ${path}`;
  try {
    const data = await fetchMuseumArtifact(path);
    render(data); el("loading-state").hidden = true; el("museum-content").hidden = false; el("error-state").hidden = true; document.title = `${data.name} · Repo Museum`;
    history.replaceState({}, "", `?museum=${encodeURIComponent(path)}`);
    document.querySelector("#exhibitions").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showError(error.message || "We could not read this museum artifact.");
  } finally { el("refresh-button").classList.remove("is-loading"); }
}

async function loadRepo(repo) {
  if (state.isPlaying) stopOpera();
  state.mode = "public"; state.artifactPath = null; setLoading(true);
  el("refresh-button").classList.add("is-loading");
  el("collection-status").textContent = `Reading ${repo} · public records`;
  try {
    const data = await fetchMuseumData(repo);
    render(data); el("loading-state").hidden = true; el("museum-content").hidden = false; el("error-state").hidden = true; document.title = `${data.name} · Repo Museum`;
    history.replaceState({}, "", `?repo=${encodeURIComponent(repo)}`);
    document.querySelector("#exhibitions").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    const message = error.status === 403
      ? "GitHub is temporarily rate-limiting anonymous visitors. Try again soon, or open the demo collection while the archive cools down."
      : error.message || "We could not read that repository.";
    showError(message);
  } finally {
    el("refresh-button").classList.remove("is-loading");
  }
}

function openDemo() {
  if (state.isPlaying) stopOpera();
  state.mode = "demo"; state.artifactPath = null; render(demoData); el("museum-content").hidden = false; el("error-state").hidden = true; el("loading-state").hidden = true; el("repo-input").value = demoData.repo; history.replaceState({}, "", window.location.pathname); document.title = "Repo Museum - an exhibition for every repository";
}

function showToast(message) {
  const toast = el("toast"); toast.textContent = message; toast.classList.add("is-visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function stopOpera() {
  state.isPlaying = false;
  window.clearInterval(state.scoreTimer);
  el("score-bars").classList.remove("is-playing");
  el("opera-toggle-icon").textContent = "▶";
  el("opera-toggle-label").textContent = "Play the score";
}

function toggleOpera() {
  state.isPlaying = !state.isPlaying; const bars = el("score-bars"); bars.classList.toggle("is-playing", state.isPlaying); el("opera-toggle-icon").textContent = state.isPlaying ? "Ⅱ" : "▶"; el("opera-toggle-label").textContent = state.isPlaying ? "Pause the score" : "Play the score";
  if (state.isPlaying) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { stopOpera(); showToast("Audio playback is not supported in this browser."); return; }
    state.scoreIndex = 0; state.audioContext ||= new AudioContextClass();
    if (state.audioContext.state === "suspended") state.audioContext.resume();
    state.scoreTimer = window.setInterval(() => { if (!state.isMuted) playTone(state.scoreIndex); state.scoreIndex = (state.scoreIndex + 1) % Math.max(1, state.data.commits?.length || 12); }, 580 / Number(el("speed-select").value));
  } else { window.clearInterval(state.scoreTimer); }
}

function playTone(index) {
  if (!state.audioContext) return;
  const oscillator = state.audioContext.createOscillator(); const gain = state.audioContext.createGain(); oscillator.type = index % 3 === 0 ? "triangle" : "sine"; oscillator.frequency.value = 190 + (index % 7) * 42; gain.gain.setValueAtTime(0.0001, state.audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.045, state.audioContext.currentTime + 0.025); gain.gain.exponentialRampToValueAtTime(0.0001, state.audioContext.currentTime + 0.28); oscillator.connect(gain).connect(state.audioContext.destination); oscillator.start(); oscillator.stop(state.audioContext.currentTime + 0.3);
}

document.addEventListener("DOMContentLoaded", () => {
  render(demoData);
  const query = new URLSearchParams(window.location.search);
  const queryMuseum = query.get("museum");
  const queryRepo = query.get("repo");
  if (queryMuseum) loadArtifact(queryMuseum);
  else if (queryRepo && parseRepo(queryRepo)) { el("repo-input").value = queryRepo; loadRepo(parseRepo(queryRepo)); }
  el("repo-form").addEventListener("submit", (event) => { event.preventDefault(); const repo = parseRepo(el("repo-input").value); if (!repo) { showToast("Enter a GitHub owner/repository first."); el("repo-input").focus(); return; } loadRepo(repo); });
  el("demo-button").addEventListener("click", openDemo); el("error-demo-button").addEventListener("click", openDemo);
  el("random-button").addEventListener("click", () => { const repos = ["sindresorhus/ky", "tailwindlabs/tailwindcss", "denoland/deno", "pallets/flask", "rust-lang/rustlings"]; const repo = repos[Math.floor(Math.random() * repos.length)]; el("repo-input").value = repo; loadRepo(repo); });
  document.querySelectorAll(".index-item").forEach((button) => button.addEventListener("click", () => { document.getElementById(button.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" }); document.querySelectorAll(".index-item").forEach((item) => item.classList.remove("is-active")); button.classList.add("is-active"); }));
  el("refresh-button").addEventListener("click", () => {
    if (state.mode === "agent" && state.artifactPath) { loadArtifact(state.artifactPath); return; }
    if (state.currentRepo === demoData.repo) { render(demoData); showToast("Demo collection refreshed."); return; }
    loadRepo(state.currentRepo);
  });
  el("share-button").addEventListener("click", async () => { const queryKey = state.mode === "agent" ? "museum" : "repo"; const queryValue = state.mode === "agent" ? state.artifactPath : state.currentRepo; const url = `${window.location.origin}${window.location.pathname}?${queryKey}=${encodeURIComponent(queryValue)}`; try { await navigator.clipboard.writeText(url); showToast("Share link copied to clipboard."); } catch { showToast(url); } });
  el("opera-toggle").addEventListener("click", toggleOpera);
  el("mute-button").addEventListener("click", () => { state.isMuted = !state.isMuted; el("mute-button").textContent = state.isMuted ? "×" : "♫"; el("mute-button").title = state.isMuted ? "Unmute score" : "Mute score"; });
  el("speed-select").addEventListener("change", () => { if (state.isPlaying) { toggleOpera(); toggleOpera(); } });

  const panels = [...document.querySelectorAll(".exhibition-panels .panel")];
  const updateActiveIndex = (entries) => entries.forEach((entry) => { if (!entry.isIntersecting) return; const active = document.querySelector(`.index-item[data-target="${entry.target.id}"]`); document.querySelectorAll(".index-item").forEach((item) => item.classList.toggle("is-active", item === active)); });
  if ("IntersectionObserver" in window) { const observer = new IntersectionObserver(updateActiveIndex, { rootMargin: "-24% 0px -62% 0px", threshold: 0 }); panels.forEach((panel) => observer.observe(panel)); }

  const visual = document.querySelector(".hero-visual");
  visual.addEventListener("pointermove", (event) => { const rect = visual.getBoundingClientRect(); visual.style.setProperty("--tilt-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`); visual.style.setProperty("--tilt-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`); });
  visual.addEventListener("pointerleave", () => { visual.style.setProperty("--tilt-x", "0px"); visual.style.setProperty("--tilt-y", "0px"); });
  window.addEventListener("scroll", () => document.body.classList.toggle("has-scrolled", window.scrollY > 16), { passive: true });
});
