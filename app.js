const API_ROOT = "https://api.github.com";

const demoData = {
  repo: "vitejs/vite",
  name: "vitejs / vite",
  description: "Next generation frontend tooling. It is fast!",
  htmlUrl: "https://github.com/vitejs/vite",
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
};

const state = {
  data: demoData,
  isPlaying: false,
  isMuted: false,
  audioContext: null,
  scoreTimer: null,
  scoreIndex: 0,
  currentRepo: "vitejs/vite",
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
      return Object.entries({ ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) }).slice(0, 12).map(([name, version]) => ({ name, version, type: packageJson.devDependencies?.[name] ? "build" : "runtime" }));
    } catch { return []; }
  }
  return contents.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("[") && /[=:]/.test(trimmed);
  }).slice(0, 12).map((line) => {
    const match = line.trim().match(/^([A-Za-z0-9_.-]+)\s*(?:=|:|>=|==)\s*["']?([^"' ]+)/);
    return match ? { name: match[1], version: match[2], type: "runtime" } : null;
  }).filter(Boolean);
}

function commitToEvent(commit, index, total) {
  const message = commit.commit?.message?.split("\n")[0] || "A new mark in the archive";
  return { date: formatDate(commit.commit?.author?.date), title: message.slice(0, 58), meta: `${commit.commit?.author?.name || commit.author?.login || "Unknown author"} · public commit`, sha: shortenSha(commit.sha), kind: index === total - 1 ? "origin" : "commit" };
}

function buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies) {
  const repoName = `${repository.owner.login} / ${repository.name}`;
  const releaseEvents = releases.slice(0, 3).map((release) => ({ date: formatDate(release.published_at || release.created_at), title: `Release ${release.tag_name}`, meta: `${release.name || "A new public release"} · ${release.author?.login || "maintainers"}`, sha: release.tag_name, kind: "release" }));
  const commitEvents = commits.slice(0, 5).map((commit, index) => commitToEvent(commit, index, commits.length));
  const events = [...releaseEvents, ...commitEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (events.length === 0) events.push({ date: formatDate(repository.created_at), title: "The first room opens", meta: "Repository created · public record", sha: "origin", kind: "origin" });
  const language = repository.language || Object.keys(languages)[0] || "Mixed stack";
  return {
    repo, name: repoName, description: repository.description || "A public repository with a story still being written.", htmlUrl: repository.html_url,
    createdAt: repository.created_at, pushedAt: repository.pushed_at, language, license: repository.license?.spdx_id || "Unspecified",
    stars: repository.stargazers_count, forks: repository.forks_count, issues: repository.open_issues_count, contributors,
    events: events.slice(0, 6), dependencies, commits: commits.slice(0, 12).map((commit, index) => ({ sha: shortenSha(commit.sha), date: formatDate(commit.commit?.author?.date, false), score: 22 + ((commit.sha.charCodeAt(0) * 7 + index * 23) % 78) })),
  };
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
  for (const manifest of manifests) {
    const contents = await readManifest(repo, manifest);
    dependencies = parseDependencies(contents, manifest);
    if (dependencies.length) break;
  }
  return buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies);
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
    const title = document.createElement("h5"); title.className = "timeline-title"; title.textContent = event.title;
    const meta = document.createElement("p"); meta.className = "timeline-meta"; meta.textContent = event.meta;
    const sha = document.createElement("span"); sha.className = "timeline-sha"; sha.textContent = event.sha;
    copy.append(title, meta, sha); item.append(date, dot, copy); return item;
  }));
  el("history-note").textContent = data.events.length ? `Showing ${data.events.length} public markers in this collection` : "No public markers observed";
}

function renderAquarium(data) {
  const stage = el("aquarium-stage");
  const list = el("dependency-list");
  const dependencies = (data.dependencies || []).slice(0, 8);
  el("dependency-count").textContent = `${dependencies.length} specimen${dependencies.length === 1 ? "" : "s"} observed`;
  if (!dependencies.length) {
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
    const node = document.createElement("div"); node.className = "aquarium-node"; node.style.left = `${left}%`; node.style.top = `${top}%`;
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const version = document.createElement("small"); version.textContent = dependency.version || "direct";
    node.append(name, version); stage.append(node);
    const link = document.createElement("i"); link.className = "aquarium-link"; const x1 = 50; const y1 = 50; const x2 = left + 5; const y2 = top + 5; const dx = x2 - x1; const dy = y2 - y1;
    link.style.left = `${x1}%`; link.style.top = `${y1}%`; link.style.width = `${Math.sqrt(dx * dx + dy * dy)}%`; link.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`; stage.prepend(link);
  });
  list.replaceChildren(...dependencies.slice(0, 6).map((dependency) => {
    const item = document.createElement("div"); item.className = "dependency-item";
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
  el("collection-status").textContent = data.repo === demoData.repo ? "Demo collection · ready to explore" : `Public collection · ${data.repo}`;
  el("project-number").textContent = data.repo === demoData.repo ? "001" : "LIVE";
  el("project-title").textContent = data.name;
  el("project-description").textContent = data.description;
  el("source-link").href = data.htmlUrl;
  el("poster-language").textContent = (data.language || "MIXED STACK").toUpperCase();
  el("poster-license").textContent = data.license || "OPEN";
  el("poster-title").textContent = (data.repo.split("/")[1] || "PROJECT").toUpperCase();
  el("poster-stars").textContent = `${formatNumber(data.stars)} ★`;
  el("fact-created").textContent = formatDate(data.createdAt);
  el("fact-pushed").textContent = relativeDate(data.pushedAt);
  el("fact-language").textContent = data.language || "Mixed stack";
  el("fact-license").textContent = data.license || "Unspecified";
  renderStats(data); renderAvatars(data); renderTimeline(data); renderAquarium(data); renderScore(data);
}

async function loadRepo(repo) {
  setLoading(true);
  el("collection-status").textContent = `Reading ${repo} · public records`;
  try {
    const data = await fetchMuseumData(repo);
    render(data); el("museum-content").hidden = false; el("error-state").hidden = true; document.title = `${data.name} · Repo Museum`;
    history.replaceState({}, "", `?repo=${encodeURIComponent(repo)}`);
    document.querySelector("#exhibitions").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    const message = error.status === 403
      ? "GitHub is temporarily rate-limiting anonymous visitors. Try again soon, or open the demo collection while the archive cools down."
      : error.message || "We could not read that repository.";
    showError(message);
  }
}

function openDemo() {
  render(demoData); el("museum-content").hidden = false; el("error-state").hidden = true; el("loading-state").hidden = true; el("repo-input").value = demoData.repo; history.replaceState({}, "", window.location.pathname); document.title = "Repo Museum - an exhibition for every repository";
}

function showToast(message) {
  const toast = el("toast"); toast.textContent = message; toast.classList.add("is-visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function toggleOpera() {
  state.isPlaying = !state.isPlaying; const bars = el("score-bars"); bars.classList.toggle("is-playing", state.isPlaying); el("opera-toggle-icon").textContent = state.isPlaying ? "Ⅱ" : "▶"; el("opera-toggle-label").textContent = state.isPlaying ? "Pause the score" : "Play the score";
  if (state.isPlaying) {
    state.scoreIndex = 0; state.audioContext ||= new AudioContext();
    state.scoreTimer = window.setInterval(() => { if (!state.isMuted) playTone(state.scoreIndex); state.scoreIndex = (state.scoreIndex + 1) % Math.max(1, state.data.commits?.length || 12); }, 580 / Number(el("speed-select").value));
  } else { window.clearInterval(state.scoreTimer); }
}

function playTone(index) {
  if (!state.audioContext) return;
  const oscillator = state.audioContext.createOscillator(); const gain = state.audioContext.createGain(); oscillator.type = index % 3 === 0 ? "triangle" : "sine"; oscillator.frequency.value = 190 + (index % 7) * 42; gain.gain.setValueAtTime(0.0001, state.audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.045, state.audioContext.currentTime + 0.025); gain.gain.exponentialRampToValueAtTime(0.0001, state.audioContext.currentTime + 0.28); oscillator.connect(gain).connect(state.audioContext.destination); oscillator.start(); oscillator.stop(state.audioContext.currentTime + 0.3);
}

document.addEventListener("DOMContentLoaded", () => {
  render(demoData);
  const queryRepo = new URLSearchParams(window.location.search).get("repo");
  if (queryRepo && parseRepo(queryRepo)) { el("repo-input").value = queryRepo; loadRepo(parseRepo(queryRepo)); }
  el("repo-form").addEventListener("submit", (event) => { event.preventDefault(); const repo = parseRepo(el("repo-input").value); if (!repo) { showToast("Enter a GitHub owner/repository first."); el("repo-input").focus(); return; } loadRepo(repo); });
  el("demo-button").addEventListener("click", openDemo); el("error-demo-button").addEventListener("click", openDemo);
  el("random-button").addEventListener("click", () => { const repos = ["sindresorhus/ky", "tailwindlabs/tailwindcss", "denoland/deno", "pallets/flask", "rust-lang/rustlings"]; const repo = repos[Math.floor(Math.random() * repos.length)]; el("repo-input").value = repo; loadRepo(repo); });
  document.querySelectorAll(".index-item").forEach((button) => button.addEventListener("click", () => { document.getElementById(button.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" }); document.querySelectorAll(".index-item").forEach((item) => item.classList.remove("is-active")); button.classList.add("is-active"); }));
  el("share-button").addEventListener("click", async () => { const url = `${window.location.origin}${window.location.pathname}?repo=${encodeURIComponent(state.currentRepo)}`; try { await navigator.clipboard.writeText(url); showToast("Share link copied to clipboard."); } catch { showToast(url); } });
  el("opera-toggle").addEventListener("click", toggleOpera);
  el("mute-button").addEventListener("click", () => { state.isMuted = !state.isMuted; el("mute-button").textContent = state.isMuted ? "×" : "♫"; el("mute-button").title = state.isMuted ? "Unmute score" : "Mute score"; });
  el("speed-select").addEventListener("change", () => { if (state.isPlaying) { toggleOpera(); toggleOpera(); } });
});
