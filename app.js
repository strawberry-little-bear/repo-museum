const API_ROOT = "https://api.github.com";

const demoData = {
  repo: "vitejs/vite",
  name: "vitejs / vite",
  description: "Next generation frontend tooling. It is fast!",
  htmlUrl: "https://github.com/vitejs/vite",
  defaultBranch: "main",
  manifestPath: "package.json",
  orientation: {
    what: "Vite is the workshop that turns a developer's source files into a running web app while they work, then packages that app for release.",
    oneLine: "A fast workshop between your source files and the browser.",
    use: "Develop, bundle, and preview frontend applications without waiting for the whole project to rebuild after every edit.",
    how: "Follow one file from the developer's edit, through the dev server and plugin pipeline, to the browser and finally the production build.",
    outcome: "what Vite does, why the browser can update quickly, and how its development path differs from its release path.",
    example: "Imagine saving a component. Vite notices the change, transforms only what is needed, and tells the browser to update that part instead of starting over.",
    guide: "The public description and README are the starting evidence for this orientation.",
    sourceNote: "Based on the repository description and README scan.",
  },
  learning: {
    promise: "By the end, you can explain what Vite is for, follow one change through it, and connect its current shape to the public history.",
    rooms: [
      { id: "hall-overview", label: "The foyer", question: "What is this project for?", takeaway: "Vite sits between a developer's source files and the browser: it makes the edit-to-feedback loop fast, then prepares the finished app for release.", mode: "observed", evidence: [{ type: "file", ref: "README.md", label: "README.md" }] },
      { id: "hall-journey", label: "First visitor", question: "What happens when someone uses it?", takeaway: "A source change enters the dev server, is tracked and transformed through project machinery, then returns to the browser as a focused update.", mode: "inferred", evidence: [{ type: "file", ref: "README.md", label: "README.md" }, { type: "file", ref: "packages", label: "packages/" }] },
      { id: "hall-architecture", label: "Blueprint room", question: "Which parts make that journey possible?", takeaway: "The repository is organized around packages, a dev server, a module graph, plugins, and a separate production build path.", mode: "observed", evidence: [{ type: "file", ref: "packages", label: "packages/" }, { type: "file", ref: "package.json", label: "package.json" }] },
      { id: "hall-history", label: "History hall", question: "Why does it look this way now?", takeaway: "The project began as a focused fast-feedback tool, then widened its architecture and ecosystem while keeping that original promise visible.", mode: "mixed", evidence: [{ type: "commit", ref: "9a4f3cf", label: "Origin" }, { type: "release", ref: "v6.1.0", label: "Turning point" }] },
      { id: "hall-dependencies", label: "Ecosystem room", question: "What supports it?", takeaway: "Vite borrows specialized capabilities for bundling, transforming, watching files, and serving assets instead of rebuilding every capability itself.", mode: "observed", evidence: [{ type: "file", ref: "package.json", label: "package.json" }] },
      { id: "hall-opera", label: "Exit workshop", question: "What should I remember?", takeaway: "The useful map is: purpose → request path → visible parts → historical reason. The repository becomes understandable when those four views agree.", mode: "mixed", evidence: [{ type: "file", ref: "README.md", label: "README.md" }, { type: "commit", ref: "9c9b2a1", label: "latest commit" }] },
    ],
  },
  journey: {
    intro: "Before reading files, follow the everyday moment Vite is designed to make feel instant: a developer changes source code and sees the browser respond.",
    summary: "Source change → Vite finds and transforms the affected module → the browser receives a focused update. A production build takes a different route and bundles the finished app.",
    steps: [
      { number: "01", label: "A person changes source", title: "The request begins with an edit", plain: "A developer saves a file in the app they are building.", technical: "Source files enter the development server's module graph.", evidence: "README.md" },
      { number: "02", label: "The project locates it", title: "Vite finds what is affected", plain: "The project works out which part of the app needs attention instead of treating everything as new.", technical: "The module graph tracks relationships between imported files.", evidence: "packages" },
      { number: "03", label: "The project translates it", title: "Plugins make the file usable", plain: "Files such as TypeScript or Vue components are transformed into something the browser can understand.", technical: "The plugin pipeline handles transforms and module loading.", evidence: "packages" },
      { number: "04", label: "The browser responds", title: "Only the useful change travels", plain: "The browser receives an update and the developer can keep working in place.", technical: "Hot Module Replacement keeps the running page connected to the dev server.", evidence: "packages" },
      { number: "05", label: "The project ships", title: "Release uses a bundling path", plain: "When the app is ready, the project prepares files that can be served in production.", technical: "The build path coordinates Rollup and the production plugin pipeline.", evidence: "package.json" },
    ],
    glossary: [
      { term: "module", plain: "One file or unit of code that another file can use." },
      { term: "plugin", plain: "An extension that teaches the tool how to handle a kind of file or task." },
      { term: "HMR", plain: "A short name for updating a running page without throwing away the whole session." },
    ],
    sourceNote: "A teaching model assembled from the README, package scripts, visible tree, and project vocabulary.",
  },
  architecture: {
    summary: "A multi-package JavaScript workspace organized around a dev server, a module graph, plugin packages, and the production build path.",
    flow: [
      { label: "Source files", role: "Where the developer starts", detail: "Your app, styles, and assets enter here.", evidence: "playground" },
      { label: "Dev server", role: "The responsive front door", detail: "Serves modules and watches for changes.", evidence: "packages" },
      { label: "Plugin pipeline", role: "The translator", detail: "Turns project-specific files into browser-ready modules.", evidence: "packages" },
      { label: "Module graph", role: "The map of relationships", detail: "Keeps track of what changed and what depends on it.", evidence: "packages" },
      { label: "Production build", role: "The shipping route", detail: "Packages the finished application for deployment.", evidence: "package.json" },
    ],
    folders: [
      { name: "packages", role: "Where the main product modules live", evidence: "packages" },
      { name: "playground", role: "Small projects used to exercise behavior", evidence: "playground" },
      { name: "docs", role: "Public explanations and project guidance", evidence: "docs" },
    ],
    files: [
      { name: "package.json", role: "Project scripts, workspace rules, and dependencies", evidence: "package.json" },
      { name: "pnpm-workspace.yaml", role: "Defines the package boundaries", evidence: "pnpm-workspace.yaml" },
      { name: "vitest.config.ts", role: "Test runner configuration", evidence: "vitest.config.ts" },
    ],
    entrypoints: ["package.json", "packages/", "docs/"],
    sourceNote: "Demo architecture is a representative reading of the public repository tree.",
  },
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
  visitedRooms: new Set(),
  understoodRooms: new Set(),
  entered: false,
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

function decodeBase64(value) {
  if (!value) return "";
  try {
    const binary = atob(value.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferRole(name, isFolder = false) {
  const lower = name.toLowerCase();
  if (isFolder) {
    if (/^(src|lib|app|packages?)$/.test(lower)) return "Where the main implementation lives";
    if (/^(test|tests|spec|__tests__|e2e)$/.test(lower)) return "Where behavior is checked";
    if (/^(docs?|website|site)$/.test(lower)) return "Where people learn how to use it";
    if (/^(examples?|playground|demo)$/.test(lower)) return "Small spaces for trying the project";
    if (/^(scripts?|tools?|bin)$/.test(lower)) return "Small utilities that support the workflow";
    if (/^(config|configs?)$/.test(lower)) return "Project-wide configuration";
    return "A visible area of the repository";
  }
  if (lower === "readme.md") return "The project's public introduction";
  if (/^(package\.json|pyproject\.toml|cargo\.toml|go\.mod)$/.test(lower)) return "Project instructions and dependencies";
  if (/^(pnpm|yarn|npm|package-lock|cargo|poetry|uv).*\.(ya?ml|json|lock)$/.test(lower)) return "Dependency and workspace rules";
  if (/\.(test|spec)\./.test(lower) || /(^|[._-])(test|spec)s?\./.test(lower)) return "A check for expected behavior";
  if (/^(vite|vitest|jest|eslint|tsconfig|webpack|rollup|tailwind|prettier)/.test(lower)) return "A configuration point for the toolchain";
  return "A visible file in the current project tree";
}

function buildOrientation(repository, readmeText, manifestMeta = {}) {
  const source = plainText(readmeText);
  const firstSentence = source.match(/[^.!?]{20,180}[.!?]/)?.[0]?.trim();
  const description = repository.description || manifestMeta.description || firstSentence || "This public repository is still being read.";
  const what = firstSentence || description;
  const language = repository.language || "mixed technology";
  return {
    what: `${what} The visible stack is ${language}.`,
    oneLine: description,
    use: source ? source.slice(0, 180) : `Explore the repository's ${language} code and public history.`,
    how: source ? "Read the introduction, then move through the tree and history to see how the project is assembled." : "Start with the visible tree, then use commits and manifests to understand how it is assembled.",
    outcome: `what ${repository.name || "this project"} does, how a request moves through it, and why its history matters.`,
    example: "Start with an ordinary person using the project. The next room follows that action through the repository.",
    guide: source ? "The orientation begins with the repository description and its README, then points to structure and history." : "The orientation is a rule-based reading of public repository metadata.",
    sourceNote: source ? "Based on the public description and README." : "Based on the public repository description; README text was not available.",
  };
}

function buildJourney(repository, readmeText, architecture, manifestPath) {
  const name = repository.name || "this project";
  const evidence = architecture?.files?.[0]?.evidence || manifestPath || "README.md";
  return {
    intro: `Before reading files, follow one ordinary use of ${name}: a person gives it an input and waits for a result. The repository is the machinery between those two moments.`,
    summary: "An input enters, the project transforms or coordinates it, and a result comes back. The exact path depends on this repository's purpose.",
    steps: [
      { number: "01", label: "A person starts", title: "The request begins outside the code", plain: "Someone gives the project an input, opens it, or runs one of its commands.", technical: "The public README and entry files describe the first boundary into the system.", evidence },
      { number: "02", label: "The project receives it", title: "An entry point accepts the request", plain: "One visible part of the repository is responsible for receiving that action.", technical: "Scripts, commands, routes, or exported modules form the project's entry surface.", evidence },
      { number: "03", label: "The work happens", title: "The project coordinates its parts", plain: "The request moves through the main implementation and any supporting tools it needs.", technical: "The source tree and dependency manifest reveal the components involved.", evidence: architecture?.folders?.[0]?.evidence || evidence },
      { number: "04", label: "A result returns", title: "The project produces something useful", plain: "The person receives a page, file, answer, transformation, or other result.", technical: "Tests, examples, and public documentation show what the project considers a result.", evidence: architecture?.folders?.find((item) => /test|example|demo|docs/i.test(item.name))?.evidence || evidence },
      { number: "05", label: "The project is maintained", title: "The loop starts again", plain: "People change the project, release new versions, and keep the path working.", technical: "Git history, manifests, and release markers show how the system continues to evolve.", evidence: "README.md" },
    ],
    glossary: [
      { term: "entry point", plain: "A place where a person, command, or another program enters the project." },
      { term: "implementation", plain: "The part that performs the project's main work." },
      { term: "dependency", plain: "A capability the project borrows instead of building itself." },
    ],
    sourceNote: readmeText ? "Teaching path inferred from the tracked README, visible tree, manifest, and Git history." : "Teaching path inferred from the visible tree, manifest, and Git history.",
  };
}

function buildArchitecture(tree = [], manifestPath, readmeText, repository) {
  const folders = [...new Set(tree.filter((item) => item.includes("/")).map((item) => item.split("/")[0]))].slice(0, 8).map((name) => ({ name, role: inferRole(name, true), evidence: name }));
  const files = tree.filter((item) => !item.includes("/")).filter((item) => /readme|package|pyproject|requirements|cargo|go\.mod|workspace|config|lock|test|spec/i.test(item)).slice(0, 8).map((name) => ({ name, role: inferRole(name), evidence: name }));
  if (manifestPath && !files.some((file) => file.name === manifestPath)) files.unshift({ name: manifestPath, role: inferRole(manifestPath), evidence: manifestPath });
  const entrypoints = files.filter((file) => /readme|package|pyproject|cargo|go\.mod/i.test(file.name)).slice(0, 3).map((file) => file.name);
  if (!folders.length && !files.length) return demoData.architecture;
  return {
    summary: `${repository.language || "Mixed stack"} project with ${folders.length || "a visible"} top-level area${folders.length === 1 ? "" : "s"} and ${files.length || "a small set of"} notable project file${files.length === 1 ? "" : "s"}.`,
    flow: [
      { label: "Person or caller", role: "Where the request begins", detail: "A user, command, or another system gives the project something to do.", evidence: readmePath || manifestPath || "README.md" },
      { label: "Entry point", role: "The front door", detail: "A script, route, command, or exported function accepts the request.", evidence: files[0]?.name || manifestPath || readmePath || "README.md" },
      { label: "Main implementation", role: "Where the work happens", detail: "The visible source areas coordinate the project's main behavior.", evidence: folders.find((item) => /src|lib|app|packages|server|core/i.test(item.name))?.evidence || folders[0]?.evidence || "README.md" },
      { label: "Supporting tools", role: "Capabilities the project borrows", detail: "Dependencies and configuration fill in the parts the repository does not build alone.", evidence: manifestPath || files[0]?.name || "README.md" },
      { label: "Result", role: "What comes back", detail: "Documentation, examples, tests, or the public description show the project's output.", evidence: folders.find((item) => /test|example|demo|docs|dist|build/i.test(item.name))?.evidence || readmePath || "README.md" },
    ],
    folders,
    files,
    entrypoints: entrypoints.length ? entrypoints : (readmeText ? ["README.md"] : []),
    sourceNote: "Roles are inferred from names in the public top-level tree; open the evidence to inspect the source.",
  };
}

function buildLearning(data) {
  const architecture = data.architecture || {};
  const analysis = data.analysis || {};
  const firstStep = data.journey?.steps?.[0]?.evidence || "README.md";
  const mainArea = architecture.folders?.find((item) => /src|lib|app|packages|server|core/i.test(item.name))?.evidence || architecture.folders?.[0]?.evidence || firstStep;
  const historyEvidence = (analysis.arc || []).slice(0, 2).flatMap((chapter) => chapter.evidence || []).map((item) => ({ ...item, label: item.label || item.ref }));
  return {
    promise: `By the end, you can explain what ${data.name?.split("/").pop()?.trim() || "this project"} is for, follow one likely use path, and connect its current shape to the public history.`,
    rooms: [
      { id: "hall-overview", label: "The foyer", question: "What is this project for?", takeaway: data.orientation?.outcome || data.orientation?.oneLine || data.description, mode: "observed", evidence: [{ type: "file", ref: firstStep, label: firstStep }] },
      { id: "hall-journey", label: "First visitor", question: "What happens when someone uses it?", takeaway: data.journey?.summary || "An input enters, the project coordinates its parts, and a result comes back.", mode: "inferred", evidence: (data.journey?.steps || []).slice(0, 2).map((step) => ({ type: "file", ref: step.evidence || firstStep, label: step.evidence || firstStep })) },
      { id: "hall-architecture", label: "Blueprint room", question: "Which parts make that journey possible?", takeaway: architecture.summary || "The visible tree is the project's first blueprint.", mode: "observed", evidence: (architecture.flow || []).slice(0, 2).map((item) => ({ type: "file", ref: item.evidence || mainArea, label: item.evidence || mainArea })) },
      { id: "hall-history", label: "History hall", question: "Why does it look this way now?", takeaway: analysis.historySummary || analysis.thesis || "The current shape is the result of observable changes over time.", mode: "mixed", evidence: historyEvidence },
      ...(data.dependencies?.length ? [{ id: "hall-dependencies", label: "Ecosystem room", question: "What supports it?", takeaway: `${data.dependencies.length} direct dependencies are visible in ${data.manifestPath || "the project manifests"}; they show which capabilities the repository borrows.`, mode: "observed", evidence: [{ type: "file", ref: data.manifestPath || firstStep, label: data.manifestPath || firstStep }] }] : []),
      { id: "hall-opera", label: "Exit workshop", question: "What should I remember?", takeaway: analysis.exit || "The project is easiest to remember as a map from purpose to path, parts, and history.", mode: "mixed", evidence: [{ type: "file", ref: firstStep, label: firstStep }, ...historyEvidence.slice(-1)] },
    ],
  };
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

function buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText = "", tree = []) {
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
    orientation: buildOrientation(repository, readmeText),
    architecture: buildArchitecture(tree, manifestPath, readmeText, repository),
    events: events.slice(0, 6), dependencies, manifestPath, commits: commits.slice(0, 12).map((commit, index) => ({ sha: shortenSha(commit.sha), date: formatDate(commit.commit?.author?.date, false), score: 22 + ((commit.sha.charCodeAt(0) * 7 + index * 23) % 78) })),
  };
  data.journey = buildJourney(repository, readmeText, data.architecture, manifestPath);
  data.analysis = buildBrowserAnalysis(data);
  data.learning = buildLearning(data);
  return data;
}

async function fetchMuseumData(repo) {
  const [repository, commits, releases, contributors, languages, readmeResponse, tree] = await Promise.all([
    githubFetch(`/repos/${repo}`),
    githubFetch(`/repos/${repo}/commits?per_page=12`),
    githubFetch(`/repos/${repo}/releases?per_page=5`),
    githubFetch(`/repos/${repo}/contributors?per_page=6`),
    githubFetch(`/repos/${repo}/languages`),
    githubFetch(`/repos/${repo}/readme`).catch(() => null),
    githubFetch(`/repos/${repo}/contents/`).catch(() => []),
  ]);
  const manifests = ["package.json", "pyproject.toml", "requirements.txt", "Cargo.toml"];
  let dependencies = [];
  let manifestPath = null;
  for (const manifest of manifests) {
    const contents = await readManifest(repo, manifest);
    dependencies = parseDependencies(contents, manifest);
    if (dependencies.length) { manifestPath = manifest; break; }
  }
  const readmeText = decodeBase64(readmeResponse?.content);
  const treeItems = Array.isArray(tree) ? tree.map((item) => item.type === "dir" ? `${item.name}/.directory` : item.name).filter(Boolean) : [];
  return buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText, treeItems);
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

function renderOrientation(data) {
  const orientation = data.orientation || buildOrientation({ description: data.description, language: data.language }, "");
  el("orientation-one-line").textContent = orientation.oneLine || orientation.what || "A project with a story still being written.";
  el("orientation-what").textContent = orientation.what || data.description || "The public record is still being read.";
  el("orientation-use").textContent = orientation.use || "Explore the visible repository record.";
  el("orientation-how").textContent = orientation.how || "Start with the tree, then follow the history.";
  el("orientation-outcome").textContent = orientation.outcome || "what this project does, how its parts work together, and why its history matters.";
  el("orientation-example").textContent = orientation.example || "Start with an ordinary person using the project. The next room follows that action through the repository.";
}

function evidenceHref(data, ref) {
  const value = ref || "";
  const lastSegment = value.split("/").pop() || value;
  const isFile = /\.[a-z0-9]+$/i.test(lastSegment) || /^readme$/i.test(lastSegment);
  return `${data.htmlUrl || "#"}/${isFile ? "blob" : "tree"}/${data.defaultBranch || "main"}/${value}`;
}

function sourceHref(data, item) {
  if (!item) return evidenceHref(data, "README.md");
  if (item.url) return item.url;
  const ref = item.ref || item.label || "README.md";
  if (item.type === "commit") return `${data.htmlUrl || "#"}/commit/${ref}`;
  if (item.type === "release") return `${data.htmlUrl || "#"}/releases/tag/${ref}`;
  return evidenceHref(data, ref);
}

function renderJourney(data) {
  const journey = data.journey || demoData.journey;
  el("journey-intro").textContent = journey.intro || "Follow one ordinary use of the project before looking at its files.";
  el("journey-summary").textContent = journey.summary || "A request enters, the project does its work, and a result comes back.";
  el("journey-source-note").textContent = journey.sourceNote || "This journey is an interpretation of the repository's public evidence.";
  el("journey-source").href = evidenceHref(data, journey.steps?.[0]?.evidence || "README.md");
  el("journey-flow").replaceChildren(...(journey.steps || []).map((step, index) => {
    const article = document.createElement("article"); article.className = "journey-step";
    const marker = document.createElement("span"); marker.className = "journey-marker"; marker.textContent = step.number || String(index + 1).padStart(2, "0");
    const body = document.createElement("div");
    const label = document.createElement("p"); label.className = "journey-label"; label.textContent = step.label || "Step";
    const title = document.createElement("h5"); title.textContent = step.title || "A project step";
    const plain = document.createElement("p"); plain.className = "journey-plain"; plain.textContent = step.plain || "The project performs a visible action.";
    const closer = document.createElement("details"); closer.className = "journey-closer";
    const summary = document.createElement("summary"); summary.textContent = "Look closer";
    const technical = document.createElement("p"); technical.className = "journey-technical"; technical.textContent = step.technical || "The repository provides the machinery for this step.";
    closer.append(summary, technical);
    const evidence = document.createElement("a"); evidence.className = "journey-evidence"; evidence.href = evidenceHref(data, step.evidence); evidence.target = "_blank"; evidence.rel = "noreferrer"; evidence.textContent = `${step.evidence || "evidence"} ↗`;
    body.append(label, title, plain, closer, evidence); article.append(marker, body); return article;
  }));
  el("glossary-list").replaceChildren(...(journey.glossary || []).map((item) => {
    const row = document.createElement("div"); row.className = "glossary-item";
    const term = document.createElement("strong"); term.textContent = item.term || "Term";
    const definition = document.createElement("span"); definition.textContent = item.plain || item.definition || "A word used in this project.";
    row.append(term, definition); return row;
  }));
}

function renderMachineMap(data) {
  const flow = data.architecture?.flow || demoData.architecture.flow || [];
  el("machine-map").replaceChildren(...flow.map((item, index) => {
    const node = document.createElement("a"); node.className = "machine-node"; node.href = evidenceHref(data, item.evidence); node.target = "_blank"; node.rel = "noreferrer";
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("strong"); title.textContent = item.label || "Project part";
    const role = document.createElement("small"); role.textContent = item.role || "A visible part of the system";
    const detail = document.createElement("p"); detail.textContent = item.detail || "Evidence from the repository tree.";
    node.append(number, title, role, detail);
    if (index < flow.length - 1) { const arrow = document.createElement("i"); arrow.className = "machine-arrow"; arrow.textContent = "→"; node.append(arrow); }
    return node;
  }));
}

function renderHistoryTeaching(data) {
  const analysis = data.analysis || {};
  el("history-summary").textContent = analysis.historySummary || "The history is a sequence of decisions that changed what the project could do.";
  el("history-arc").replaceChildren(...(analysis.arc || []).slice(0, 3).map((chapter, index) => {
    const article = document.createElement("article"); article.className = "history-chapter";
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("p"); label.className = "story-label"; label.textContent = chapter.label || "Chapter";
    const title = document.createElement("h5"); title.textContent = chapter.title || "A chapter in the record";
    const summary = document.createElement("p"); summary.textContent = chapter.lesson || chapter.summary || "The archive records a change.";
    const evidence = document.createElement("div"); evidence.className = "history-evidence";
    (chapter.evidence || []).slice(0, 2).forEach((item) => {
      const link = document.createElement("a"); link.href = sourceHref(data, item); link.target = "_blank"; link.rel = "noreferrer"; link.textContent = `${item.label || item.ref || "evidence"} ↗`; evidence.append(link);
    });
    article.append(number, label, title, summary, evidence); return article;
  }));
}

function renderExit(data) {
  const learning = data.learning || buildLearning(data);
  const understood = state.understoodRooms || new Set();
  const totalRooms = state.rooms?.length || learning.rooms?.length || 0;
  const complete = totalRooms > 0 && understood.size === totalRooms;
  const orientation = data.orientation || {};
  const authoredExit = data.analysis?.exit;
  const learnedExit = learning.rooms?.find((room) => room.id === "hall-opera")?.takeaway;
  const exitIntro = authoredExit && authoredExit !== learnedExit
    ? authoredExit
    : complete
      ? "Your map is complete. Rehearse it in three plain-language sentences, then use the pulse below as a record of how the project keeps changing."
      : "Test the map you are building with three plain-language questions. Mark each conclusion when you can say it without opening the code.";
  el("exit-intro").textContent = exitIntro;
  el("exit-stamp").textContent = complete ? "MAP COMPLETE" : "REVIEW MAP";
  const lessons = [
    ["What does it do?", learning.rooms?.find((room) => room.id === "hall-overview")?.takeaway || orientation.oneLine || data.description],
    ["How does it work?", learning.rooms?.find((room) => room.id === "hall-journey")?.takeaway || orientation.how || "Follow the visitor path and machine map."],
    ["Why is it this way now?", learning.rooms?.find((room) => room.id === "hall-history")?.takeaway || data.analysis?.thesis || "Its history explains the current shape."],
  ];
  el("learned-list").replaceChildren(...lessons.map(([question, answer], index) => {
    const row = document.createElement("article"); row.className = "learned-item";
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const q = document.createElement("strong"); q.textContent = question;
    const a = document.createElement("p"); a.textContent = answer || "The archive is still being read.";
    const roomId = ["hall-overview", "hall-journey", "hall-history"][index];
    const status = document.createElement("span"); status.className = `lesson-status${understood.has(roomId) ? " is-understood" : ""}`; status.textContent = understood.has(roomId) ? "UNDERSTOOD" : "REVIEW";
    row.append(number, q, a, status); return row;
  }));
}

function roomDefinition(data, id) {
  return (data.learning?.rooms || demoData.learning.rooms).find((room) => room.id === id);
}

function renderLearning(data) {
  const learning = data.learning || buildLearning(data);
  const promise = learning.promise || "By the end of this visit, you should be able to explain the project's purpose, path, parts, and history.";
  const promiseNode = el("visit-learning-promise");
  if (promiseNode) promiseNode.textContent = promise;
  const rooms = learning.rooms || [];
  document.querySelectorAll(".room-learning").forEach((block) => block.remove());
  rooms.forEach((room) => {
    const panel = document.getElementById(room.id);
    if (!panel) return;
    const block = document.createElement("div"); block.className = "room-learning";
    const copy = document.createElement("div"); copy.className = "room-learning-copy";
    const label = document.createElement("span"); label.className = "subsection-label"; label.textContent = "When you leave this room";
    const takeaway = document.createElement("strong"); takeaway.textContent = room.takeaway || "Carry this conclusion into the next room.";
    copy.append(label, takeaway);
    const action = document.createElement("div"); action.className = "room-learning-action";
    const mode = document.createElement("span"); mode.className = "learning-mode"; mode.textContent = room.mode === "inferred" ? "Inferred reading" : room.mode === "mixed" ? "Observed + inferred" : "Observed in evidence";
    const understood = document.createElement("button"); understood.type = "button"; understood.className = "understand-button"; understood.dataset.room = room.id;
    action.append(mode, understood);
    const evidence = document.createElement("div"); evidence.className = "learning-evidence";
    (room.evidence || []).slice(0, 3).forEach((item) => {
      const link = document.createElement("a"); link.href = sourceHref(data, item); link.target = "_blank"; link.rel = "noreferrer"; link.textContent = `${item.label || item.ref || "evidence"} ↗`; evidence.append(link);
    });
    block.append(copy, action, evidence);
    panel.querySelector(".panel-heading")?.after(block);
  });
  updateLearningControls();
}

function updateLearningControls() {
  const understood = state.understoodRooms || new Set();
  document.querySelectorAll(".understand-button").forEach((button) => {
    const isDone = understood.has(button.dataset.room);
    button.classList.toggle("is-understood", isDone);
    button.setAttribute("aria-pressed", String(isDone));
    button.replaceChildren(document.createElement("span"), document.createElement("span"));
    button.firstElementChild.textContent = isDone ? "✓" : "○";
    button.lastElementChild.textContent = isDone ? "Understood" : "Mark understood";
  });
  document.querySelectorAll(".map-room").forEach((button) => {
    const isDone = understood.has(button.dataset.target);
    button.classList.toggle("is-understood", isDone);
    button.setAttribute("aria-pressed", String(isDone));
    const status = button.querySelector(".map-room-status");
    if (status) status.textContent = isDone ? "UNDERSTOOD ✓" : "OPEN ROOM";
  });
  const rooms = state.rooms?.length || 0;
  const count = understood.size;
  const node = el("visit-learning");
  if (node && rooms) node.textContent = `${count} / ${rooms} rooms understood · ${state.visitedRooms?.size || 0} visited`;
}

function toggleRoomUnderstanding(roomId) {
  const understood = state.understoodRooms || new Set();
  if (understood.has(roomId)) understood.delete(roomId); else understood.add(roomId);
  state.understoodRooms = understood;
  updateLearningControls();
  renderExit(state.data);
  const total = state.rooms?.length || 0;
  el("final-summary").textContent = understood.size === total && total
    ? `You have a complete first map of ${state.data.name}: purpose, path, parts, history${state.data.dependencies?.length ? ", and ecosystem" : ""}.`
    : `${understood.size} of ${total} rooms understood. Keep going until you can retell the project without opening the code.`;
  const rooms = state.rooms?.length || 0;
  const verb = understood.has(roomId) ? "Marked as understood" : "Removed from understood rooms";
  showToast(`${verb} · ${understood.size}/${rooms}`);
}

function renderArchitecture(data) {
  const architecture = data.architecture || demoData.architecture;
  el("architecture-summary").textContent = architecture.summary || "The project's visible structure is the first blueprint.";
  el("architecture-source-note").textContent = architecture.sourceNote || "Roles are inferred from visible repository evidence.";
  el("architecture-source").href = `${data.htmlUrl || "#"}/tree/${data.defaultBranch || "main"}`;
  const renderList = (target, items, emptyLabel) => {
    const container = el(target);
    container.replaceChildren(...(items || []).slice(0, 8).map((item) => {
      const row = document.createElement("a"); row.className = "architecture-item";
      const evidence = item.evidence || item.name || "";
      const lastSegment = evidence.split("/").pop() || evidence;
      const isFile = /\.[a-z0-9]+$/i.test(lastSegment) || /^readme$/i.test(lastSegment);
      row.href = `${data.htmlUrl || "#"}/${isFile ? "blob" : "tree"}/${data.defaultBranch || "main"}/${evidence}`;
      row.target = "_blank"; row.rel = "noreferrer";
      const name = document.createElement("strong"); name.textContent = item.name || "Visible area";
      const role = document.createElement("span"); role.textContent = item.role || "Evidence-backed role reading";
      row.append(name, role); return row;
    }));
    if (!container.children.length) container.append(Object.assign(document.createElement("p"), { className: "empty-note", textContent: emptyLabel }));
  };
  renderList("architecture-folders", architecture.folders, "No top-level folders surfaced in this scan.");
  renderList("architecture-files", architecture.files, "No named project files surfaced in this scan.");
  const entrypoints = el("architecture-entrypoints");
  entrypoints.replaceChildren(...(architecture.entrypoints || []).slice(0, 4).map((entry) => {
    const link = document.createElement("a"); link.href = `${data.htmlUrl || "#"}/tree/${data.defaultBranch || "main"}/${entry}`; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = `${entry} ↗`; return link;
  }));
}

function renderVisitMap(data) {
  const allRooms = [
    { id: "hall-overview", label: "The foyer", question: "What is it for?" },
    { id: "hall-journey", label: "First visitor", question: "What happens when it is used?" },
    { id: "hall-architecture", label: "Blueprint room", question: "Which parts make it work?" },
    { id: "hall-history", label: "History hall", question: "Why is it this way now?" },
    ...(data.dependencies?.length ? [{ id: "hall-dependencies", label: "Ecosystem room", question: "What supports it?" }] : []),
    { id: "hall-opera", label: "Exit workshop", question: "What should I remember?" },
  ];
  const indexButtons = [...document.querySelectorAll(".index-item")];
  indexButtons.forEach((button) => {
    const exists = allRooms.some((room) => room.id === button.dataset.target);
    button.hidden = !exists;
  });
  allRooms.forEach((room, index) => {
    const panel = document.getElementById(room.id);
    const roomNumber = `${String(index + 1).padStart(2, "0")} / ${String(allRooms.length).padStart(2, "0")}`;
    panel?.querySelector(".panel-number")?.replaceChildren(document.createTextNode(roomNumber));
    const kicker = panel?.querySelector(".panel-heading .panel-kicker");
    if (kicker) kicker.textContent = `Room ${roomNumber.split(" /")[0]} · ${room.label}`;
    const indexButton = document.querySelector(`.index-item[data-target="${room.id}"]`);
    if (indexButton) indexButton.querySelector("span:first-child")?.replaceChildren(document.createTextNode(String(index + 1).padStart(2, "0")));
  });
  const historyNext = document.querySelector('#hall-history .room-next');
  if (historyNext) {
    historyNext.dataset.next = data.dependencies?.length ? "hall-dependencies" : "hall-opera";
    historyNext.replaceChildren(document.createTextNode(data.dependencies?.length ? "Enter the ecosystem room " : "Enter the exit workshop "), Object.assign(document.createElement("span"), { textContent: "→" }));
  }
  const historyFooterNote = document.querySelector('#hall-history .room-footer > span');
  if (historyFooterNote) historyFooterNote.textContent = data.dependencies?.length ? "Next question: what else is in the room with it?" : "Last question: what should I remember?";
  const grid = el("floor-plan-grid");
  grid.replaceChildren(...allRooms.map((room, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "map-room"; button.dataset.target = room.id;
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("strong"); label.textContent = room.label;
    const question = document.createElement("small"); question.textContent = room.question;
    const takeaway = document.createElement("p"); takeaway.textContent = roomDefinition(data, room.id)?.takeaway || "Carry one conclusion into the next room.";
    const status = document.createElement("span"); status.className = "map-room-status"; status.textContent = "";
    button.append(number, label, question, takeaway, status); button.addEventListener("click", () => navigateToRoom(room.id)); return button;
  }));
  state.rooms = allRooms;
  updateVisitProgress("hall-overview");
  updateLearningControls();
}

function navigateToRoom(target) {
  const panel = document.getElementById(target);
  if (!panel || panel.hidden) return;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  updateVisitProgress(target);
}

function updateVisitProgress(target) {
  const rooms = state.rooms?.length ? state.rooms : [{ id: "hall-overview", label: "The foyer" }, { id: "hall-journey", label: "First visitor" }, { id: "hall-architecture", label: "Blueprint room" }, { id: "hall-history", label: "History hall" }, { id: "hall-dependencies", label: "Ecosystem room" }, { id: "hall-opera", label: "Exit workshop" }];
  const index = Math.max(0, rooms.findIndex((room) => room.id === target));
  el("visit-room-label").textContent = `Room ${String(index + 1).padStart(2, "0")} of ${String(rooms.length).padStart(2, "0")}`;
  el("visit-room-name").textContent = rooms[index]?.label || "The foyer";
  el("visit-progress-fill").style.width = `${((index + 1) / rooms.length) * 100}%`;
  const visited = state.visitedRooms || new Set(["hall-overview"]);
  visited.add(target); state.visitedRooms = visited;
  document.querySelectorAll(".index-item").forEach((item) => item.classList.toggle("is-active", item.dataset.target === target));
  document.querySelectorAll(".map-room").forEach((item) => item.classList.toggle("is-active", item.dataset.target === target));
  updateLearningControls();
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
  if (!data.learning) data.learning = buildLearning(data);
  state.data = data;
  state.currentRepo = data.repo;
  state.visitedRooms = new Set(["hall-overview"]);
  state.understoodRooms = new Set();
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
  renderStats(data); renderAvatars(data); renderTimeline(data); renderAquarium(data); renderScore(data); renderAnalysis(data); renderOrientation(data); renderJourney(data); renderArchitecture(data); renderMachineMap(data); renderHistoryTeaching(data); renderLearning(data); renderExit(data); renderVisitMap(data);
  el("score-caption").textContent = `Commit pulse / ${data.commits?.length || 0} markers`;
  el("final-summary").textContent = `You have traced ${data.name} from purpose to present-day motion. Mark rooms as understood when you can explain their conclusion in your own words.`;
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
  const entrance = el("entrance-screen");
  const enterMuseum = () => {
    state.entered = true;
    document.body.classList.add("museum-entered");
    window.setTimeout(() => entrance?.remove(), 900);
    document.querySelector("#repo-input")?.focus({ preventScroll: true });
  };
  el("enter-museum")?.addEventListener("click", enterMuseum);
  el("peek-museum")?.addEventListener("click", () => { document.body.classList.add("museum-preview"); entrance?.classList.add("is-peeking"); window.setTimeout(() => entrance?.remove(), 500); });
  const query = new URLSearchParams(window.location.search);
  const queryMuseum = query.get("museum");
  const queryRepo = query.get("repo");
  if (queryMuseum || (queryRepo && parseRepo(queryRepo))) {
    // Shared links should open as working exhibits instead of leaving the entrance layer over them.
    enterMuseum();
    if (queryMuseum) loadArtifact(queryMuseum);
    else { el("repo-input").value = queryRepo; loadRepo(parseRepo(queryRepo)); }
  }
  el("repo-form").addEventListener("submit", (event) => { event.preventDefault(); const repo = parseRepo(el("repo-input").value); if (!repo) { showToast("Enter a GitHub owner/repository first."); el("repo-input").focus(); return; } loadRepo(repo); });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".understand-button");
    if (button) toggleRoomUnderstanding(button.dataset.room);
  });
  el("demo-button").addEventListener("click", openDemo); el("error-demo-button").addEventListener("click", openDemo);
  el("random-button").addEventListener("click", () => { const repos = ["sindresorhus/ky", "tailwindlabs/tailwindcss", "denoland/deno", "pallets/flask", "rust-lang/rustlings"]; const repo = repos[Math.floor(Math.random() * repos.length)]; el("repo-input").value = repo; loadRepo(repo); });
  document.querySelectorAll(".index-item").forEach((button) => button.addEventListener("click", () => navigateToRoom(button.dataset.target)));
  document.querySelectorAll(".room-next, .room-back").forEach((button) => button.addEventListener("click", () => navigateToRoom(button.dataset.next)));
  document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    document.querySelectorAll(".mode-button").forEach((item) => item.classList.toggle("is-active", item === button));
    el("floor-plan").hidden = mode !== "map";
    if (mode === "map") el("floor-plan").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
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
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) updateVisitProgress(entry.target.id); });
      updateActiveIndex(entries);
    }, { rootMargin: "-24% 0px -62% 0px", threshold: 0 });
    panels.forEach((panel) => observer.observe(panel));
  }

  const visual = document.querySelector(".hero-visual");
  visual.addEventListener("pointermove", (event) => { const rect = visual.getBoundingClientRect(); visual.style.setProperty("--tilt-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`); visual.style.setProperty("--tilt-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`); });
  visual.addEventListener("pointerleave", () => { visual.style.setProperty("--tilt-x", "0px"); visual.style.setProperty("--tilt-y", "0px"); });
  window.addEventListener("scroll", () => document.body.classList.toggle("has-scrolled", window.scrollY > 16), { passive: true });
});
