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
      { id: "hall-overview", label: "The foyer", question: "What is this project for?", scene: "You save a file in the app you are building. A moment later, the browser reflects the change.", plain: "Vite is the workshop between your files and the browser. It keeps the feedback loop short while you work, then helps prepare the finished app for release.", reveal: "Under the hood, the dev server, module graph, plugins, and production build form two related paths through the repository.", whyItMatters: "If you remember the job before the vocabulary, the rest of the repository has somewhere to attach.", interaction: "before-after", takeaway: "Vite sits between a developer's source files and the browser: it makes the edit-to-feedback loop fast, then prepares the finished app for release.", mode: "observed", evidence: [{ type: "file", ref: "README.md", label: "README.md" }] },
      { id: "hall-journey", label: "First visitor", question: "What happens when someone uses it?", scene: "Follow one small edit: from the moment a person saves a file to the moment the browser shows the result.", plain: "The project receives the change, works out what is affected, translates it, and sends back the smallest useful update.", reveal: "This is a teaching model inferred from the README, visible source areas, and manifest. It explains a likely path without claiming hidden runtime behavior.", whyItMatters: "A request path turns a folder tree into a sequence of responsibilities.", interaction: "path", takeaway: "A source change enters the dev server, is tracked and transformed through project machinery, then returns to the browser as a focused update.", mode: "inferred", evidence: [{ type: "file", ref: "README.md", label: "README.md" }, { type: "file", ref: "packages", label: "packages/" }] },
      { id: "hall-architecture", label: "Blueprint room", question: "Which parts make that journey possible?", scene: "Now look at the building plan. Each area exists because one part of the journey needs a home.", plain: "The repository is organized around packages, a dev server, a module graph, plugins, and a separate production build path.", reveal: "The Agent reads names in the visible tree and manifest, then maps them to likely roles. Open any part to inspect the source behind the reading.", whyItMatters: "Structure is easier to understand when you can point to the job each area performs.", interaction: "blueprint", takeaway: "The repository is organized around packages, a dev server, a module graph, plugins, and a separate production build path.", mode: "observed", evidence: [{ type: "file", ref: "packages", label: "packages/" }, { type: "file", ref: "package.json", label: "package.json" }] },
      { id: "hall-history", label: "History hall", question: "Why does it look this way now?", scene: "A repository is not born fully formed. Read it as a trail of decisions, from the first mark to the shape being maintained now.", plain: "The project began as a focused fast-feedback tool, then widened its architecture and ecosystem while keeping that original promise visible.", reveal: "The origin, turning point, and now chapters are selected from public commits and releases. They are observations about the record, not guesses about private motivation.", whyItMatters: "History explains why today's folders and dependencies are arranged as they are.", interaction: "chapters", takeaway: "The project began as a focused fast-feedback tool, then widened its architecture and ecosystem while keeping that original promise visible.", mode: "mixed", evidence: [{ type: "commit", ref: "9a4f3cf", label: "Origin" }, { type: "release", ref: "v6.1.0", label: "Turning point" }] },
      { id: "hall-dependencies", label: "Ecosystem room", question: "What supports it?", scene: "No large project works alone. Meet the outside capabilities this repository chooses to borrow.", plain: "Vite borrows specialized capabilities for bundling, transforming, watching files, and serving assets instead of rebuilding every capability itself.", reveal: "Each specimen comes from a visible manifest entry. The capability label is an interpretation; the manifest link is the evidence.", whyItMatters: "Dependencies reveal the boundaries of the project: what it owns and what it delegates.", interaction: "specimens", takeaway: "Vite borrows specialized capabilities for bundling, transforming, watching files, and serving assets instead of rebuilding every capability itself.", mode: "observed", evidence: [{ type: "file", ref: "package.json", label: "package.json" }] },
      { id: "hall-opera", label: "Exit workshop", question: "What should I remember?", scene: "Before leaving, rehearse the story in your own words. A good visit leaves you with a model, not a transcript.", plain: "The useful map is: purpose → request path → visible parts → historical reason. The repository becomes understandable when those four views agree.", reveal: "The pulse below is a record of activity, not a quality score. It is the final reminder that the project is still changing.", whyItMatters: "Being able to retell the project is a stronger test than recognising a list of files.", interaction: "rehearsal", takeaway: "The useful map is: purpose → request path → visible parts → historical reason. The repository becomes understandable when those four views agree.", mode: "mixed", evidence: [{ type: "file", ref: "README.md", label: "README.md" }, { type: "commit", ref: "9c9b2a1", label: "latest commit" }] },
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
    historySummary: "Three distinct natural days frame the demo: the first public mark in 2020, a release-heavy turn in late 2024, and a recent change in March 2025. The gaps are part of the story, not missing decoration.",
    exit: "The project can be retold as a fast-feedback tool whose visible machinery widened while the original promise stayed legible.",
    confidence: "Demo curator reading",
    turningPointReason: "The November 2024 release marker and shared module work make the largest visible shift between the 2020 origin and the 2025 present.",
    distinctDates: 3,
    excludedSameDayEvents: 2,
    coverage: "Demo collection: three dated phases represent the sampled public markers.",
    arc: [
      { label: "Origin", title: "The first room opens", summary: "A compact tool takes shape around a clear promise: make frontend development feel immediate.", evidence: [{ type: "commit", ref: "9a4f3cf", label: "9a4f3cf" }] },
      { label: "Turning point", title: "The ecosystem widens", summary: "Release markers and shared module work show the project moving from a useful tool toward a broader platform.", evidence: [{ type: "release", ref: "v6.1.0", label: "v6.1.0" }] },
      { label: "Now", title: "A fresh layer of paint", summary: "Recent changes keep the developer-facing surface active while the surrounding dependency system stays deliberately visible.", evidence: [{ type: "commit", ref: "9c9b2a1", label: "9c9b2a1" }] },
    ],
    phases: [
      { id: "origin", label: "Origin", role: "origin", start: "2020-05-13", end: "2020-05-13", title: "The first room opens", summary: "The earliest visible public mark introduces Vite as a focused frontend development tool. This is the beginning of the visible record, not a claim that no earlier work exists.", lesson: "Start with the visible promise before reading the later machinery.", commitCount: 1, reason: "This is the earliest dated record in the demo collection.", evidence: [{ type: "commit", ref: "9a4f3cf", label: "9a4f3cf", claim: "The initial public commit establishes the origin point used by this demo." }] },
      { id: "turning", label: "Turning point", role: "turning", start: "2024-11-08", end: "2024-11-08", title: "The ecosystem widens", summary: "A major release and shared module work make the widening architecture legible. The reading is supported by the dated release and the grouped commits, not by an assumption about private intent.", lesson: "A turning point is a change in the observable record, not a claim about why a maintainer made it.", commitCount: 3, reason: "Selected from the middle date because a release marker and structural-change language coincide.", evidence: [{ type: "release", ref: "v6.0.0", label: "v6.0.0", claim: "A public release marker falls on this phase date." }, { type: "commit", ref: "1a82d6c", label: "1a82d6c", claim: "The commit subject uses shared-module language." }] },
      { id: "now", label: "Now", role: "now", start: "2025-03-18", end: "2025-03-18", title: "A fresh layer of paint", summary: "The newest sampled day returns to the developer-facing surface. It shows current activity, not a complete measure of project health or importance.", lesson: "Read the present as the latest visible state, not as the final destination.", commitCount: 4, reason: "This is the newest natural day in the demo collection.", evidence: [{ type: "commit", ref: "9c9b2a1", label: "9c9b2a1", claim: "The newest sampled commit supports the present-state reading." }] },
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
  transitionTimer: null,
  transitionHideTimer: null,
  navigationLockUntil: 0,
  currentRepo: "vitejs/vite",
  artifactPath: null,
  mode: "demo",
  tourMode: "guided",
  currentRoom: "hall-overview",
  foyerView: "scene",
  selectedJourneyStep: 0,
  selectedArchitecture: 0,
  explorerQuery: "",
  explorerFilter: "all",
  explorerPath: "",
  explorerInvestigation: "",
  explorerPreview: null,
  explorerPreviewState: "idle",
  explorerRequestId: 0,
  explorerAbortController: null,
  selectedHistory: 0,
  selectedDependency: 0,
  exitAnswers: {},
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

function dayKey(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
}

function formatDayRange(start, end) {
  if (!start && !end) return "date not recorded";
  if (!end || start === end) return formatDate(start || end);
  return `${formatDate(start)} — ${formatDate(end)}`;
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

function githubFetchPage(path) {
  return fetch(`${API_ROOT}${path}`, { headers: { Accept: "application/vnd.github+json" } }).then(async (response) => {
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "Repository not found or not public." : `GitHub returned ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return { data: await response.json(), link: response.headers.get("link") || "" };
  });
}

function githubFetch(path) {
  return githubFetchPage(path).then((page) => page.data);
}

function lastPageFromLink(link) {
  const match = String(link || "").match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return match ? Number(match[1]) : 1;
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

function dedupeDependencies(entries) {
  const seen = new Set();
  return entries.filter((item) => {
    const name = String(item?.name || "").trim();
    if (!name) return false;
    const key = `${name.toLowerCase()}:${item.type || "runtime"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    item.name = name;
    return true;
  });
}

function splitDependencySpec(spec) {
  const value = String(spec || "").trim().replace(/^["']|["']$/g, "").split(";")[0].trim();
  const match = value.match(/^([A-Za-z0-9][A-Za-z0-9_.-]*)/);
  if (!match) return null;
  const name = match[1];
  let remainder = value.slice(match[0].length).trim().replace(/^\[[^\]]*\]/, "").trim();
  if (remainder.startsWith("@")) remainder = remainder.slice(1).trim();
  else {
    const constraint = remainder.match(/(?:===|==|~=|!=|<=|>=|<|>)\s*([^,\s]+)/);
    remainder = constraint ? constraint[1] : remainder;
  }
  return { name, version: remainder || "declared" };
}

function tomlValueComplete(value) {
  let square = 0;
  let curly = 0;
  let quote = "";
  let escaped = false;
  for (const character of value) {
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\" && quote === '"') escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === "[") square += 1;
    else if (character === "]") square -= 1;
    else if (character === "{") curly += 1;
    else if (character === "}") curly -= 1;
  }
  return square <= 0 && curly <= 0 && !quote;
}

function tomlAssignmentRecords(contents) {
  const records = [];
  const lines = String(contents || "").split(/\r?\n/);
  let section = "";
  let index = 0;
  while (index < lines.length) {
    const stripped = lines[index].trim();
    if (!stripped || stripped.startsWith("#")) { index += 1; continue; }
    const header = stripped.match(/^\[([^[\]]+)\]\s*(?:#.*)?$/);
    if (header) { section = header[1].trim(); index += 1; continue; }
    const assignment = lines[index].match(/^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_.-]+))\s*=\s*(.*)$/);
    if (!assignment) { index += 1; continue; }
    const startLine = index + 1;
    const key = assignment[1] || assignment[2] || assignment[3];
    let value = assignment[4];
    while (!tomlValueComplete(value) && index + 1 < lines.length) {
      index += 1;
      value += `\n${lines[index]}`;
    }
    records.push({ section, key, value: value.trim(), line: startLine });
    index += 1;
  }
  return records;
}

function tomlStringValue(value) {
  return String(value || "").match(/^\s*["']([^"']*)["']/)?.[1] || "";
}

function stringsInTomlValue(value) {
  return [...String(value || "").matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function tomlStringRecords(value, startLine = 1) {
  return [...String(value || "").matchAll(/["']([^"']+)["']/g)]
    .filter((match) => !/include-group\s*=\s*$/.test(String(value).slice(0, match.index).slice(-80)))
    .map((match) => ({
      value: match[1],
      line: startLine + String(value || "").slice(0, match.index).split("\n").length - 1,
    }));
}

function dependencySectionKind(path, section, key) {
  if (path === "Cargo.toml") {
    if (section === "workspace.dependencies") return null;
    if (section.startsWith("dependencies.")) return ["version", "workspace"].includes(key) ? "runtime" : null;
    if (section.startsWith("dev-dependencies.")) return ["version", "workspace"].includes(key) ? "build" : null;
    if (section.startsWith("build-dependencies.")) return ["version", "workspace"].includes(key) ? "build" : null;
    if (section === "dependencies" || section.endsWith(".dependencies")) return "runtime";
    if (section === "dev-dependencies" || section.endsWith(".dev-dependencies")) return "build";
    if (section === "build-dependencies" || section.endsWith(".build-dependencies")) return "build";
    return null;
  }
  if (path !== "pyproject.toml") return null;
  if (section === "project" && key === "dependencies") return "runtime";
  if (section === "project.optional-dependencies") return "optional";
  if (section === "build-system" && key === "requires") return "build";
  if (section === "dependency-groups") return "build";
  if (section === "tool.poetry.dependencies") return "runtime";
  if (section === "tool.poetry.dev-dependencies") return "build";
  if (section.startsWith("tool.poetry.group.") && section.endsWith(".dependencies")) return "build";
  return null;
}

function tomlDependencyEntries(contents, path) {
  const entries = [];
  for (const { section, key, value, line } of tomlAssignmentRecords(contents)) {
    const kind = dependencySectionKind(path, section, key);
    if (!kind) continue;
    if (path === "Cargo.toml") {
      const nested = section.match(/^(?:dev-|build-)?dependencies\.(.+)$/);
      if (nested) {
        const version = key === "workspace" ? "workspace" : (tomlStringValue(value) || "declared");
        entries.push({ name: nested[1], version, type: kind, sourcePath: path, line });
        continue;
      }
      if (key.endsWith(".workspace")) {
        entries.push({ name: key.slice(0, -".workspace".length), version: "workspace", type: kind, sourcePath: path, line });
        continue;
      }
      const version = tomlStringValue(value) || value.match(/(?:^|[,{]\s*)version\s*=\s*["']([^"']+)/)?.[1] || "declared";
      entries.push({ name: key, version, type: kind, sourcePath: path, line });
      continue;
    }
    const poetrySection = section === "tool.poetry.dependencies"
      || section === "tool.poetry.dev-dependencies"
      || (section.startsWith("tool.poetry.group.") && section.endsWith(".dependencies"));
    if (poetrySection) {
      if (key.toLowerCase() === "python") continue;
      const version = tomlStringValue(value) || value.match(/(?:^|[,{]\s*)version\s*=\s*["']([^"']+)/)?.[1] || "declared";
      entries.push({ name: key, version, type: kind, sourcePath: path, line });
      continue;
    }
    for (const { value: spec, line: specLine } of tomlStringRecords(value, line)) {
      const dependency = splitDependencySpec(spec);
      if (dependency) entries.push({ ...dependency, type: kind, sourcePath: path, line: specLine });
    }
  }
  return dedupeDependencies(entries);
}

function parseTomlDependencies(contents, path) {
  return tomlDependencyEntries(contents, path).map(({ line, ...entry }) => entry);
}

function parseDependencies(contents, path) {
  if (!contents) return [];
  if (path === "package.json") {
    try {
      const packageJson = JSON.parse(contents);
      const sections = [["dependencies", "runtime"], ["optionalDependencies", "optional"], ["peerDependencies", "optional"], ["devDependencies", "build"]];
      return dedupeDependencies(sections.flatMap(([section, type]) => Object.entries(packageJson[section] || {}).map(([name, version]) => ({ name, version: String(version), type, sourcePath: path })))).slice(0, 20);
    } catch { return []; }
  }
  if (path === "pyproject.toml" || path === "Cargo.toml") return dedupeDependencies(parseTomlDependencies(contents, path)).slice(0, 20);
  const entries = [];
  if (path === "requirements.txt") {
    for (const line of String(contents).split(/\r?\n/)) {
      const candidate = line.split(/\s+#/)[0].trim();
      if (!candidate || /^(?:-|#|git\+|https?:\/\/)/.test(candidate)) continue;
      const dependency = splitDependencySpec(candidate);
      if (dependency) entries.push({ ...dependency, type: "runtime", sourcePath: path });
    }
  } else if (path === "go.mod") {
    let inRequireBlock = false;
    for (const line of String(contents).split(/\r?\n/)) {
      let stripped = line.split("//")[0].trim();
      if (stripped.startsWith("require (")) { inRequireBlock = true; continue; }
      if (inRequireBlock && stripped === ")") { inRequireBlock = false; continue; }
      if (stripped.startsWith("require ")) stripped = stripped.slice("require ".length).trim();
      else if (!inRequireBlock) continue;
      const [name, version] = stripped.split(/\s+/);
      if (name?.includes("/") && version) entries.push({ name, version, type: "runtime", sourcePath: path });
    }
  }
  return dedupeDependencies(entries).slice(0, 20);
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

const IMPLEMENTATION_FOLDERS = new Set(["src", "lib", "app", "apps", "packages", "package", "server", "backend", "api", "core", "client", "web", "frontend", "ui", "components", "modules", "routes", "handlers", "models", "services", "skills", "schema", "schemas", "migrations"]);
const LEARNING_FOLDERS = new Set(["docs", "doc", "website", "site", "examples", "example", "demo", "playground", "tests", "test", "spec", "__tests__", "e2e", "benchmarks", "benchmark", "fixtures"]);
const SUPPORT_FOLDERS = new Set(["scripts", "tools", "bin", "config", "configs", "assets", "public", "static", "styles", ".github", ".repo-museum", ".vscode", ".idea"]);
const GENERATED_FOLDERS = new Set(["node_modules", "vendor", "dist", "build", "coverage", "__pycache__", ".cache"]);
const REPOSITORY_MANIFESTS = new Set(["package.json", "pyproject.toml", "requirements.txt", "cargo.toml", "go.mod", "composer.json", "gemfile", "pom.xml", "build.gradle", "build.gradle.kts", "deno.json", "bun.lockb"]);
const CODE_EXTENSIONS = new Set([".py", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".rs", ".go", ".rb", ".java", ".kt", ".kts", ".swift", ".c", ".h", ".cc", ".cpp", ".hpp", ".cs", ".php", ".scala", ".ex", ".exs", ".erl", ".hs", ".lua", ".r", ".jl", ".sh", ".bash", ".zsh", ".ps1", ".sql"]);
const STYLE_EXTENSIONS = new Set([".css", ".scss", ".sass", ".less", ".styl"]);
const DOCUMENT_EXTENSIONS = new Set([".md", ".mdx", ".rst", ".adoc", ".txt"]);
const CONFIG_EXTENSIONS = new Set([".json", ".jsonc", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".xml", ".gradle", ".properties"]);
const PREVIEW_BLOCKED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".bmp", ".tiff", ".woff", ".woff2", ".ttf", ".otf", ".eot", ".pdf", ".zip", ".gz", ".tgz", ".bz2", ".xz", ".7z", ".rar", ".jar", ".class", ".pyc", ".wasm", ".mp3", ".mp4", ".mov", ".avi", ".webm", ".ogg", ".wav", ".flac", ".so", ".dylib", ".dll", ".exe"]);
const LOCK_FILES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "cargo.lock", "poetry.lock", "uv.lock", "composer.lock", "gemfile.lock"]);
const FILTER_LABELS = { all: "All", code: "Code", documentation: "Docs", manifest: "Manifest", test: "Tests", example: "Examples", config: "Config", automation: "CI", asset: "Assets", generated: "Generated", directory: "Folders" };
const SOURCE_LANGUAGES = new Map([
  [".py", "Python"], [".js", "JavaScript"], [".mjs", "JavaScript"], [".cjs", "JavaScript"],
  [".jsx", "JavaScript"], [".ts", "TypeScript"], [".tsx", "TypeScript"], [".vue", "Vue"],
  [".svelte", "Svelte"], [".go", "Go"], [".rs", "Rust"], [".rb", "Ruby"], [".java", "Java"],
  [".kt", "Kotlin"], [".kts", "Kotlin"], [".swift", "Swift"], [".c", "C"], [".h", "C"],
  [".cc", "C++"], [".cpp", "C++"], [".hpp", "C++"], [".cs", "C#"], [".php", "PHP"],
  [".scala", "Scala"], [".ex", "Elixir"], [".exs", "Elixir"], [".erl", "Erlang"],
  [".hs", "Haskell"], [".lua", "Lua"], [".r", "R"], [".jl", "Julia"], [".sh", "Shell"],
  [".bash", "Shell"], [".zsh", "Shell"], [".ps1", "PowerShell"], [".sql", "SQL"],
  [".css", "CSS"], [".scss", "Sass"], [".sass", "Sass"], [".less", "Less"],
  [".md", "Markdown"], [".mdx", "Markdown"], [".rst", "reStructuredText"], [".adoc", "AsciiDoc"],
  [".json", "JSON"], [".yaml", "YAML"], [".yml", "YAML"], [".toml", "TOML"],
]);

function pathBasename(path) {
  return String(path || "").split("/").at(-1) || "";
}

function pathExtension(path) {
  const basename = pathBasename(path).toLowerCase();
  const dot = basename.lastIndexOf(".");
  return dot > 0 ? basename.slice(dot) : "";
}

function isGeneratedPath(path) {
  return String(path || "").split("/").some((part) => GENERATED_FOLDERS.has(part.toLowerCase()));
}

function repositoryPathCategory(path) {
  const lower = String(path || "").toLowerCase();
  const basename = pathBasename(lower);
  const extension = pathExtension(lower);
  if (isGeneratedPath(lower)) return "generated";
  if (lower.startsWith(".github/workflows/") || (/(^|\/)(ci|release|publish)(\.|\/|$)/.test(lower) && /\.(ya?ml|sh)$/.test(lower))) return "automation";
  if (REPOSITORY_MANIFESTS.has(basename)) return "manifest";
  if (/(^|\/)(__tests__|tests?|specs?|e2e|testdata|fixtures)\//.test(lower) || /(^|[._-])(test|spec)([._-]|$)/.test(basename)) return "test";
  if (/^(readme|changelog|contributing|code_of_conduct|security|support)(\.|$)/i.test(basename) || /(^|\/)(docs?|documentation)\//.test(lower) || DOCUMENT_EXTENSIONS.has(extension)) return "documentation";
  if (/(^|\/)(examples?|demos?|playground|samples?)\//.test(lower)) return "example";
  if (STYLE_EXTENSIONS.has(extension) || /(^|\/)(styles?|theme|themes)\//.test(lower)) return "code";
  if (CODE_EXTENSIONS.has(extension)) return "code";
  if (LOCK_FILES.has(basename) || /^(\.?[^/]*(config|rc)|tsconfig|vite\.config|webpack|rollup|eslint|prettier|babel|jest|vitest|tailwind|postcss|dockerfile|makefile)/.test(basename) || CONFIG_EXTENSIONS.has(extension)) return "config";
  return "asset";
}

function pathReadPreference(path, projectName = "", context = "") {
  const depth = path.split("/").length;
  const lower = path.toLowerCase();
  const segments = lower.split("/");
  const basename = pathBasename(lower);
  const stem = basename.replace(/\.[^.]+$/, "");
  const projectStem = String(projectName || "").split("/").at(-1).toLowerCase();
  const directTest = depth === 1 || (["test", "tests", "spec", "specs", "__tests__"].includes(segments[0]) && depth === 2);
  let score = (depth - 1) * 9;
  if (depth === 1 && /^(readme|package|pyproject|requirements|cargo|go)\./i.test(pathBasename(path))) score -= 24;
  if (depth === 1 && /^readme(\.|$)/i.test(basename)) score -= 80;
  if (/(^|\/)(src|lib|app|packages|server|core)\//.test(lower)) score -= 18;
  if (["implementation", "entrypoint", "api"].includes(context) && segments.some((segment) => LEARNING_FOLDERS.has(segment) || SUPPORT_FOLDERS.has(segment) || segment.startsWith("."))) score += 30;
  if (context === "test" && directTest && /(^|\.)(test|spec)(\.|$)/i.test(stem)) score -= 28;
  if (context === "test" && segments.some((segment) => ["testdata", "fixtures", "test_apps", "apps"].includes(segment))) score += 24;
  if (context === "example" && /^readme(\.|$)/i.test(basename)) score -= 20;
  if (context === "example" && /^(main|app|index|manage|example|demo)(\.|$)/i.test(stem)) score -= 12;
  if (["devcontainer", "devcontainers", "docker", "deploy", "deployment", "ci"].includes(segments[0])) score += 30;
  if (["implementation", "entrypoint", "api"].includes(context) && projectStem && stem === projectStem) score -= 24;
  if (context === "implementation" && ["__init__", "index"].includes(stem)) score += 16;
  if (context === "implementation" && ["core", "engine", "server", "main", "app", "client", "router", "context", "request", "response", "handler"].includes(stem)) score -= 10;
  if (["app", "main", "index", "server", "core", "client", "lib", "router"].includes(stem)) score -= 8;
  if (pathExtension(path) === ".sh") score += 10;
  if (isGeneratedPath(lower)) score += 100;
  return score;
}

function chooseReadPath(files, predicate, projectName = "", context = "") {
  return files.filter(predicate).sort((left, right) => pathReadPreference(left, projectName, context) - pathReadPreference(right, projectName, context) || left.localeCompare(right))[0] || "";
}

function guideLineText(value, limit = 180) {
  return String(value || "").replace(/\t/g, "  ").replace(/\s+$/g, "").slice(0, limit);
}

function guideLineNumber(lines, fragment) {
  const needle = String(fragment || "").slice(0, 80);
  if (!needle) return 1;
  const index = lines.findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : 1;
}

function guideLanguage(path) {
  const basename = pathBasename(path).toLowerCase();
  if (basename === "dockerfile") return "Dockerfile";
  if (basename === "makefile") return "Makefile";
  return SOURCE_LANGUAGES.get(pathExtension(path)) || "Plain text";
}

function readingGuideSymbolRank(symbol, path) {
  const name = String(symbol?.name || "");
  const kind = String(symbol?.kind || "").toLowerCase();
  const stem = pathBasename(path).replace(/\.[^.]+$/, "").toLowerCase();
  let score = ["class", "struct", "interface", "trait", "enum", "type", "component", "module"].includes(kind)
    ? 0
    : ["object", "implementation"].includes(kind)
      ? 10
      : kind === "function"
        ? 20
        : 50;
  if (/^_/.test(name) && !/^__.+__$/.test(name)) score += 55;
  if (/^(get|set|is|has|should|can|to|from|with|as|of|on|by|format|shorten)_/i.test(name)) score += 14;
  if (name.length <= 3) score += 10;
  if (/^(main|app|run|start|create|new|init|default|serve|server|render|load|build|parse|handle|use|engine|client|router|context)/i.test(name)) score -= 12;
  if (name.toLowerCase() === stem) score -= 25;
  return score * 10_000 + (Number(symbol?.line) || 0);
}

function sortReadingGuideSymbols(symbols, path) {
  return [...symbols].sort((left, right) => readingGuideSymbolRank(left, path) - readingGuideSymbolRank(right, path));
}

function buildReadingGuide(path, text, options = {}) {
  const source = String(text || "").replace(/\r\n?/g, "\n");
  if (!source.trim()) return null;
  const lines = source.split("\n");
  const basename = pathBasename(path).toLowerCase();
  const category = repositoryPathCategory(path);
  const language = guideLanguage(path);
  const manifest = REPOSITORY_MANIFESTS.has(basename) || /^(cargo\.toml|requirements\.txt|go\.mod|pyproject\.toml|package\.json)$/.test(basename);
  const document = DOCUMENT_EXTENSIONS.has(pathExtension(path)) || category === "documentation";

  if (manifest) {
    const symbols = [];
    const imports = [];
    const seen = new Set();
    const addSymbol = (name, kind, line, signature) => {
      const key = `${kind}:${name}`;
      if (!name || seen.has(key) || symbols.length >= 12) return;
      seen.add(key);
      symbols.push({ name: String(name).slice(0, 90), kind, line, signature: guideLineText(signature) });
    };
    const addImport = (name, line, detail = "") => {
      if (!name || imports.some((item) => item.source === name) || imports.length >= 12) return;
      imports.push({ source: String(name).slice(0, 120), names: detail ? [String(detail).slice(0, 80)] : [], line });
    };
    let headline = "";
    let notice = "";
    if (basename === "package.json") {
      try {
        const parsed = JSON.parse(source);
        const scripts = Object.entries(parsed.scripts || {});
        const dependencies = { ...(parsed.dependencies || {}), ...(parsed.devDependencies || {}) };
        scripts.slice(0, 6).forEach(([name, command]) => addSymbol(name, "script", guideLineNumber(lines, `"${name}"`), `"${name}": "${command}"`));
        Object.entries(dependencies).slice(0, 8).forEach(([name, version]) => addImport(name, guideLineNumber(lines, `"${name}"`), String(version)));
        const commandNames = scripts.slice(0, 3).map(([name]) => name);
        headline = `This manifest declares ${scripts.length} command${scripts.length === 1 ? "" : "s"} and ${Object.keys(dependencies).length} dependency entr${Object.keys(dependencies).length === 1 ? "y" : "ies"}.`;
        notice = commandNames.length
          ? `Start with the ${naturalList(commandNames.map((name) => `“${name}”`))} command${commandNames.length === 1 ? "" : "s"}; they connect the repository to a reproducible workflow.`
          : "No command scripts are declared here, so read the dependency entries as the project's visible capability boundary.";
      } catch {
        headline = "This package manifest is not valid JSON in the readable sample.";
        notice = "The original manifest is still linked below; the museum does not infer commands from malformed JSON.";
      }
    } else if (basename === "go.mod") {
      lines.forEach((line, index) => {
        const module = line.match(/^\s*module\s+(\S+)/);
        if (module) addSymbol(module[1], "module", index + 1, line);
        const requirement = line.match(/^\s*(?:require\s+)?([A-Za-z0-9._~-]+\.[A-Za-z]{2,}\/[^\s]+)\s+v?[^\s]+/);
        if (requirement && !requirement[1].startsWith("//")) addImport(requirement[1], index + 1);
      });
      const module = symbols.find((item) => item.kind === "module");
      headline = module ? `This module manifest names ${module.name} as the import root and exposes ${imports.length} visible module requirement${imports.length === 1 ? "" : "s"}.` : `This Go module manifest exposes ${imports.length} readable module requirement${imports.length === 1 ? "" : "s"}.`;
      notice = module ? `Begin with the module path ${module.name}, then inspect the requirements to see which external packages the source tree can borrow.` : "Begin with the declared requirements; they form the project's visible external capability boundary.";
    } else if (basename === "cargo.toml") {
      lines.forEach((line, index) => {
        const packageName = line.match(/^\s*name\s*=\s*["']([^"']+)["']/);
        if (packageName && !symbols.length) addSymbol(packageName[1], "package", index + 1, line);
        const dependency = line.match(/^\s*([A-Za-z0-9_-]+)\s*=\s*(?:\{[^}]*version\s*=\s*)?["']([^"']+)["']/);
        if (dependency && !["name", "version", "edition", "rust-version", "description"].includes(dependency[1])) addImport(dependency[1], index + 1, dependency[2]);
      });
      headline = `This Cargo manifest declares ${imports.length} visible dependency entr${imports.length === 1 ? "y" : "ies"} around ${symbols[0]?.name || "the crate"}.`;
      notice = "Read the package identity first, then the dependency sections to see which capabilities the Rust crate delegates.";
    } else if (basename === "pyproject.toml") {
      const records = tomlAssignmentRecords(source);
      const projectName = records.find((record) => record.section === "project" && record.key === "name");
      if (projectName) addSymbol(tomlStringValue(projectName.value), "package", projectName.line, lines[projectName.line - 1]);
      records.filter((record) => ["project.scripts", "tool.poetry.scripts"].includes(record.section)).slice(0, 8).forEach((record) => {
        addSymbol(record.key, "script", record.line, lines[record.line - 1]);
      });
      tomlDependencyEntries(source, "pyproject.toml").slice(0, 12).forEach((dependency) => {
        addImport(dependency.name, dependency.line, dependency.version);
      });
      const commands = symbols.filter((symbol) => symbol.kind === "script");
      headline = `This Python project manifest establishes ${symbols.find((symbol) => symbol.kind === "package")?.name || "the package"}, ${imports.length} visible dependency entr${imports.length === 1 ? "y" : "ies"}, and ${commands.length} command${commands.length === 1 ? "" : "s"}.`;
      notice = commands.length
        ? `Start with the ${naturalList(commands.slice(0, 3).map((command) => `“${command.name}”`))} command${commands.length === 1 ? "" : "s"}, then read the dependency groups as the project's visible capability boundary.`
        : "Read the package identity, then the dependency groups: together they define what the project claims and what it borrows.";
    } else {
      lines.forEach((line, index) => {
        const requirement = line.match(/^\s*([A-Za-z0-9_.-]+)(?:\[[^\]]+\])?\s*(?:[<>=!~].*)?$/);
        if (requirement && !requirement[1].startsWith("#")) addImport(requirement[1], index + 1);
      });
      headline = `This manifest lists ${imports.length} visible dependency entr${imports.length === 1 ? "y" : "ies"}.`;
      notice = "Use the declarations as a capability boundary, not as proof that every package is active in the same code path.";
    }
    return {
      model: "text-structure/v1",
      mode: "manifest",
      language,
      headline: clipReadingGuide(headline, 220),
      notice: clipReadingGuide(notice, 300),
      facts: [{ label: "Declarations", value: String(symbols.length) }, { label: "Dependencies", value: String(imports.length) }, { label: "Lines", value: String(lines.length) }],
      symbols,
      imports,
      boundary: options.truncated ? "Structural scan of the readable preview only; the manifest continues beyond this sample." : "Structural scan of the readable manifest; no install or command execution was observed.",
    };
  }

  if (document) {
    const headings = [];
    let firstParagraph = "";
    let inFence = false;
    for (let index = 0; index < lines.length && headings.length < 24; index += 1) {
      const raw = lines[index];
      const stripped = raw.trim();
      if (/^(?:```|~~~)/.test(stripped)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const heading = raw.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (heading) {
        headings.push({ name: stripMarkdownInline(heading[2]).slice(0, 100), kind: "section", line: index + 1, signature: guideLineText(stripped) });
        continue;
      }
      if (!firstParagraph && stripped && !/^\s*(?:[-+*]|\d+[.)])\s+/.test(raw) && !/^\[[^\]]+\]:/.test(stripped) && !/^[|<>]/.test(stripped)) {
        const cleaned = stripMarkdownInline(stripped);
        if (cleaned.length >= 28) firstParagraph = cleaned;
      }
    }
    const primary = headings[0]?.name || pathBasename(path);
    const headline = headings.length
      ? `This document opens with “${primary}” and is organised into ${headings.length} visible heading${headings.length === 1 ? "" : "s"}.`
      : `This document offers a ${lines.length}-line readable record without Markdown headings.`;
    const notice = firstParagraph
      ? `Start with the section “${primary}”. The first substantive passage says: “${clipReadingGuide(firstParagraph, 180)}”`
      : `Start at “${primary}”; the scan did not find a plain introductory paragraph to quote without risking misrepresentation.`;
    return {
      model: "text-structure/v1",
      mode: "document",
      language,
      headline: clipReadingGuide(headline, 220),
      notice: clipReadingGuide(notice, 340),
      facts: [{ label: "Sections", value: String(headings.length) }, { label: "Lines", value: String(lines.length) }],
      symbols: headings,
      imports: [],
      boundary: options.truncated ? "Structural scan of the readable preview only; later sections may be outside this sample." : "Structural scan of the readable document; quoted language remains the project's own wording.",
    };
  }

  const symbols = [];
  const imports = [];
  const seenSymbols = new Set();
  const seenImports = new Set();
  const addSymbol = (name, kind, line, signature) => {
    const key = `${kind}:${name}`;
    if (!name || seenSymbols.has(key) || symbols.length >= 36) return;
    seenSymbols.add(key);
    symbols.push({ name: String(name).slice(0, 100), kind, line, signature: guideLineText(signature, 200) });
  };
  const addImport = (source, line, names = []) => {
    if (!source || seenImports.has(source) || imports.length >= 24) return;
    seenImports.add(source);
    imports.push({ source: String(source).slice(0, 160), line, names: names.map((name) => String(name).slice(0, 70)).slice(0, 5) });
  };

  let inGoImportBlock = false;
  let inCommentBlock = false;
  lines.forEach((raw, index) => {
    const line = raw.trim();
    const lineNumber = index + 1;
    if (!line) return;
    if (inCommentBlock) { if (line.includes("*/")) inCommentBlock = false; return; }
    if (/^\/\*/.test(line)) { if (!line.includes("*/")) inCommentBlock = true; return; }
    const topLevel = raw === raw.trimStart();
    const extension = pathExtension(path).toLowerCase();

    if (extension === ".py") {
      const declaration = raw.match(/^(?:async\s+)?(class|def)\s+([A-Za-z_]\w*)\s*(\([^)]*\))?\s*:?/);
      if (declaration) addSymbol(declaration[2], declaration[1] === "class" ? "class" : "function", lineNumber, line);
      const fromImport = line.match(/^from\s+([.\w]+)\s+import\s+(.+)$/);
      if (fromImport) addImport(fromImport[1], lineNumber, fromImport[2].replace(/[()]/g, "").split(",").map((name) => name.trim().split(/\s+as\s+/)[0]).filter(Boolean));
      const plainImport = line.match(/^import\s+(.+)$/);
      if (plainImport) plainImport[1].split(",").forEach((name) => addImport(name.trim().split(/\s+as\s+/)[0], lineNumber));
    } else if ([".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte"].includes(extension)) {
      const fromImport = line.match(/^import\s+(.+?)\s+from\s+["']([^"']+)["']/);
      if (fromImport) addImport(fromImport[2], lineNumber, [fromImport[1].replace(/[{}*]/g, "").trim()]);
      const sideImport = line.match(/^import\s+["']([^"']+)["']/);
      if (sideImport) addImport(sideImport[1], lineNumber);
      const required = line.match(/(?:require|import)\(\s*["']([^"']+)["']\s*\)/);
      if (required) addImport(required[1], lineNumber);
      if (topLevel) {
        const fn = raw.match(/^(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);
        const cls = raw.match(/^(?:export\s+(?:default\s+)?)?class\s+([A-Za-z_$][\w$]*)/);
        const typed = raw.match(/^(?:export\s+)?(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/);
        const arrow = raw.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/);
        const plainFn = raw.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\b/);
        if (fn) addSymbol(fn[1], "function", lineNumber, line);
        if (cls) addSymbol(cls[1], "class", lineNumber, line);
        if (typed) addSymbol(typed[1], typed[1] && typed[0].includes("interface") ? "interface" : "type", lineNumber, line);
        if (arrow) addSymbol(arrow[1], /^[A-Z]/.test(arrow[1]) ? "component" : "function", lineNumber, line);
        if (plainFn) addSymbol(plainFn[1], "function", lineNumber, line);
      }
    } else if (extension === ".go") {
      if (/^import\s*\(/.test(line)) { inGoImportBlock = true; return; }
      if (inGoImportBlock && line === ")") { inGoImportBlock = false; return; }
      if (inGoImportBlock) {
        const imported = line.match(/(?:[._A-Za-z]\w*\s+)?["']([^"']+)["']/);
        if (imported) addImport(imported[1], lineNumber);
      }
      const singleImport = line.match(/^import\s+(?:[._A-Za-z]\w*\s+)?["']([^"']+)["']/);
      if (singleImport) addImport(singleImport[1], lineNumber);
      const type = raw.match(/^type\s+([A-Za-z_]\w*)\s+(struct|interface)\b/);
      const fn = raw.match(/^func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)\s*\(/);
      if (type) addSymbol(type[1], type[2], lineNumber, line);
      if (fn) addSymbol(fn[1], "function", lineNumber, line);
    } else if (extension === ".rs") {
      const imported = line.match(/^use\s+([^;]+);/);
      if (imported) addImport(imported[1].split("::").slice(0, 2).join("::"), lineNumber, [imported[1]]);
      const declaration = raw.match(/^(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?(fn|struct|enum|trait|mod)\s+([A-Za-z_]\w*)/);
      const implementation = raw.match(/^impl(?:<[^>]+>)?\s+(?:[^ ]+\s+for\s+)?([A-Za-z_]\w*)/);
      if (declaration) addSymbol(declaration[2], declaration[1], lineNumber, line);
      if (implementation) addSymbol(implementation[1], "implementation", lineNumber, line);
    } else if (extension === ".rb") {
      const declaration = raw.match(/^\s*(class|module|def)\s+([A-Za-z_][\w:!?=]*)/);
      if (declaration) addSymbol(declaration[2], declaration[1], lineNumber, line);
      const required = line.match(/^require(?:_relative)?\s+["']([^"']+)["']/);
      if (required) addImport(required[1], lineNumber);
    } else if ([".java", ".kt", ".kts", ".cs", ".scala"].includes(extension)) {
      const imported = line.match(/^import\s+([\w.*]+);?/);
      if (imported) addImport(imported[1], lineNumber);
      const declaration = raw.match(/^(?:\s*(?:public|private|protected|internal|open|abstract|final|static|sealed|data)\s+)*(class|interface|enum|record|fun|object)\s+([A-Za-z_]\w*)/);
      if (declaration) addSymbol(declaration[2], declaration[1], lineNumber, line);
    } else if (extension === ".php") {
      const required = line.match(/(?:require|include)(?:_once)?\s*\(?\s*["']([^"']+)["']/);
      if (required) addImport(required[1], lineNumber);
      const declaration = raw.match(/^\s*(?:abstract\s+|final\s+)?(class|interface|trait|function)\s+([A-Za-z_]\w*)/);
      if (declaration) addSymbol(declaration[2], declaration[1], lineNumber, line);
    } else if (extension === ".sh" || extension === ".bash" || extension === ".zsh") {
      const fn = raw.match(/^(?:function\s+)?([A-Za-z_][\w-]*)\s*(?:\(\))?\s*\{/);
      if (fn) addSymbol(fn[1], "function", lineNumber, line);
    }
  });

  if (!symbols.length) {
    const fallback = lines.find((line) => line.trim() && !/^[#/*]/.test(line.trim()));
    if (fallback) addSymbol(pathBasename(path), "file", guideLineNumber(lines, fallback.trim()), fallback);
  }
  const rankedSymbols = sortReadingGuideSymbols(symbols, path);
  const symbolNames = rankedSymbols.slice(0, 3).map((item) => item.name);
  const importSources = imports.slice(0, 3).map((item) => item.source);
  const headline = rankedSymbols.length
    ? `${language} source. The structural scan finds ${rankedSymbols.length} top-level declaration${rankedSymbols.length === 1 ? "" : "s"}${symbolNames.length ? `, led by ${naturalList(symbolNames)}` : ""}.`
    : `${language} source. The structural scan finds no named top-level declaration pattern.`;
  const first = rankedSymbols[0];
  const notice = first
    ? `Start with ${first.kind} ${first.name} at line ${first.line}.${importSources.length ? ` It also borrows from ${naturalList(importSources)}.` : ""} Read the declaration sites as navigation clues, not as proof of the runtime path.`
    : `Read the file as a supporting record;${importSources.length ? ` its visible imports point to ${naturalList(importSources)}.` : " no top-level declaration or import pattern is available."}`;
  return {
    model: "text-structure/v1",
    mode: "source",
    language,
    headline: clipReadingGuide(headline, 230),
    notice: clipReadingGuide(notice, 320),
    facts: [{ label: "Declarations", value: String(rankedSymbols.length) }, { label: "Imports", value: String(imports.length) }, { label: "Lines", value: String(lines.length) }],
    symbols: rankedSymbols,
    imports,
    boundary: options.truncated ? "Structural scan of the first 60,000 readable characters only; later declarations may be outside this sample." : "Structural scan of the readable source text; declarations and imports are not an execution trace.",
  };
}

function buildReadOrder(files, projectName = "") {
  const eligible = files.filter((path) => !isGeneratedPath(path));
  const used = new Set();
  const route = [];
  const add = (path, role, why, kind) => {
    if (!path || used.has(path)) return;
    used.add(path);
    route.push({ path, role, why, kind, evidence: path });
  };
  const rootReadme = chooseReadPath(eligible, (path) => !path.includes("/") && /^readme(\.|$)/i.test(pathBasename(path)), projectName, "documentation");
  const readme = rootReadme || chooseReadPath(eligible, (path) => /^readme(\.|$)/i.test(pathBasename(path)), projectName, "documentation");
  const rootManifest = chooseReadPath(eligible, (path) => !path.includes("/") && REPOSITORY_MANIFESTS.has(pathBasename(path).toLowerCase()), projectName, "manifest");
  const manifest = rootManifest || chooseReadPath(eligible, (path) => REPOSITORY_MANIFESTS.has(pathBasename(path).toLowerCase()), projectName, "manifest");
  const sourceCandidates = eligible.filter((path) => CODE_EXTENSIONS.has(pathExtension(path)));
  let entrypoint = chooseReadPath(sourceCandidates, (path) => /^(main|app|cli|server|index|__main__|manage|bin)(\.|$)/i.test(pathBasename(path)), projectName, "entrypoint");
  let entrypointWhy = "Follow the most plausible boundary from a caller or command into the source tree.";
  if (!entrypoint) {
    const projectStem = String(projectName || "").split("/").at(-1).toLowerCase();
    entrypoint = chooseReadPath(sourceCandidates, (path) => {
      const stem = pathBasename(path).replace(/\.[^.]+$/, "").toLowerCase();
      return Boolean(projectStem) && stem === projectStem && !["test", "example", "generated"].includes(repositoryPathCategory(path));
    }, projectName, "entrypoint");
    if (entrypoint) entrypointWhy = "This project-named source is the clearest public boundary available without assuming an executable command.";
  }
  const entrySet = new Set([readme, manifest, entrypoint]);
  const implementation = chooseReadPath(sourceCandidates, (path) => {
    if (entrySet.has(path)) return false;
    return !["test", "example", "generated"].includes(repositoryPathCategory(path)) && !/^(vite|vitest|jest|webpack|rollup|eslint|tsconfig|babel|postcss|tailwind)\./i.test(pathBasename(path));
  }, projectName, "implementation");
  const apiSurface = chooseReadPath(sourceCandidates, (path) => !entrySet.has(path) && path !== implementation && /(^|\/)(api|routes?|handlers?|controllers?|endpoints?|server)(\/|\.|$)/i.test(path.toLowerCase()), projectName, "api");
  const example = chooseReadPath(eligible, (path) => /(^|\/)(examples?|demos?|playground|samples?)\//i.test(path) && /^(readme|main|app|index|manage|example|demo)(\.|$)/i.test(pathBasename(path)), projectName, "example");
  const test = chooseReadPath(eligible, (path) => repositoryPathCategory(path) === "test" && /(^|[._-])(test|spec)([._-]|$)/i.test(pathBasename(path)), projectName, "test");
  const automation = chooseReadPath(eligible, (path) => repositoryPathCategory(path) === "automation", projectName, "automation");
  add(readme, "Public promise", "Start with the project's own account of what it does and who it serves.", "documentation");
  add(manifest, "Dependency boundary", "See the declared commands and the capabilities the project chooses to borrow.", "manifest");
  add(entrypoint, "Visible entry point", entrypointWhy, "entrypoint");
  add(implementation, "Main implementation", "Read the largest implementation trail after the public and entry-point claims are clear.", "implementation");
  add(apiSurface, "Public working surface", "Look for the names that expose behavior to callers rather than internal helpers.", "api");
  add(example, "Worked example", "Connect the code to an ordinary use without guessing about runtime behavior.", "example");
  add(test, "Expected behavior", "Read what the project treats as correct when the happy path is exercised.", "test");
  if (route.length < 4) add(automation, "Maintenance path", "Finish with the checks and publication steps that keep the reading current.", "automation");
  if (!route.length && files[0]) add(files[0], "Repository record", "Begin with the first tracked file available in this partial map.", "fallback");
  return route;
}

function investigationPromptFor(item) {
  const guide = item?.readingGuide;
  const primary = guide?.symbols?.[0];
  const imports = (guide?.imports || []).slice(0, 3).map((entry) => entry.source).filter(Boolean);
  const role = item?.role || "Tracked evidence";
  if (item?.kind === "documentation") {
    return primary
      ? `Read “${clipReadingGuide(primary.name, 72)}” first. Record one user action and one promised outcome before following their code-shaped labels.`
      : "Read the opening claim first. Record one user action and one promised outcome before following code-shaped labels.";
  }
  if (item?.kind === "manifest") {
    return imports.length
      ? `Separate declared capability from observed use. The manifest visibly names ${naturalList(imports.map((name) => `“${name}”`))}; none is proven active by the declaration alone.`
      : "Separate declared capability from observed use. Start with commands and package names, then look for source evidence elsewhere.";
  }
  if (["entrypoint", "implementation", "api", "example", "test", "automation"].includes(item?.kind)) {
    if (primary) {
      const importNote = imports.length ? ` The same scan finds ${naturalList(imports.map((name) => `“${name}”`))} at its visible boundary.` : "";
      return `Locate ${primary.kind || "signal"} ${primary.name} at line ${primary.line || 1}. Infer only the responsibility its name and signature support.${importNote}`;
    }
    return `${role}. Follow names and imports as reading clues; do not turn this file into a runtime call-path claim.`;
  }
  return item?.why || "Read this path for a structural clue, then check the linked source before drawing a conclusion.";
}

function investigationFindingFor(id, steps) {
  const paths = steps.map((step) => step.path);
  const implementation = steps.find((step) => ["implementation", "api", "entrypoint"].includes(step.kind)) || steps.find((step) => step.readingGuide?.symbols?.length);
  const primary = implementation?.readingGuide?.symbols?.[0];
  const imports = (implementation?.readingGuide?.imports || []).slice(0, 3).map((entry) => entry.source).filter(Boolean);
  const facts = implementation?.readingGuide?.facts || [];
  const declarationFact = facts.find((fact) => /declaration/i.test(fact.label));
  const sourceNote = primary
    ? ` On the structural scan, ${implementation.path} opens with ${primary.kind || "signal"} ${primary.name} at line ${primary.line || 1}${declarationFact ? ` across ${declarationFact.value} visible declaration${declarationFact.value === "1" ? "" : "s"}` : ""}${imports.length ? ` and references ${naturalList(imports.map((name) => `“${name}”`))}` : ""}.`
    : declarationFact ? ` ${implementation.path} exposes ${declarationFact.value} visible declaration${declarationFact.value === "1" ? "" : "s"} in the bounded scan.` : "";
  if (id === "promise-check") {
    const checks = steps.filter((step) => ["example", "test"].includes(step.kind)).map((step) => step.path);
    const maintenance = steps.filter((step) => step.kind === "automation").map((step) => step.path);
    if (!checks.length) return `This route reaches ${naturalList(maintenance.length ? maintenance : paths.slice(1))}, but no worked example or test file enters the investigation. It can show how the project is described or maintained, not whether its public behavior works.`;
    return `This route pairs the public account with ${naturalList([...checks, ...maintenance])}. Compare what the project says with the worked or checked behavior available in the tree; the presence of a check does not prove that it passes.`;
  }
  if (id === "technical-boundary") {
    const manifest = steps.find((step) => step.kind === "manifest");
    const manifestFacts = manifest?.readingGuide?.facts || [];
    const dependencyFact = manifestFacts.find((fact) => /dependenc|declaration/i.test(fact.label));
    if (!manifest) return `Start with ${naturalList(paths.slice(0, 3))}.${sourceNote} No manifest enters this bounded route, so the investigation can compare visible declarations and imports but cannot establish the project's declared packages.`;
    return `Start with ${naturalList(paths.slice(0, 3))}.${dependencyFact ? ` The manifest records ${dependencyFact.value} ${dependencyFact.label.toLowerCase()}.` : ""}${sourceNote} Read declarations and imports as boundaries; the museum did not resolve runtime calls or prove that every package is used.`;
  }
  const roles = steps.slice(0, 4).map((step) => `${step.role || categoryLabel(step.kind)} (${step.path})`);
  if (id === "first-reading") return `This short route connects ${naturalList(roles)}. It offers a structural starting point, but the available categories do not support a claim about a public-to-implementation hand-off.`;
  return `The route connects ${naturalList(roles)}.${sourceNote} This exposes a defensible hand-off between public language, entry points, and implementation; it does not establish that a request executes through these files.`;
}

function buildReadingInvestigations(readOrder = []) {
  const available = (readOrder || []).filter((item) => item?.path);
  const pick = (kinds) => kinds.map((kind) => available.find((item) => item.kind === kind)).filter(Boolean);
  const uniqueSteps = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    });
  };
  const definitions = [
    {
      id: "public-path",
      label: "Trace the public path",
      question: "How does the project's public promise become a visible code path?",
      why: "Begin with the project's own account, then follow the first tracked boundary into implementation.",
      steps: uniqueSteps(pick(["documentation", "entrypoint", "implementation", "api"])),
    },
    {
      id: "promise-check",
      label: "Check the promise",
      question: "What in the repository lets you compare a claim with exercised behavior?",
      why: "Look for examples, checks, and maintenance automation before treating the README as proof.",
      steps: uniqueSteps(pick(["documentation", "example", "test", "automation"])),
    },
    {
      id: "technical-boundary",
      label: "Map the technical boundary",
      question: "What does the project declare, borrow, and implement itself?",
      why: "Read the manifest alongside source declarations and imports to separate declared capability from observed structure.",
      steps: uniqueSteps(pick(["manifest", "entrypoint", "implementation", "api", "test"])),
    },
  ];
  const investigations = definitions
    .filter((definition) => definition.steps.length >= 2)
    .map((definition) => ({
      id: definition.id,
      label: definition.label,
      question: definition.question,
      why: definition.why,
      steps: definition.steps.map((item) => ({
        path: item.path,
        role: item.role || categoryLabel(item.kind),
        kind: item.kind || "reading",
        prompt: investigationPromptFor(item),
        evidence: item.evidence || item.path,
      })),
      finding: investigationFindingFor(definition.id, definition.steps),
      boundary: "Built from tracked paths and bounded text scans only; this investigation does not resolve runtime calls, execute code, or prove a dependency was used.",
    }));
  if (investigations.length) return investigations;
  if (available.length < 2) return [];
  return [{
    id: "first-reading",
    label: "First reading",
    question: "Which visible files give the clearest first account of this repository?",
    why: "The available tree supports a short structural route, but not a more specific multi-file investigation.",
    steps: available.slice(0, 5).map((item) => ({
      path: item.path,
      role: item.role || categoryLabel(item.kind),
      kind: item.kind || "reading",
      prompt: investigationPromptFor(item),
      evidence: item.evidence || item.path,
    })),
    finding: investigationFindingFor("first-reading", available.slice(0, 5)),
    boundary: "Built from the available reading route only; missing evidence was left out rather than invented.",
  }];
}

function buildRepositoryMap(sourceEntries = [], options = {}) {
  const normalized = new Map();
  for (const source of sourceEntries || []) {
    const item = typeof source === "string" ? { path: source.replace(/\/$/, ""), type: source.endsWith("/") ? "directory" : "file" } : source;
    const path = String(item?.path || "").replace(/^\/+|\/+$/g, "");
    if (!path) continue;
    const type = item.type === "directory" || item.type === "tree" ? "directory" : "file";
    const current = normalized.get(`${type}:${path}`);
    normalized.set(`${type}:${path}`, { ...current, ...item, path, type });
  }
  const fileByPath = new Map();
  const directoryPaths = new Set();
  for (const item of normalized.values()) {
    if (item.type === "directory") {
      directoryPaths.add(item.path);
      continue;
    }
    fileByPath.set(item.path, item);
    const parts = item.path.split("/");
    for (let index = 1; index < parts.length; index += 1) directoryPaths.add(parts.slice(0, index).join("/"));
  }
  const directoryCounts = new Map([...directoryPaths].map((path) => [path, 0]));
  for (const path of fileByPath.keys()) {
    const parts = path.split("/");
    for (let index = 1; index < parts.length; index += 1) {
      const parent = parts.slice(0, index).join("/");
      directoryCounts.set(parent, (directoryCounts.get(parent) || 0) + 1);
    }
  }
  const extensionCounts = new Map();
  const entries = [];
  for (const item of normalized.values()) {
    if (item.type === "directory" && !directoryCounts.has(item.path)) directoryCounts.set(item.path, 0);
  }
  for (const [path, count] of [...directoryCounts].sort(([left], [right]) => left.localeCompare(right))) {
    entries.push({ path, type: "directory", category: "directory", role: inferRole(path, true), count });
  }
  for (const [path, item] of [...fileByPath].sort(([left], [right]) => left.localeCompare(right))) {
    const extension = pathExtension(path) || "(none)";
    extensionCounts.set(extension, (extensionCounts.get(extension) || 0) + 1);
    entries.push({ path, type: "file", category: repositoryPathCategory(path), role: inferRole(path), extension, size: Number(item.size) || null });
  }
  const files = [...fileByPath.keys()];
  const readOrder = buildReadOrder(files, options.projectName || "");
  const previewByPath = new Map(readOrder.map((item) => [item.path, item.preview]).filter(([, preview]) => preview));
  for (const item of entries) if (previewByPath.has(item.path)) item.preview = previewByPath.get(item.path);
  for (const item of readOrder) {
    if (item.preview) item.readingGuide = buildReadingGuide(item.path, item.preview, { truncated: item.preview.length >= 60_000 });
  }
  return {
    root: "",
    branch: options.branch || "main",
    truncated: Boolean(options.truncated),
    totalFiles: files.length,
    totalDirectories: directoryPaths.size,
    indexedEntries: entries.length,
    extensions: [...extensionCounts].map(([extension, count]) => ({ extension, count })).sort((left, right) => right.count - left.count || left.extension.localeCompare(right.extension)),
    directories: [...directoryCounts].map(([path, count]) => ({ path, count })).sort((left, right) => right.count - left.count || left.path.localeCompare(right.path)).slice(0, 80),
    readOrder,
    investigations: buildReadingInvestigations(readOrder),
    entries,
    coverageNote: options.truncated ? "GitHub marked this recursive tree as truncated; the explorer indexes only the paths returned before that boundary." : "Every path returned by the current recursive tree is indexed.",
  };
}

function stripMarkdownInline(value) {
  return String(value || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/\[([^[\]]{1,120})\]/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~]+/g, "")
    .replace(/\\([\[\]()#*_`])/g, "$1")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ").trim();
}

function markdownParagraphs(markdown) {
  if (!markdown) return [];
  let lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
  if (lines[0]?.trim() === "---") {
    const end = lines.slice(1).findIndex((line) => /^(?:---|\.\.\.)$/.test(line.trim()));
    if (end >= 0) lines = lines.slice(end + 2);
  }
  const paragraphs = [];
  let current = [];
  let inFence = false;
  const flush = () => {
    const candidate = current.join(" ").replace(/\s+/g, " ").trim();
    current = [];
    if (candidate && /[A-Za-z\u4e00-\u9fff]/.test(candidate)) paragraphs.push(candidate);
  };
  for (const line of lines) {
    const stripped = line.trim();
    if (/^(?:`{3,}|~{3,})/.test(stripped)) { flush(); inFence = !inFence; continue; }
    if (inFence) continue;
    if (!stripped) { flush(); continue; }
    if (/^\s{0,3}#{1,6}\s+/.test(line)) { flush(); continue; }
    if (/^\s*\[[^\]]+\]:\s*\S+/.test(line)) continue;
    if (/^\s*(?:[-+*]|\d+[.)])\s+/.test(line)) continue;
    if (/^\s*(?:\|.*\|?|[-:_]{3,})\s*$/.test(line)) continue;
    if (/^\s*\[?!\[|<img\b/i.test(stripped)) continue;
    const cleaned = stripMarkdownInline(stripped.replace(/^\s*>\s?/, ""));
    if (cleaned && /[A-Za-z\u4e00-\u9fff]/.test(cleaned)) current.push(cleaned);
  }
  flush();
  return paragraphs;
}

function plainText(markdown) {
  return markdownParagraphs(markdown).join(" ");
}

function naturalList(items) {
  const clean = items.filter(Boolean);
  if (!clean.length) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean.at(-1)}`;
}

function folderPriority(name) {
  const lower = String(name || "").toLowerCase();
  if (IMPLEMENTATION_FOLDERS.has(lower)) return 0;
  if (LEARNING_FOLDERS.has(lower)) return 1;
  if (SUPPORT_FOLDERS.has(lower) || lower.startsWith(".")) return 4;
  return 2;
}

function isSupportFolder(name) {
  return folderPriority(name) >= 4;
}

function inferRole(name, isFolder = false) {
  const lower = String(name || "").toLowerCase();
  if (isFolder) {
    const roles = new Map([
      ["src", "Where the main implementation lives"], ["lib", "Reusable implementation code"], ["app", "The application composition layer"], ["apps", "The application composition layer"], ["packages", "Separate packages maintained in one workspace"], ["package", "Separate packages maintained in one workspace"], ["server", "The server-side boundary"], ["backend", "The server-side boundary"], ["api", "The public request and response surface"], ["client", "The visitor-facing application layer"], ["web", "The visitor-facing application layer"], ["frontend", "The visitor-facing application layer"], ["ui", "The visitor-facing application layer"], ["components", "Reusable building blocks for the implementation"], ["modules", "Reusable building blocks for the implementation"], ["routes", "Where incoming requests are routed"], ["handlers", "Where incoming requests are routed"], ["models", "The project's data model"], ["core", "Core behavior shared across the project"], ["services", "Service-level behavior and integrations"], ["skills", "Agent instructions and reusable tooling"], ["schema", "Shared data contracts"], ["schemas", "Shared data contracts"], ["migrations", "Recorded data-model changes"], ["test", "Where behavior is checked"], ["tests", "Where behavior is checked"], ["spec", "Where behavior is checked"], ["__tests__", "Where behavior is checked"], ["e2e", "Where behavior is checked"], ["docs", "Where people learn how to use it"], ["doc", "Where people learn how to use it"], ["website", "Where people learn how to use it"], ["site", "Where people learn how to use it"], ["examples", "Small spaces for trying the project"], ["example", "Small spaces for trying the project"], ["playground", "Small spaces for trying the project"], ["demo", "Small spaces for trying the project"], ["scripts", "Utilities that support the project workflow"], ["tools", "Utilities that support the project workflow"], ["bin", "Utilities that support the project workflow"], ["config", "Project-wide configuration"], ["configs", "Project-wide configuration"], ["assets", "Assets delivered with the project"], ["public", "Assets delivered with the project"], ["static", "Assets delivered with the project"], ["benchmarks", "Measured performance scenarios"], ["benchmark", "Measured performance scenarios"], ["fixtures", "Controlled inputs for checks and examples"], [".github", "Automation and publishing metadata"], [".repo-museum", "Generated museum artifacts"],
    ]);
    if (roles.has(lower)) return roles.get(lower);
    if (lower.startsWith(".")) return "Repository metadata and local tooling";
    return "A tracked top-level area whose role is not stated by its name";
  }
  const basename = lower.split("/").at(-1);
  if (basename.startsWith("readme")) return "The project's public introduction";
  if (/^(package\.json|pyproject\.toml|requirements\.txt|cargo\.toml|go\.mod)$/.test(basename)) return "Project instructions and dependencies";
  if (/^(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|cargo\.lock|uv\.lock|poetry\.lock)$/.test(basename)) return "Dependency and workspace rules";
  if (/(^|[._-])(test|spec)s?[._-]/.test(lower)) return "A check for expected behavior";
  if (/^(vite|vitest|jest|eslint|tsconfig|webpack|rollup|tailwind|prettier)/.test(basename)) return "A configuration point for the toolchain";
  if (basename.startsWith(".")) return "Repository metadata and local tooling";
  if (basename === "index.html") return "The browser document entry point";
  if (/^(app|main|cli|server)\.(?:js|mjs|cjs|ts|tsx|py|rs|go)$/.test(basename)) return "A root command or application entry point";
  if (basename.endsWith(".css")) return "The visual presentation layer";
  if (basename.endsWith(".py")) return "A tracked Python source file";
  if (/\.(?:js|mjs|cjs)$/.test(basename)) return "A tracked JavaScript source file";
  if (/\.(?:ts|tsx)$/.test(basename)) return "A tracked TypeScript source file";
  if (/\.(?:html|css)$/.test(basename)) return "A tracked web presentation file";
  if (/\.(?:json|ya?ml|toml)$/.test(basename)) return "A tracked configuration or data file";
  if (basename.endsWith(".md")) return "A tracked project document";
  return "A tracked file in the current project tree";
}

function buildOrientation(repository, readmeText, manifestMeta = {}) {
  const paragraphs = markdownParagraphs(readmeText);
  const introduction = paragraphs.find((paragraph) => paragraph.length >= 20) || paragraphs[0] || "";
  const description = clipSentence(repository.description || manifestMeta.description || introduction || "This public repository is still being read.", 240);
  const language = repository.language || "mixed technology";
  return {
    what: `${description} The visible stack is ${language}.`,
    oneLine: description,
    use: introduction ? clipSentence(introduction, 240) : `Explore the repository's ${language} code and public history.`,
    how: introduction ? "Read the introduction, then move through the tree and history to see how the project is assembled." : "Start with the visible tree, then use commits and manifests to understand how it is assembled.",
    outcome: `what ${repository.name || "this project"} does, how a request moves through it, and why its history matters.`,
    example: "Start with an ordinary person using the project. The next room follows that action through the repository.",
    guide: introduction ? "The orientation begins with the repository description and README prose, then points to structure and history." : "The orientation is a rule-based reading of public repository metadata.",
    sourceNote: introduction ? "Based on the public description and the first prose paragraph in the README." : "Based on the public repository description; README prose was not available.",
  };
}

function buildJourney(repository, readmeText, architecture, manifestPath) {
  const name = repository.name || "this project";
  const readmePath = architecture?.files?.find((item) => item.name.toLowerCase().startsWith("readme"))?.evidence || "README.md";
  const evidence = readmePath || manifestPath || architecture?.files?.[0]?.evidence || "README.md";
  const entryPoint = architecture?.entrypoints?.[0] || manifestPath || evidence;
  const mainArea = architecture?.folders?.find((item) => IMPLEMENTATION_FOLDERS.has(item.name.toLowerCase()))?.evidence || architecture?.folders?.[0]?.evidence || evidence;
  const resultArea = architecture?.folders?.find((item) => LEARNING_FOLDERS.has(item.name.toLowerCase()))?.evidence || readmePath;
  return {
    intro: `Before reading files, follow one ordinary use of ${name}: a person gives it an input and waits for a result. The repository is the machinery between those two moments.`,
    summary: "An input enters, the project transforms or coordinates it, and a result comes back. The exact path depends on this repository's purpose.",
    steps: [
      { number: "01", label: "A person starts", title: "The request begins outside the code", plain: "Someone gives the project an input, opens it, or runs one of its commands.", technical: "The public README and entry files describe the first boundary into the system.", evidence },
      { number: "02", label: "The project receives it", title: "An entry point accepts the request", plain: "One visible part of the repository is responsible for receiving that action.", technical: "Scripts, commands, routes, or exported modules form the project's entry surface.", evidence: entryPoint },
      { number: "03", label: "The work happens", title: "The project coordinates its parts", plain: "The request moves through the main implementation and any supporting tools it needs.", technical: "The source tree and dependency manifest reveal the components involved.", evidence: mainArea },
      { number: "04", label: "A result returns", title: "The project produces something useful", plain: "The person receives a page, file, answer, transformation, or other result.", technical: "Tests, examples, and public documentation show what the project considers a result.", evidence: resultArea },
      { number: "05", label: "The project is maintained", title: "The loop starts again", plain: "People change the project, release new versions, and keep the path working.", technical: "Git history, manifests, and release markers show how the system continues to evolve.", evidence: manifestPath || readmePath || evidence },
    ],
    glossary: [
      { term: "entry point", plain: "A place where a person, command, or another program enters the project." },
      { term: "implementation", plain: "The part that performs the project's main work." },
      { term: "dependency", plain: "A capability the project borrows instead of building itself." },
    ],
    sourceNote: readmeText ? "Teaching path inferred from the tracked README, visible tree, manifest, and Git history. It explains a likely path without claiming hidden runtime behavior." : "Teaching path inferred from the visible tree, manifest, and Git history.",
  };
}

function buildArchitecture(tree = [], manifestPath, readmeText, repository, repositoryMap = null) {
  const paths = tree.map((item) => String(item || "").replace(/\/\.directory$/, "").replace(/\/$/, "")).filter(Boolean);
  const folderCounts = new Map();
  for (const path of paths.filter((item) => item.includes("/"))) {
    const folder = path.split("/")[0];
    if (!GENERATED_FOLDERS.has(folder.toLowerCase())) folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
  }
  const folders = [...folderCounts].map(([name, fileCount]) => ({ name, role: inferRole(name, true), evidence: name, fileCount }))
    .sort((left, right) => folderPriority(left.name) - folderPriority(right.name) || right.fileCount - left.fileCount || left.name.localeCompare(right.name)).slice(0, 10);
  const rootFiles = paths.filter((item) => !item.includes("/"));
  const readmePath = rootFiles.find((item) => item.toLowerCase().startsWith("readme")) || (readmeText ? "README.md" : "");
  const entryPattern = /^(main|app|cli|server|index|__main__|manage|bin)(\.|$)/i;
  const sourceExtensions = /\.(?:py|js|mjs|cjs|jsx|ts|tsx|rs|go|rb|java|kt|swift|c|cc|cpp|h|hpp|cs|php|html)$/i;
  const entryCandidates = paths.filter((item) => entryPattern.test(pathBasename(item)) && sourceExtensions.test(item));
  entryCandidates.push(...paths.filter((item) => sourceExtensions.test(item) && !entryCandidates.includes(item)));
  const order = repositoryMap?.readOrder || [];
  const orderPath = (kind) => order.find((item) => item.kind === kind)?.path || "";
  const actualEntrypoints = [...new Set([orderPath("entrypoint"), orderPath("api"), ...entryCandidates.slice(0, 3)].filter(Boolean))].slice(0, 3);
  const entrypoints = actualEntrypoints.length ? actualEntrypoints : [manifestPath || readmePath || "README.md"].filter(Boolean);
  const orderedFiles = order.map((item) => ({ name: item.path, role: item.role || inferRole(item.path), evidence: item.path, why: item.why }));
  const interesting = [...new Set([
    readmePath,
    manifestPath,
    ...orderedFiles.map((item) => item.name),
    ...entryCandidates.slice(0, 4),
    ...paths.filter((item) => /workspace|config|test|spec/i.test(pathBasename(item))).slice(0, 4),
  ].filter(Boolean))];
  const files = interesting.slice(0, 12).map((name) => ({ name, role: inferRole(name), evidence: name }));
  if (!folders.length && !files.length) return demoData.architecture;
  const workingFolders = folders.filter((item) => !isSupportFolder(item.name));
  const sourceFiles = files.filter((item) => /source file|application script|application entry point|document entry point|presentation layer|server or request surface/i.test(item.role)).slice(0, 2);
  const leadingPaths = [...new Set([
    orderPath("documentation"),
    orderPath("manifest"),
    orderPath("entrypoint"),
    orderPath("implementation"),
    ...sourceFiles.map((item) => item.name),
    ...workingFolders.slice(0, 2).map((item) => item.name),
  ].filter(Boolean))].slice(0, 5);
  const summary = leadingPaths.length
    ? `${repository.language || "Mixed stack"} project with ${repositoryMap?.totalFiles ?? paths.length} indexed files. A first reading route runs through ${naturalList(leadingPaths)}.`
    : `${repository.language || "Mixed stack"} project whose work is visible mainly through ${repositoryMap?.totalFiles ?? paths.length} tracked files.`;
  const mainFolder = workingFolders.find((item) => IMPLEMENTATION_FOLDERS.has(item.name.toLowerCase()));
  const resultFolder = workingFolders.find((item) => LEARNING_FOLDERS.has(item.name.toLowerCase()));
  return {
    summary,
    flow: [
      { label: "Person or caller", role: "Where the request begins", detail: "Start with the public promise, then follow the files that translate it into a working boundary.", evidence: readmePath || orderPath("documentation") || "README.md" },
      { label: "Entry point", role: "The front door", detail: "The reading route identifies a tracked source or command surface before descending into helpers.", evidence: orderPath("entrypoint") || entrypoints[0] || manifestPath || readmePath || "README.md" },
      { label: "Main implementation", role: "Where the work happens", detail: "The implementation trail is selected from the recursive tree, not just a top-level folder name.", evidence: orderPath("implementation") || mainFolder?.evidence || entrypoints[0] || readmePath || "README.md" },
      { label: "Supporting tools", role: "Capabilities the project borrows", detail: "The manifest and configuration make the project's dependency and build boundaries visible.", evidence: manifestPath || orderPath("manifest") || files[0]?.name || readmePath || "README.md" },
      { label: "Result", role: "What comes back", detail: "Examples, documentation, and checks show what the project expects a usable result to look like.", evidence: orderPath("example") || orderPath("test") || resultFolder?.evidence || readmePath || manifestPath || "README.md" },
    ],
    folders,
    files,
    entrypoints,
    sourceNote: repositoryMap
      ? `Roles are inferred from ${repositoryMap.totalFiles} recursively indexed files and ${repositoryMap.totalDirectories} directories; the suggested route never claims to have executed the project.`
      : "Roles are inferred from tracked names and paths; each item links back to the file or directory that supports the reading.",
  };
}

demoData.repositoryMap = buildRepositoryMap([
  "README.md",
  "package.json",
  "pnpm-workspace.yaml",
  "CONTRIBUTING.md",
  ".github/workflows/ci.yml",
  "packages/vite/package.json",
  "packages/vite/src/node/cli.ts",
  "packages/vite/src/node/server/index.ts",
  "packages/vite/src/node/plugin.ts",
  "packages/vite/src/node/optimizer/index.ts",
  "packages/vite/src/client/client.ts",
  "packages/vite/src/shared/hmr.ts",
  "packages/plugin-react/src/index.ts",
  "packages/plugin-vue/src/index.ts",
  "docs/guide/index.md",
  "docs/guide/features.md",
  "docs/guide/api-plugin.md",
  "playground/vue/index.html",
  "playground/vue/src/main.ts",
  "playground/vue/src/App.vue",
  "packages/vite/src/node/__tests__/plugins/index.spec.ts",
  "packages/vite/src/node/__tests__/server/index.spec.ts",
  "packages/vite/src/node/__tests__/config.spec.ts",
  "packages/vite/src/types/index.d.ts",
  "packages/vite/client.d.ts",
  "scripts/build.js",
  "scripts/release.js",
  "LICENSE",
], { branch: "main" });

function clipSentence(value, limit = 210) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const sentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || text;
  return sentence.length > limit ? `${sentence.slice(0, limit - 1).trim()}…` : sentence;
}

function clipReadingGuide(value, limit = 300) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= limit) return text;
  const candidate = text.slice(0, limit - 1);
  const shortened = candidate.includes(" ") ? candidate.replace(/\s+\S*$/, "").trimEnd() : candidate.trimEnd();
  return `${(shortened || candidate).replace(/[ ,;:]+$/, "")}…`;
}

function phaseList(data) {
  const analysis = data.analysis || {};
  if (Array.isArray(analysis.phases) && analysis.phases.length) return analysis.phases;
  return (analysis.arc || []).map((chapter, index) => {
    const label = String(chapter.label || `Chapter ${index + 1}`).toLowerCase();
    const role = label.includes("origin") ? "origin" : label.includes("turn") ? "turning" : index === (analysis.arc || []).length - 1 ? "now" : "chapter";
    return { ...chapter, role, commitCount: chapter.commitCount ?? null };
  });
}

function phaseByRole(phases, role) {
  return phases.find((phase) => phase.role === role);
}

function dedupeEvidence(items, limit) {
  const seen = new Set();
  const unique = [];
  for (const item of items || []) {
    const ref = String(item?.ref || "").trim();
    if (!ref) continue;
    const key = `${item.type || "file"}:${ref}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...item, ref, label: item.label || ref });
  }
  return typeof limit === "number" ? unique.slice(0, limit) : unique;
}

function roomDiscoveryFallback(data, room) {
  const architecture = data.architecture || {};
  const analysis = data.analysis || {};
  const phases = phaseList(data);
  const origin = phaseByRole(phases, "origin") || phases[0];
  const turning = phaseByRole(phases, "turning");
  const now = phaseByRole(phases, "now") || phases.at(-1);
  const firstFile = data.journey?.steps?.[0]?.evidence || data.manifestPath || "README.md";
  if (room.id === "hall-overview") {
    return `The public introduction describes this project as “${clipSentence(data.orientation?.oneLine || data.description || data.name, 150).replace(/[.!?]+$/, "")}.”`;
  }
  if (room.id === "hall-journey") {
    const entrypoints = (architecture.entrypoints || []).slice(0, 2);
    return entrypoints.length
      ? `The visible record points first to ${entrypoints.join(" and ")} as the clearest place to begin tracing how the project is used.`
      : `The visible record does not expose a confident entry point; this journey remains an explicitly inferred teaching model.`;
  }
  if (room.id === "hall-architecture") {
    const sources = (architecture.files || []).filter((item) => /source file|application script|application entry point|document entry point|presentation layer|server or request surface/i.test(item.role || "")).slice(0, 2).map((item) => item.name);
    const roles = (architecture.folders || []).filter((item) => !isSupportFolder(item.name)).slice(0, 3).map((item) => `${item.name} (${String(item.role || "a tracked area").replace(/^The /, "").toLowerCase()})`);
    if (sources.length && roles.length) return `The visible working structure pairs ${naturalList(sources)} with ${naturalList(roles)}.`;
    if (roles.length) return `The tracked working structure concentrates on ${naturalList(roles)}.`;
    if (sources.length) return `The most legible working structure is carried by ${naturalList(sources)}.`;
    return "The tree exposes too few implementation-named areas for a strong structural claim, so the blueprint stays deliberately coarse.";
  }
  if (room.id === "hall-history") {
    if (!phases.length) return "The sampled public record has no dated commits, so the museum marks history as unavailable instead of inventing an arc.";
    const chapterPhases = [...new Map([origin, turning, now].filter(Boolean).map((phase) => [phase.id || phase.label, phase])).values()];
    const sequence = chapterPhases.map((phase) => `“${clipSentence(phase.title, 95)}”`);
    if (sequence.length === 1) return `The sample contains one dated chapter, ${sequence[0]}; there is no evidence for a middle turning point.`;
    if (!turning) return `The sampled record moves from ${sequence[0]} to ${sequence.at(-1)}; no interior day exists to support a turning-point claim.`;
    return `The sampled record becomes legible as ${sequence.join(" → ")}; each chapter groups same-day commits behind one dated marker.`;
  }
  if (room.id === "hall-dependencies") {
    const dependency = data.dependencies?.[0];
    return dependency
      ? `${data.manifestPath || "The manifest"} declares ${dependency.name}${dependency.version ? ` ${dependency.version}` : ""}; it ${dependencyCapability(dependency.name, dependency.type).replace(/\.$/, "").toLowerCase()}.`
      : "No readable direct dependency was exposed, so this room is omitted rather than staged empty.";
  }
  if (room.id === "hall-opera") {
    const sequence = [...new Map([origin, turning, now].filter(Boolean).map((phase) => [phase.id || phase.label, phase])).values()].map((phase) => clipSentence(phase.title, 85));
    return sequence.length > 1
      ? `The most defensible story in this sample is the sequence ${sequence.map((item) => `“${item}”`).join(" → ")}, with every stop tied to dated evidence.`
      : `The strongest thing this sample supports is one visible record: “${clipSentence(origin?.title || data.description, 150)}”.`;
  }
  return clipSentence(room.takeaway || room.plain || `The archive reveals how ${data.name} is assembled.`);
}

function roomEvidenceTrail(data, room) {
  if (Array.isArray(room.evidenceTrail) && room.evidenceTrail.length) return room.evidenceTrail;
  return (room.evidence || []).slice(0, 3).map((item, index) => ({
    ...item,
    claim: index === 0 ? roomDiscoveryFallback(data, room) : room.takeaway || `Evidence supporting the reading in ${room.label || "this room"}.`,
  }));
}

function buildLearning(data) {
  const architecture = data.architecture || {};
  const analysis = data.analysis || {};
  const firstStep = data.journey?.steps?.[0]?.evidence || data.manifestPath || "README.md";
  const mainArea = architecture.folders?.find((item) => /src|lib|app|packages|server|core/i.test(item.name))?.evidence || architecture.folders?.[0]?.evidence || firstStep;
  const historyEvidence = dedupeEvidence((analysis.phases || analysis.arc || []).slice(0, 3).flatMap((chapter) => chapter.evidence || []), 4);
  const phases = phaseList(data);
  const historyScene = phases.length <= 1
    ? "Read the sampled public record without filling gaps the evidence cannot support."
    : phases.length === 2
      ? "Read the sampled record as an origin and a present state, leaving the missing middle explicitly empty."
      : "Read the public record as origin, strongest visible movement, and now.";
  const origin = phaseByRole(phases, "origin") || phases[0];
  const turning = phaseByRole(phases, "turning");
  const now = phaseByRole(phases, "now") || phases.at(-1);
  const manifest = data.manifestPath || firstStep;
  const dependency = data.dependencies?.[0];
  const entrypoints = dedupeEvidence((architecture.entrypoints || []).slice(0, 2).map((ref) => ({ type: "file", ref, claim: "This visible entry signal supports the suggested teaching path." })), 2);
  const areaEvidence = dedupeEvidence((architecture.flow || []).slice(0, 3).filter((item) => item.evidence).map((item) => ({ type: "file", ref: item.evidence, claim: item.detail || item.role || "This area supports the blueprint reading." })), 3);
  const base = {
    promise: `By the end, you can explain what ${data.name?.split("/").pop()?.trim() || "this project"} is for, follow one likely use path, and connect its current shape to the public history.`,
    rooms: [
      { id: "hall-overview", label: "The foyer", question: "What is this project for?", scene: `Start with the promise, not the tree: ${clipSentence(data.orientation?.oneLine || data.description || data.name, 150)}`, plain: data.orientation?.what || data.orientation?.oneLine || data.description, reveal: data.orientation?.how || "The visible documentation and tree show the project's main boundary.", whyItMatters: "Start with the job before naming the machinery.", interaction: "before-after", takeaway: data.orientation?.outcome || data.orientation?.oneLine || data.description, mode: "observed", evidence: [{ type: "file", ref: firstStep, label: firstStep }] },
      { id: "hall-journey", label: "First visitor", question: "What happens when someone uses it?", scene: "Follow one ordinary input from the person using the project to the result they receive.", plain: data.journey?.summary || "An input enters, the project coordinates its parts, and a result comes back.", reveal: data.journey?.sourceNote || "This path is a conservative interpretation of the visible repository record.", whyItMatters: "A request path gives the tree a sequence.", interaction: "path", mode: "inferred", takeaway: data.journey?.summary || "An input enters, the project coordinates its parts, and a result comes back.", evidence: (data.journey?.steps || []).slice(0, 2).map((step) => ({ type: "file", ref: step.evidence || firstStep, label: step.evidence || firstStep })) },
      { id: "hall-architecture", label: "Blueprint room", question: "Which parts make that journey possible?", scene: "Read the repository as a building plan: every visible area has a possible job.", plain: architecture.summary || "The visible tree is the project's first blueprint.", reveal: architecture.sourceNote || "Roles are inferred from visible repository evidence.", whyItMatters: "Naming a part is less useful than knowing what it helps the visitor path do.", interaction: "blueprint", takeaway: architecture.summary || "The visible tree is the project's first blueprint.", mode: "observed", evidence: (architecture.flow || []).slice(0, 2).map((item) => ({ type: "file", ref: item.evidence || mainArea, label: item.evidence || mainArea })) },
      { id: "hall-history", label: "History hall", question: "Why does it look this way now?", scene: historyScene, plain: analysis.historySummary || analysis.thesis || "The current shape is the result of observable changes over time.", reveal: "The chapters are selected from commits and releases; they describe the record without claiming private intent.", whyItMatters: "History turns today's structure into a consequence rather than a pile of facts.", interaction: "chapters", takeaway: analysis.historySummary || analysis.thesis || "The current shape is the result of observable changes over time.", mode: "mixed", evidence: historyEvidence },
      ...(data.dependencies?.length ? [{ id: "hall-dependencies", label: "Ecosystem room", question: "What supports it?", scene: "Meet the capabilities this project chooses to borrow.", plain: `${data.dependencies.length} direct dependencies are visible in ${data.manifestPath || "the project manifests"}; they show which capabilities the repository delegates.`, reveal: "Each specimen is observed in a manifest. Its capability label is an interpretation, so keep the source link close.", whyItMatters: "Dependencies reveal the project's boundaries.", interaction: "specimens", takeaway: `${data.dependencies.length} direct dependencies are visible in ${data.manifestPath || "the project manifests"}; they show which capabilities the repository borrows.`, mode: "observed", evidence: [{ type: "file", ref: manifest, label: manifest }] }] : []),
      { id: "hall-opera", label: "Exit workshop", question: "What should I remember?", scene: "Rehearse the project story before you leave.", plain: "The project is easiest to remember as a map from purpose to path, parts, and history.", reveal: analysis.exit || "The pulse is a record of activity, not a quality score.", whyItMatters: "A visitor should leave able to explain the project without reopening the code.", interaction: "rehearsal", takeaway: analysis.exit || "The project is easiest to remember as a map from purpose to path, parts, and history.", mode: "mixed", evidence: [{ type: "file", ref: firstStep, label: firstStep }, ...historyEvidence.slice(-1)] },
    ],
  };
  const trails = {
    "hall-overview": [{ type: "file", ref: firstStep, claim: "The public introduction is the source for this plain-language orientation." }],
    "hall-journey": entrypoints.length ? entrypoints : [{ type: "file", ref: firstStep, claim: "The README is the only visible source for this inferred path." }],
    "hall-architecture": areaEvidence.length ? areaEvidence : [{ type: "file", ref: mainArea, claim: "This visible area supports the structural reading." }],
    "hall-history": [...new Map([origin, turning, now].filter(Boolean).map((phase) => [phase.id || phase.label, phase])).values()].flatMap((phase) => (phase.evidence || []).map((item) => ({ ...item, claim: phase.role === "turning" ? phase.reason || phase.lesson : phase.lesson || phase.summary }))).slice(0, 4),
    "hall-dependencies": dependency ? [{ type: "file", ref: manifest, claim: `The manifest directly declares ${dependency.name}; its capability label is an interpretation.` }] : [],
    "hall-opera": [{ type: "file", ref: firstStep, claim: "The introduction supplies the project's stated purpose." }, ...(now?.evidence || []).slice(0, 1).map((item) => ({ ...item, claim: "The newest sampled record supplies the current-state evidence." }))],
  };
  base.rooms = base.rooms.map((room) => {
    const evidenceTrail = dedupeEvidence(trails[room.id] || room.evidence || [], 4);
    return { ...room, discovery: roomDiscoveryFallback(data, { ...room, evidenceTrail }), evidence: dedupeEvidence(room.evidence || evidenceTrail, 4), evidenceTrail };
  });
  return base;
}

function commitDateValue(commit) {
  return commit?.commit?.author?.date || commit?.commit?.committer?.date || commit?.date || "";
}

function commitSubjectOf(commit) {
  return (commit?.commit?.message || commit?.message || "A new mark in the archive").split("\n")[0].trim();
}

function commitAuthorOf(commit) {
  return commit?.commit?.author?.name || commit?.author?.login || "Unknown author";
}

function commitUrl(data, commit) {
  if (commit?.html_url) return commit.html_url;
  const sha = commit?.sha || commit?.source?.ref;
  return sha ? `${data.htmlUrl}/commit/${sha}` : `${data.htmlUrl}/commits`;
}

function groupCommitsByDay(commits = []) {
  const groups = new Map();
  commits.forEach((commit) => {
    const date = dayKey(commitDateValue(commit));
    if (!date) return;
    if (!groups.has(date)) groups.set(date, { date, commits: [] });
    groups.get(date).commits.push(commit);
  });
  return [...groups.values()]
    .map((group) => ({ ...group, commits: group.commits.sort((a, b) => commitDateValue(a).localeCompare(commitDateValue(b))) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function releaseDay(release) {
  return dayKey(release.published_at || release.created_at || release.date);
}

function dayDistance(left, right) {
  return Math.abs(new Date(`${left}T00:00:00Z`).getTime() - new Date(`${right}T00:00:00Z`).getTime()) / 86400000;
}

function nearestRelease(release, day) {
  return (release || [])
    .filter((item) => releaseDay(item))
    .map((item) => ({ item, distance: dayDistance(releaseDay(item), day) }))
    .filter((entry) => entry.distance <= 3)
    .sort((a, b) => a.distance - b.distance)[0]?.item || null;
}

function phaseEvidence(commit, claim, release = null) {
  const evidence = [];
  if (commit) {
    evidence.push({ type: "commit", ref: commit.sha, label: shortenSha(commit.sha), claim });
  }
  if (release?.tag_name) {
    evidence.push({ type: "release", ref: release.tag_name, label: release.tag_name, claim: "A public release marker falls within three days of this phase." });
  }
  return evidence;
}

function selectTurningDay(days, releases = []) {
  if (days.length <= 2) return null;
  return days.slice(1, -1).map((day, index) => {
    const subjects = day.commits.map(commitSubjectOf);
    const structural = subjects.filter((subject) => /\b(breaking|rewrite|refactor|migrat|architecture|workspace|monorepo|plugin|typescript|esm|api|release|major)\b/i.test(subject)).length;
    const release = nearestRelease(releases, day.date);
    const centrality = Math.min(index + 1, days.length - index - 2);
    const score = structural * 7 + Math.min(day.commits.length, 12) * 3 + (release ? 10 : 0) + Math.min(centrality, 6);
    const observations = [
      `${day.commits.length} commit${day.commits.length === 1 ? "" : "s"} share this day`,
      structural ? `${structural} subject${structural === 1 ? "" : "s"} use structural-change language` : "no subject uses structural-change language",
      release ? `release ${release.tag_name} is within three days` : "no nearby release is visible in the sample",
    ];
    return { day, release, score, structural, reason: `Selected from ${days.length - 2} interior date${days.length - 2 === 1 ? "" : "s"}: ${observations.join("; ")}.` };
  }).sort((a, b) => b.score - a.score || b.day.commits.length - a.day.commits.length)[0];
}

function buildPhases(days, releases = [], coverage = "") {
  if (!days.length) return [];
  const phaseFor = (day, role, label) => {
    const representative = role === "now" ? day.commits.at(-1) : day.commits[0];
    const release = role === "turning" ? nearestRelease(releases, day.date) : null;
    const subject = commitSubjectOf(representative);
    const author = commitAuthorOf(representative);
    const reason = role === "origin"
      ? `This is the earliest natural day in the visible sample${day.commits.length > 1 ? `; its ${day.commits.length} commits are represented once` : ""}.`
      : role === "now"
        ? `This is the newest natural day in the visible sample${day.commits.length > 1 ? `; its ${day.commits.length} commits are represented once` : ""}.`
        : "Chosen from interior dates by commit activity, structural-change language, and nearby release evidence.";
    const lesson = role === "origin"
      ? "Treat this as the start of the visible record, not proof that no earlier work exists."
      : role === "now"
        ? "This shows what the sampled record was doing most recently, not a complete measure of project health."
        : "This is an evidence-backed reading of where the sampled history moves most legibly; it does not establish private intent.";
    return {
      id: role === "now" && days.length === 1 ? "record" : role,
      label,
      role,
      start: day.date,
      end: day.date,
      title: subject.slice(0, 72),
      summary: `${author} recorded “${subject.slice(0, 110)}” on ${formatDate(day.date)}. ${day.commits.length} commit${day.commits.length === 1 ? "" : "s"} from that day ${day.commits.length === 1 ? "is" : "are"} grouped behind this entry.`,
      lesson,
      commitCount: day.commits.length,
      reason,
      evidence: phaseEvidence(representative, lesson, release),
      coverage,
    };
  };
  if (days.length === 1) return [phaseFor(days[0], "now", "Visible record")];
  if (days.length === 2) return [phaseFor(days[0], "origin", "Origin"), phaseFor(days[1], "now", "Now")];
  const turning = selectTurningDay(days, releases);
  const origin = phaseFor(days[0], "origin", "Origin");
  const now = phaseFor(days.at(-1), "now", "Now");
  if (!turning) return [origin, now];
  const turn = phaseFor(turning.day, "turning", "Turning point");
  turn.reason = turning.reason;
  return [origin, turn, now];
}

function buildDailyEvents(days, releases, phases, data) {
  const selectedDates = new Set();
  phases.forEach((phase) => selectedDates.add(phase.start));
  days.slice(-5).forEach((day) => selectedDates.add(day.date));
  if (days[0]) selectedDates.add(days[0].date);
  const byDay = new Map(days.map((day) => [day.date, day]));
  const releaseByDay = new Map();
  releases.forEach((release) => {
    const date = releaseDay(release);
    if (!date) return;
    if (!releaseByDay.has(date)) releaseByDay.set(date, []);
    releaseByDay.get(date).push(release);
  });
  return [...selectedDates].sort((a, b) => b.localeCompare(a)).slice(0, 8).map((date) => {
    const day = byDay.get(date);
    const dayReleases = releaseByDay.get(date) || [];
    const representative = day?.commits.at(-1);
    const phase = phases.find((item) => item.start === date);
    const release = dayReleases[0];
    const subject = representative ? commitSubjectOf(representative) : `Release ${release?.tag_name || "marker"}`;
    const authors = [...new Set((day?.commits || []).map(commitAuthorOf))];
    const releaseNote = dayReleases.length ? `release ${dayReleases.map((item) => item.tag_name).join(", ")}` : "";
    const metaParts = [
      day?.commits.length ? `${day.commits.length} commit${day.commits.length === 1 ? "" : "s"} grouped` : "public release marker",
      authors.length ? `latest by ${authors.at(-1)}` : "",
      releaseNote,
    ].filter(Boolean);
    return {
      date,
      title: subject.slice(0, 72),
      meta: metaParts.join(" · "),
      sha: representative ? shortenSha(representative.sha) : (release?.tag_name || "release"),
      kind: phase?.role === "origin" ? "origin" : release ? "release" : "commit",
      groupCount: day?.commits.length || 1,
      releaseTags: dayReleases.map((item) => item.tag_name),
      url: representative ? commitUrl(data, representative) : (release?.html_url || `${data.htmlUrl}/releases`),
      source: representative ? { type: "commit", ref: representative.sha, label: shortenSha(representative.sha) } : { type: "release", ref: release?.tag_name || "release", label: release?.tag_name || "Release" },
    };
  });
}

function buildDailyPulse(days, releases = [], htmlUrl = "") {
  return days.slice(-18).map((day) => {
    const latest = day.commits.at(-1);
    const structural = day.commits.filter((commit) => /\b(breaking|rewrite|refactor|migrat|architecture|workspace|plugin|typescript|api|release|major)\b/i.test(commitSubjectOf(commit))).length;
    const release = nearestRelease(releases, day.date);
    return {
      sha: shortenSha(latest.sha),
      date: formatDate(day.date, false),
      fullDate: day.date,
      score: Math.min(96, 20 + Math.min(day.commits.length, 8) * 8 + structural * 4 + (release ? 6 : 0)),
      groupCount: day.commits.length,
      url: latest.html_url || (htmlUrl ? `${htmlUrl}/commit/${latest.sha}` : ""),
    };
  });
}

function buildBrowserAnalysis(data, commits = [], releases = [], coverage = "") {
  const days = groupCommitsByDay(commits);
  const phases = buildPhases(days, releases, coverage);
  const distinctDates = days.length;
  const collapsed = days.reduce((total, day) => total + Math.max(0, day.commits.length - 1), 0);
  const projectName = data.name?.split("/").pop()?.trim() || "This project";
  if (!phases.length) {
    return {
      headline: `${projectName} has a record that is still too thin to stage.`,
      thesis: "No public commit days were available, so the museum does not invent an origin, turning point, or present state.",
      historySummary: "There is not enough dated public evidence to tell a three-part history yet.",
      exit: "Leave with the structural reading only; the historical chapter is marked as partial.",
      confidence: "Partial public record",
      arc: [],
      phases: [],
      turningPointReason: "No dated public commits were available.",
      distinctDates: 0,
      excludedSameDayEvents: 0,
      coverage: coverage || "No commit history was loaded.",
      signals: [
        { label: "Distinct days", value: "0", detail: "public history sample" },
        { label: "Direct dependencies", value: String((data.dependencies || []).length), detail: data.manifestPath || "visible manifests" },
        { label: "Visible releases", value: String((releases || []).length), detail: "public releases" },
      ],
    };
  }
  const origin = phases.find((phase) => phase.role === "origin") || phases[0];
  const turning = phases.find((phase) => phase.role === "turning");
  const now = phases.find((phase) => phase.role === "now") || phases.at(-1);
  const spread = distinctDates === 1 ? "One natural day is" : `${distinctDates} distinct natural days are`;
  const headline = turning
    ? `${projectName}: from “${origin.title}” to “${now.title}”`
    : `${projectName}: a partial record from ${formatDate(origin.start)} to ${formatDate(now.start)}`;
  const thesis = turning
    ? `The visible record moves from “${origin.title}” through “${turning.title}” to “${now.title}”. The selected turn is a reading of dated evidence, not a claim about private intent.`
    : `The visible record currently supports ${phases.length === 1 ? "one dated chapter" : "only an origin and a present state"}; the museum leaves the missing middle explicitly empty.`;
  const historySummary = turning
    ? `${spread} represented. The strongest observable turn is “${turning.title}” on ${formatDate(turning.start)}. ${turning.reason}`
    : `${spread} represented. ${distinctDates < 2 ? "A turning point requires more than one dated chapter, so the museum does not invent one." : "No interior day supports a turning-point claim, so the museum leaves that middle explicitly empty."}`;
  return {
    headline,
    thesis,
    historySummary,
    exit: `You can now retell ${projectName} as “${origin.title}” → ${turning ? `“${turning.title}” → ` : ""}“${now.title}”, with each stop tied to a dated public record.`,
    confidence: coverage || "Browser evidence reading",
    arc: phases,
    phases,
    turningPointReason: turning?.reason || "A third distinct natural day was not available for a turning-point read.",
    distinctDates,
    excludedSameDayEvents: collapsed,
    coverage: coverage || `${commits.length} sampled commits compressed into ${distinctDates} natural days.`,
    signals: [
      { label: "Distinct days", value: String(distinctDates), detail: `${collapsed} same-day duplicates grouped` },
      { label: "Direct dependencies", value: String((data.dependencies || []).length), detail: data.manifestPath || "visible manifests" },
      { label: "Visible releases", value: String((releases || []).length), detail: "public release markers" },
    ],
  };
}

function buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText = "", tree = [], historyMeta = {}, repositoryMap = null) {
  const repoName = `${repository.owner.login} / ${repository.name}`;
  const language = repository.language || Object.keys(languages)[0] || "Mixed stack";
  const days = groupCommitsByDay(commits);
  const data = {
    repo,
    name: repoName,
    description: repository.description || "A public repository with a story still being written.",
    htmlUrl: repository.html_url,
    defaultBranch: repository.default_branch || "main",
    createdAt: repository.created_at,
    pushedAt: repository.pushed_at,
    language,
    license: repository.license?.spdx_id || "Unspecified",
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    issues: repository.open_issues_count,
    contributors,
    orientation: buildOrientation(repository, readmeText),
    architecture: buildArchitecture(tree, manifestPath, readmeText, repository, repositoryMap),
    repositoryMap,
    dependencies,
    manifestPath,
    historyCoverage: historyMeta.coverage || "",
    commits: buildDailyPulse(days, releases, repository.html_url),
  };
  data.journey = buildJourney(repository, readmeText, data.architecture, manifestPath);
  data.analysis = buildBrowserAnalysis(data, commits, releases, historyMeta.coverage);
  data.events = buildDailyEvents(days, releases, data.analysis.phases, data);
  if (!data.events.length) {
    data.events.push({ date: dayKey(repository.created_at), title: "The repository record opens", meta: "Repository created · public record", sha: "origin", kind: "origin", groupCount: 1, url: repository.html_url });
  }
  data.learning = buildLearning(data);
  return data;
}

async function fetchMuseumData(repo) {
  const repository = await githubFetch(`/repos/${repo}`);
  const branch = repository.default_branch || "main";
  const [commitPage, releases, contributors, languages, readmeResponse, recursiveTree, rootContents] = await Promise.all([
    githubFetchPage(`/repos/${repo}/commits?per_page=100`),
    githubFetch(`/repos/${repo}/releases?per_page=8`),
    githubFetch(`/repos/${repo}/contributors?per_page=6`),
    githubFetch(`/repos/${repo}/languages`),
    githubFetch(`/repos/${repo}/readme`).catch(() => null),
    githubFetch(`/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`).catch(() => null),
    githubFetch(`/repos/${repo}/contents/`).catch(() => null),
  ]);
  const latestCommits = Array.isArray(commitPage.data) ? commitPage.data : [];
  const lastPage = lastPageFromLink(commitPage.link);
  let commits = latestCommits;
  let coverage = `Loaded the latest ${latestCommits.length} public commits; this is a partial sample.`;
  if (lastPage > 1) {
    try {
      const earliestPage = await githubFetch(`/repos/${repo}/commits?per_page=100&page=${lastPage}`);
      commits = [...latestCommits, ...(Array.isArray(earliestPage) ? earliestPage : [])];
      coverage = `Sampled the latest 100 and earliest page of ${lastPage}; middle history is not loaded. ${commits.length} dated commits are available for phase reading.`;
    } catch {
      coverage = `Loaded the latest ${latestCommits.length} public commits. The earliest page could not be read, so the origin is the oldest visible marker in this sample.`;
    }
  } else {
    coverage = `Loaded all ${latestCommits.length} public commits returned by this repository.`;
  }
  const seen = new Set();
  commits = commits.filter((commit) => {
    if (!commit?.sha || seen.has(commit.sha)) return false;
    seen.add(commit.sha);
    return true;
  }).sort((a, b) => commitDateValue(b).localeCompare(commitDateValue(a)));
  const manifestCandidates = ["package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod"];
  const visibleRootFiles = new Set(Array.isArray(rootContents) ? rootContents.map((item) => item?.name).filter(Boolean) : []);
  const manifests = Array.isArray(rootContents)
    ? manifestCandidates.filter((manifest) => visibleRootFiles.has(manifest))
    : manifestCandidates;
  let dependencies = [];
  let manifestPath = null;
  for (const manifest of manifests) {
    const contents = await readManifest(repo, manifest);
    dependencies = parseDependencies(contents, manifest);
    if (dependencies.length) { manifestPath = manifest; break; }
  }
  const readmeText = decodeBase64(readmeResponse?.content);
  const recursiveEntries = Array.isArray(recursiveTree?.tree)
    ? recursiveTree.tree.filter((item) => item?.path && ["blob", "tree"].includes(item.type)).map((item) => ({ path: item.path, type: item.type === "tree" ? "directory" : "file", size: item.size }))
    : [];
  const fallbackEntries = Array.isArray(rootContents)
    ? rootContents.map((item) => ({ path: item.name, type: item.type === "dir" ? "directory" : "file", size: item.size })).filter((item) => item.path)
    : [];
  const repositoryMap = buildRepositoryMap(recursiveEntries.length ? recursiveEntries : fallbackEntries, { branch, truncated: Boolean(recursiveTree?.truncated), projectName: repo.split("/").at(-1) });
  const architecturePaths = recursiveEntries.filter((item) => item.type === "file").map((item) => item.path);
  const treeItems = architecturePaths.length ? architecturePaths : fallbackEntries.map((item) => item.type === "directory" ? `${item.path}/.directory` : item.path);
  return buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText, treeItems, { coverage }, repositoryMap);
}

function setLoading(isLoading) {
  el("loading-state").hidden = !isLoading;
  el("museum-content").hidden = isLoading;
  el("error-state").hidden = true;
}

function showContent() {
  el("loading-state").hidden = true;
  el("error-state").hidden = true;
  el("museum-content").hidden = false;
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
  timeline.replaceChildren(...(data.events || []).map((event) => {
    const item = document.createElement("article"); item.className = "timeline-item";
    const date = document.createElement("time"); date.className = "timeline-date"; date.dateTime = event.date || ""; date.textContent = formatDate(event.date);
    const dot = document.createElement("span"); dot.className = "timeline-dot";
    const copy = document.createElement("div");
    const title = document.createElement("h5"); title.className = "timeline-title";
    const sourceUrl = sourceHref(data, event.source || { type: "commit", ref: event.sha });
    const titleLink = document.createElement("a"); titleLink.href = sourceUrl; titleLink.target = "_blank"; titleLink.rel = "noreferrer"; titleLink.textContent = event.title; title.append(titleLink);
    const meta = document.createElement("p"); meta.className = "timeline-meta"; meta.textContent = event.meta || "A public record marker";
    const sourceLine = document.createElement("div"); sourceLine.className = "timeline-source-line";
    const sha = document.createElement("a"); sha.className = "timeline-sha"; sha.href = sourceUrl; sha.target = "_blank"; sha.rel = "noreferrer"; sha.textContent = `${event.sha} ↗`;
    sourceLine.append(sha);
    if ((event.groupCount || 1) > 1) {
      const group = document.createElement("span"); group.className = "timeline-group"; group.textContent = `${event.groupCount} related markers grouped`; sourceLine.append(group);
    }
    (event.releaseTags || []).slice(0, 2).forEach((tag) => {
      const release = document.createElement("a"); release.className = "timeline-release"; release.href = `${data.htmlUrl}/releases/tag/${tag}`; release.target = "_blank"; release.rel = "noreferrer"; release.textContent = tag; sourceLine.append(release);
    });
    copy.append(title, meta, sourceLine); item.append(date, dot, copy); return item;
  }));
  const grouped = (data.events || []).reduce((total, event) => total + Math.max(1, event.groupCount || 1), 0);
  const exhibitWord = data.events?.length === 1 ? "dated exhibit" : "dated exhibits";
  const representWord = data.events?.length === 1 ? "represents" : "represent";
  const markerWord = grouped === 1 ? "public marker" : "public markers";
  el("history-note").textContent = data.events?.length ? `${data.events.length} ${exhibitWord} ${representWord} ${grouped} ${markerWord}; same-day records share one stop.` : "No public markers observed";
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
  updateFoyerReveal(data);
}

function updateFoyerReveal(data) {
  const room = roomDefinition(data, "hall-overview") || {};
  const technical = state.foyerView === "technical";
  el("foyer-reveal-title").textContent = technical ? "Now name the machinery" : "The everyday moment";
  el("foyer-reveal-copy").textContent = technical ? (room.reveal || data.orientation?.how || "The repository provides the machinery behind the visible result.") : (room.scene || data.orientation?.example || "Imagine saving a file and seeing the result arrive.");
  document.querySelectorAll("[data-foyer-view]").forEach((button) => button.classList.toggle("is-active", button.dataset.foyerView === state.foyerView));
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
    const article = document.createElement("article"); article.className = `journey-step${index === state.selectedJourneyStep ? " is-selected" : ""}`; article.tabIndex = 0; article.setAttribute("role", "button"); article.setAttribute("aria-pressed", String(index === state.selectedJourneyStep));
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
    body.append(label, title, plain, closer, evidence); article.append(marker, body);
    const selectStep = (event) => { if (event.target.closest("a, summary")) return; state.selectedJourneyStep = index; renderJourney(data); };
    article.addEventListener("click", selectStep);
    article.addEventListener("keydown", (event) => { if (event.target !== article || !["Enter", " "].includes(event.key)) return; event.preventDefault(); selectStep(event); });
    return article;
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
    const node = document.createElement("button"); node.type = "button"; node.className = `machine-node${index === state.selectedArchitecture ? " is-selected" : ""}`; node.dataset.index = String(index); node.setAttribute("aria-pressed", String(index === state.selectedArchitecture));
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("strong"); title.textContent = item.label || "Project part";
    const role = document.createElement("small"); role.textContent = item.role || "A visible part of the system";
    const detail = document.createElement("p"); detail.textContent = item.detail || "Evidence from the repository tree.";
    node.append(number, title, role, detail);
    if (index < flow.length - 1) { const arrow = document.createElement("i"); arrow.className = "machine-arrow"; arrow.textContent = "→"; node.append(arrow); }
    node.addEventListener("click", () => { state.selectedArchitecture = index; renderMachineMap(data); });
    return node;
  }));
  renderArchitectureSpotlight(data);
}

function renderArchitectureSpotlight(data) {
  const flow = data.architecture?.flow || demoData.architecture.flow || [];
  const item = flow[state.selectedArchitecture] || flow[0];
  if (!item) return;
  el("architecture-spotlight-title").textContent = item.label || "Project part";
  el("architecture-spotlight-copy").textContent = `${item.role || "Visible role"}. ${item.detail || "This area contributes to the visitor path."}`;
  el("architecture-spotlight-source").href = evidenceHref(data, item.evidence);
}

function resetRepositoryExplorer() {
  state.explorerAbortController?.abort();
  state.explorerAbortController = null;
  state.explorerQuery = "";
  state.explorerFilter = "all";
  state.explorerPath = "";
  state.explorerInvestigation = "";
  state.explorerPreview = null;
  state.explorerPreviewState = "idle";
  state.explorerRequestId += 1;
  const search = el("repo-map-search");
  if (search) search.value = "";
}

function repositoryMapEntry(map, path) {
  return (map?.entries || []).find((entry) => entry.path === path) || null;
}

function repositoryReadOrderItem(map, path) {
  return (map?.readOrder || []).find((item) => item.path === path) || null;
}

function categoryLabel(category) {
  return FILTER_LABELS[category] || String(category || "path").replace(/^./, (character) => character.toUpperCase());
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size < 0) return "size not indexed";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(size < 10 * 1024 ? 1 : 0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function githubRawUrl(data, path) {
  if (!data?.htmlUrl?.startsWith("https://github.com/") || !path) return "";
  const encodedPath = path.split("/").map((part) => encodeURIComponent(part)).join("/");
  const branch = String(data.defaultBranch || "main").split("/").map((part) => encodeURIComponent(part)).join("/");
  return `https://raw.githubusercontent.com/${data.repo}/${branch}/${encodedPath}`;
}

function previewFallbackReason(entry) {
  if (!entry || entry.type !== "file") return "";
  const basename = pathBasename(entry.path).toLowerCase();
  if (PREVIEW_BLOCKED_EXTENSIONS.has(pathExtension(entry.path))) return "This looks like a binary or media file, so the museum will not pretend it is readable text.";
  if (LOCK_FILES.has(basename)) return "Lock files are intentionally left out of the reading view because they are generated dependency snapshots.";
  if (/\.min\.(?:js|css)$/.test(basename)) return "Minified files are skipped because they obscure the source structure rather than explain it.";
  if (Number(entry.size) > 2_000_000) return `This file is ${formatFileSize(entry.size)}. Open it on GitHub instead of loading an oversized preview.`;
  return "";
}

function looksBinaryText(text) {
  const sample = String(text || "").slice(0, 4000);
  if (sample.includes("\u0000")) return true;
  const controls = [...sample].filter((character) => {
    const code = character.charCodeAt(0);
    return code < 9 || (code > 13 && code < 32);
  }).length;
  return sample.length > 0 && controls / sample.length > 0.03;
}

function renderRepositoryRoute(data) {
  const map = data.repositoryMap;
  if (!map) return;
  if (!Array.isArray(map.investigations) || !map.investigations.length) map.investigations = buildReadingInvestigations(map.readOrder || []);
  const investigations = map.investigations || [];
  let investigation = investigations.find((item) => item.id === state.explorerInvestigation) || investigations[0];
  if (!investigation) {
    el("repo-map-route-note").textContent = "The indexed tree does not yet support a multi-file investigation.";
    el("repo-investigation-tabs").replaceChildren();
    el("repo-investigation-question").textContent = "No supported investigation yet.";
    el("repo-investigation-why").textContent = "A useful route needs at least two comparable evidence stops.";
    el("repo-investigation-finding").textContent = "This view can show indexed paths, but it cannot produce a cross-file finding without inventing evidence.";
    el("repo-investigation-boundary").textContent = "Available path structure only.";
    el("repo-read-order").replaceChildren(Object.assign(document.createElement("p"), { className: "repo-map-empty", textContent: "No reading route can be supported without inventing evidence." }));
    return;
  }
  state.explorerInvestigation = investigation.id;
  el("repo-map-route-note").textContent = map.truncated
    ? `Choose one of ${investigations.length} questions across the partial tree. Each answer names its evidence boundary.`
    : `Choose one of ${investigations.length} evidence-backed questions. Each route turns repository structure into something specific to inspect.`;
  el("repo-investigation-tabs").replaceChildren(...investigations.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `repo-investigation-tab${item.id === investigation.id ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(item.id === investigation.id));
    button.append(
      Object.assign(document.createElement("span"), { textContent: String(index + 1).padStart(2, "0") }),
      Object.assign(document.createElement("strong"), { textContent: item.label || "Investigation" }),
      Object.assign(document.createElement("small"), { textContent: `${item.steps?.length || 0} stops` }),
    );
    button.addEventListener("click", () => {
      state.explorerInvestigation = item.id;
      const firstPath = item.steps?.[0]?.path;
      if (firstPath) selectRepositoryPath(data, firstPath);
      else renderRepositoryRoute(data);
    });
    return button;
  }));
  el("repo-investigation-question").textContent = investigation.question || "What can this repository teach a newcomer?";
  el("repo-investigation-why").textContent = investigation.why || "Follow the available evidence without filling the gaps.";
  el("repo-investigation-finding").textContent = investigation.finding || "The route is a reading suggestion, not a runtime trace.";
  el("repo-investigation-boundary").textContent = investigation.boundary || "Structural evidence only.";
  const route = investigation.steps || [];
  el("repo-read-order").replaceChildren(...route.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `repo-route-stop${item.path === state.explorerPath ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(item.path === state.explorerPath));
    const number = document.createElement("span"); number.className = "repo-route-number"; number.textContent = String(index + 1).padStart(2, "0");
    const body = document.createElement("span"); body.className = "repo-route-copy";
    const role = document.createElement("small"); role.textContent = item.role || categoryLabel(item.kind);
    const path = document.createElement("strong"); path.textContent = item.path;
    const prompt = document.createElement("em"); prompt.textContent = item.prompt || item.why || "Inspect this tracked clue before drawing a conclusion.";
    body.append(role, path, prompt);
    const guide = repositoryReadOrderItem(map, item.path)?.readingGuide;
    if (guide) {
      const signal = document.createElement("span"); signal.className = "repo-route-signal";
      const declarations = guide.facts?.find((fact) => /declaration/i.test(fact.label))?.value;
      const imports = guide.facts?.find((fact) => /import|dependenc/i.test(fact.label))?.value;
      signal.textContent = `${declarations || 0} signals · ${imports || 0} boundaries`;
      body.append(signal);
    }
    button.append(number, body);
    button.addEventListener("click", () => selectRepositoryPath(data, item.path));
    return button;
  }));
}

function refreshRepositoryInvestigations(data) {
  const map = data.repositoryMap;
  if (!map) return;
  map.investigations = buildReadingInvestigations(map.readOrder || []);
  if (state.data === data) renderRepositoryRoute(data);
}

function repositoryFilterEntries(map) {
  const query = state.explorerQuery.trim().toLowerCase();
  return (map?.entries || []).filter((entry) => {
    if (state.explorerFilter !== "all" && entry.category !== state.explorerFilter) return false;
    if (!query) return true;
    const order = repositoryReadOrderItem(map, entry.path);
    return `${entry.path} ${entry.role || ""} ${entry.category || ""} ${order?.role || ""} ${order?.why || ""}`.toLowerCase().includes(query);
  });
}

function renderRepositoryFilters(data) {
  const map = data.repositoryMap;
  const counts = new Map();
  for (const entry of map?.entries || []) counts.set(entry.category, (counts.get(entry.category) || 0) + 1);
  const preferred = ["all", "code", "documentation", "manifest", "test", "example", "config", "automation", "directory", "generated", "asset"];
  const categories = preferred.filter((category) => category === "all" || counts.get(category));
  el("repo-map-filters").replaceChildren(...categories.map((category) => {
    const button = document.createElement("button"); button.type = "button"; button.className = `repo-filter${state.explorerFilter === category ? " is-active" : ""}`; button.dataset.filter = category;
    button.setAttribute("aria-pressed", String(state.explorerFilter === category));
    button.append(document.createTextNode(categoryLabel(category)), Object.assign(document.createElement("span"), { textContent: String(category === "all" ? map?.entries?.length || 0 : counts.get(category) || 0) }));
    button.addEventListener("click", () => {
      state.explorerFilter = category;
      document.querySelectorAll(".repo-filter").forEach((item) => { const active = item.dataset.filter === category; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
      renderRepositoryList(data);
    });
    return button;
  }));
}

function renderRepositoryList(data) {
  const map = data.repositoryMap;
  const matches = repositoryFilterEntries(map);
  const visible = matches.slice(0, 80);
  el("repo-map-count").textContent = matches.length === (map?.entries?.length || 0)
    ? `${formatNumber(matches.length)} path${matches.length === 1 ? "" : "s"}`
    : `${formatNumber(matches.length)} match${matches.length === 1 ? "" : "es"}`;
  if (!matches.length) {
    el("repo-map-list").replaceChildren(Object.assign(document.createElement("p"), { className: "repo-map-empty", textContent: "No indexed path matches this reading filter. Try a broader file name or folder." }));
    return;
  }
  el("repo-map-list").replaceChildren(...visible.map((entry) => {
    const button = document.createElement("button"); button.type = "button"; button.className = `repo-entry${entry.path === state.explorerPath ? " is-active" : ""}`; button.setAttribute("aria-pressed", String(entry.path === state.explorerPath));
    const icon = document.createElement("span"); icon.className = `repo-entry-icon is-${entry.category}`; icon.textContent = entry.type === "directory" ? "▱" : "◇";
    const copy = document.createElement("span"); copy.className = "repo-entry-copy";
    const path = document.createElement("strong"); path.textContent = entry.path;
    const meta = document.createElement("small"); meta.textContent = entry.type === "directory" ? `${formatNumber(entry.count)} nested file${entry.count === 1 ? "" : "s"}` : `${categoryLabel(entry.category)} · ${formatFileSize(entry.size)}`;
    copy.append(path, meta); button.append(icon, copy);
    button.addEventListener("click", () => selectRepositoryPath(data, entry.path));
    return button;
  }));
  if (matches.length > visible.length) {
    const more = document.createElement("p"); more.className = "repo-map-more"; more.textContent = `Showing the first ${visible.length} of ${formatNumber(matches.length)} matches. Narrow the search to inspect the rest.`;
    el("repo-map-list").append(more);
  }
}

function repositoryLineJump(line) {
  const target = document.querySelector(`.repo-code-line[data-line="${Number(line) || 1}"]`);
  const pre = target?.closest(".repo-preview-code");
  if (!target || !pre) return;
  document.querySelectorAll(".repo-code-line.is-highlighted").forEach((item) => item.classList.remove("is-highlighted"));
  target.classList.add("is-highlighted");
  const targetTop = target.getBoundingClientRect().top - pre.getBoundingClientRect().top + pre.scrollTop;
  pre.scrollTop = Math.max(0, targetTop - (pre.clientHeight / 2) + (target.offsetHeight / 2));
  pre.focus({ preventScroll: true });
  window.setTimeout(() => target.classList.remove("is-highlighted"), 1600);
}

function repositoryReadingGuide(entry, guide) {
  if (!guide) return null;
  const section = document.createElement("section"); section.className = "repo-reading-guide"; section.setAttribute("aria-label", `Reading guide for ${entry.path}`);
  const top = document.createElement("div"); top.className = "repo-reading-guide-top";
  const heading = document.createElement("div");
  const kicker = document.createElement("p"); kicker.className = "repo-reading-guide-kicker"; kicker.textContent = `Reading lens · ${guide.language || "text"}${guide.mode ? ` · ${guide.mode}` : ""}`;
  const headline = document.createElement("strong"); headline.textContent = guide.headline || "A structural reading of this file.";
  heading.append(kicker, headline);
  const stamp = document.createElement("span"); stamp.className = "repo-reading-guide-stamp"; stamp.textContent = "Text scan";
  top.append(heading, stamp);
  const notice = document.createElement("p"); notice.className = "repo-reading-guide-notice"; notice.textContent = guide.notice || "Use the evidence below to choose where to begin.";
  const stats = document.createElement("div"); stats.className = "repo-reading-guide-stats";
  (guide.facts || []).forEach((fact) => {
    const item = document.createElement("span"); item.append(Object.assign(document.createElement("b"), { textContent: fact.value }), document.createTextNode(` ${fact.label}`)); stats.append(item);
  });
  const evidence = document.createElement("div"); evidence.className = "repo-reading-guide-evidence";
  const symbolsBlock = document.createElement("div"); symbolsBlock.className = "repo-guide-block";
  symbolsBlock.append(Object.assign(document.createElement("p"), { className: "repo-guide-label", textContent: "Where to begin" }));
  const symbolList = document.createElement("div"); symbolList.className = "repo-guide-symbols";
  (guide.symbols || []).slice(0, 6).forEach((symbol, index) => {
    const button = document.createElement("button"); button.type = "button"; button.dataset.codeLine = String(symbol.line || 1);
    button.classList.toggle("is-primary", index === 0);
    button.title = `${symbol.kind || "signal"} ${symbol.name || ""} · line ${symbol.line || 1}${symbol.signature ? `\n${symbol.signature}` : ""}`;
    button.append(Object.assign(document.createElement("span"), { className: "repo-guide-symbol-kind", textContent: symbol.kind || "signal" }), Object.assign(document.createElement("strong"), { textContent: symbol.name || "Unnamed signal" }), Object.assign(document.createElement("small"), { textContent: `L${symbol.line || 1}` }));
    button.addEventListener("click", () => repositoryLineJump(symbol.line));
    symbolList.append(button);
  });
  if (!symbolList.children.length) symbolList.append(Object.assign(document.createElement("span"), { className: "repo-guide-empty", textContent: "No named declaration was detected in this sample." }));
  symbolsBlock.append(symbolList);
  const importsBlock = document.createElement("div"); importsBlock.className = "repo-guide-block";
  const importLabel = guide.mode === "manifest" ? "Declared packages" : guide.mode === "document" ? "Document boundary" : "Borrowed surfaces";
  importsBlock.append(Object.assign(document.createElement("p"), { className: "repo-guide-label", textContent: importLabel }));
  const importList = document.createElement("div"); importList.className = "repo-guide-imports";
  (guide.imports || []).slice(0, 7).forEach((item) => {
    const button = document.createElement("button"); button.type = "button"; button.title = `Jump to line ${item.line || 1}${item.names?.length ? `\n${item.names.join(", ")}` : ""}`;
    button.append(Object.assign(document.createElement("span"), { textContent: item.source }), Object.assign(document.createElement("small"), { textContent: `L${item.line || 1}` }));
    button.addEventListener("click", () => repositoryLineJump(item.line));
    importList.append(button);
  });
  if (!importList.children.length) importList.append(Object.assign(document.createElement("span"), { className: "repo-guide-empty", textContent: guide.mode === "document" ? "Read the sections in order; this file does not declare imports." : "No import boundary was detected in this sample." }));
  importsBlock.append(importList);
  evidence.append(symbolsBlock, importsBlock);
  const boundary = document.createElement("p"); boundary.className = "repo-reading-guide-boundary"; boundary.textContent = guide.boundary || "Structural evidence only; the museum did not execute this file.";
  section.append(top, notice, stats, evidence, boundary);
  return section;
}

function repositoryPreviewShell(data, entry, guide = null) {
  const map = data.repositoryMap;
  const order = repositoryReadOrderItem(map, entry.path);
  const article = document.createElement("article"); article.className = "repo-preview-card";
  const header = document.createElement("div"); header.className = "repo-preview-header";
  const heading = document.createElement("div");
  const kicker = document.createElement("p"); kicker.className = "repo-preview-kicker"; kicker.textContent = order?.role || categoryLabel(entry.category);
  const title = document.createElement("h5"); title.textContent = entry.path;
  heading.append(kicker, title);
  const type = document.createElement("span"); type.className = "repo-preview-type"; type.textContent = entry.type === "directory" ? "FOLDER" : categoryLabel(entry.category).toUpperCase();
  header.append(heading, type);
  const why = document.createElement("p"); why.className = "repo-preview-why"; why.textContent = order?.why || (entry.type === "directory" ? "This folder is part of the indexed structure. Filtering by its path reveals the files inside." : "This tracked path appeared in the repository map; its specific role remains a conservative name-based reading.");
  const facts = document.createElement("div"); facts.className = "repo-preview-facts";
  const extensionLabel = entry.extension && entry.extension !== "(none)" ? entry.extension : "no extension";
  facts.append(Object.assign(document.createElement("span"), { textContent: entry.type === "directory" ? `${formatNumber(entry.count)} nested files` : formatFileSize(entry.size) }), Object.assign(document.createElement("span"), { textContent: entry.type === "directory" ? "directory" : extensionLabel }), Object.assign(document.createElement("span"), { textContent: map.truncated ? "partial tree" : "recursive tree" }));
  const content = document.createElement("div"); content.className = "repo-preview-content"; content.id = "repo-preview-content";
  const actions = document.createElement("div"); actions.className = "repo-preview-actions";
  if (/^https:\/\/github\.com\//.test(data.htmlUrl || "")) {
    const github = document.createElement("a"); github.href = evidenceHref(data, entry.path); github.target = "_blank"; github.rel = "noreferrer"; github.textContent = "Open source on GitHub ↗"; actions.append(github);
  } else {
    actions.append(Object.assign(document.createElement("span"), { className: "repo-preview-local", textContent: "Tracked local path · no public GitHub link" }));
  }
  const rawUrl = githubRawUrl(data, entry.path);
  if (rawUrl && entry.type === "file") { const raw = document.createElement("a"); raw.href = rawUrl; raw.target = "_blank"; raw.rel = "noreferrer"; raw.textContent = "View raw ↗"; actions.append(raw); }
  const readingGuide = entry.type === "file" ? repositoryReadingGuide(entry, guide) : null;
  article.append(header, why, facts);
  if (readingGuide) article.append(readingGuide);
  article.append(content, actions);
  return article;
}

function renderRepositoryPreview(data) {
  const container = el("repo-preview");
  const map = data.repositoryMap;
  if (!container || !map) return;
  const entry = repositoryMapEntry(map, state.explorerPath) || repositoryMapEntry(map, map.readOrder?.[0]?.path) || map.entries?.find((item) => item.type === "file") || map.entries?.[0];
  const status = el("repo-preview-status");
  if (!entry) {
    container.replaceChildren(Object.assign(document.createElement("p"), { className: "repo-map-empty", textContent: "No file metadata is available in this collection." }));
    if (status) status.textContent = "No file metadata is available in this collection.";
    return;
  }
  if (!state.explorerPath) state.explorerPath = entry.path;
  container.setAttribute("aria-busy", String(state.explorerPreviewState === "loading"));
  if (status) {
    if (entry.type === "directory") status.textContent = `Folder ${entry.path} selected with ${formatNumber(entry.count)} nested files.`;
    else if (state.explorerPreviewState === "loading") status.textContent = `Loading preview for ${entry.path}.`;
    else if (state.explorerPreviewState === "ready" && state.explorerPreview?.text) status.textContent = `Preview ready for ${entry.path}: ${formatNumber(state.explorerPreview.lines)} lines${state.explorerPreview.truncated ? ", shortened" : ""}.`;
    else if (state.explorerPreviewState === "error") status.textContent = `Preview failed for ${entry.path}. The source link is still available.`;
    else status.textContent = `A source preview is unavailable for ${entry.path}. The source link is still available.`;
  }
  const order = repositoryReadOrderItem(map, entry.path);
  const readyGuide = state.explorerPreviewState === "ready" && state.explorerPreview?.text
    ? (order?.readingGuide || state.explorerPreview.guide || buildReadingGuide(entry.path, state.explorerPreview.text, { truncated: state.explorerPreview.truncated }))
    : order?.readingGuide || null;
  const article = repositoryPreviewShell(data, entry, readyGuide);
  const content = article.querySelector(".repo-preview-content");
  if (entry.type === "directory") {
    const note = document.createElement("div"); note.className = "repo-preview-note";
    const title = document.createElement("strong"); title.textContent = "This is a room, not a readable file.";
    const copy = document.createElement("p"); copy.textContent = `The recursive index counts ${formatNumber(entry.count)} files beneath this folder. Use the folder search to narrow the atlas.`;
    const filter = document.createElement("button"); filter.type = "button"; filter.textContent = `Show ${entry.path}/ contents`;
    filter.addEventListener("click", () => { state.explorerFilter = "all"; state.explorerQuery = `${entry.path}/`; el("repo-map-search").value = state.explorerQuery; renderRepositoryFilters(data); renderRepositoryList(data); el("repo-map-search").focus(); });
    note.append(title, copy, filter); content.replaceChildren(note);
  } else if (state.explorerPreviewState === "loading") {
    const loading = document.createElement("div"); loading.className = "repo-preview-loading";
    for (let index = 0; index < 6; index += 1) loading.append(document.createElement("i"));
    content.replaceChildren(loading);
  } else if (state.explorerPreviewState === "fallback" || state.explorerPreviewState === "error") {
    const note = document.createElement("div"); note.className = "repo-preview-note";
    const title = document.createElement("strong"); title.textContent = state.explorerPreviewState === "error" ? "The preview could not be loaded." : "Open this file at the source.";
    const copy = document.createElement("p"); copy.textContent = state.explorerPreview?.message || "This file is outside the safe text-preview boundary.";
    note.append(title, copy); content.replaceChildren(note);
  } else if (state.explorerPreviewState === "ready" && state.explorerPreview?.text) {
    const pre = document.createElement("pre"); pre.className = "repo-preview-code"; pre.tabIndex = 0;
    const code = document.createElement("code");
    String(state.explorerPreview.text).split("\n").forEach((line, index) => {
      const row = document.createElement("span"); row.className = "repo-code-line"; row.dataset.line = String(index + 1); row.textContent = line || " "; code.append(row);
    });
    pre.append(code);
    const caption = document.createElement("p"); caption.className = "repo-preview-caption"; caption.textContent = `${formatNumber(state.explorerPreview.lines)} lines${state.explorerPreview.truncated ? " · preview shortened" : ""}${state.explorerPreview.embedded ? " · embedded by the local Agent" : ""}`;
    content.replaceChildren(pre, caption);
  } else {
    const note = document.createElement("div"); note.className = "repo-preview-note";
    note.append(Object.assign(document.createElement("strong"), { textContent: "A text preview can be read here." }), Object.assign(document.createElement("p"), { textContent: "Select this file again to load its readable contents, or open the GitHub source." }));
    content.replaceChildren(note);
  }
  container.replaceChildren(article);
}

function setRepositoryPreview(data, previewState, preview = null) {
  state.explorerPreviewState = previewState;
  state.explorerPreview = preview;
  if (state.data === data) renderRepositoryPreview(data);
}

async function loadRepositoryPreview(data, entry, requestId) {
  const order = repositoryReadOrderItem(data.repositoryMap, entry.path);
  const embedded = entry.preview || order?.preview;
  if (embedded) {
    const text = String(embedded).slice(0, 60_000);
    const truncated = String(embedded).length > text.length || Boolean(order?.previewTruncated);
    const guide = order?.readingGuide || buildReadingGuide(entry.path, text, { truncated });
    if (order && guide) order.readingGuide = guide;
    refreshRepositoryInvestigations(data);
    setRepositoryPreview(data, "ready", { text, lines: text.split("\n").length, truncated, embedded: true, guide });
    return;
  }
  const blocked = previewFallbackReason(entry);
  if (blocked) { setRepositoryPreview(data, "fallback", { message: blocked }); return; }
  const rawUrl = githubRawUrl(data, entry.path);
  if (!rawUrl) { setRepositoryPreview(data, "fallback", { message: "This collection does not expose a public GitHub raw URL. The tracked path is still available through the source link below." }); return; }
  state.explorerAbortController?.abort();
  const controller = new AbortController(); state.explorerAbortController = controller;
  try {
    const response = await fetch(rawUrl, { signal: controller.signal, headers: { Accept: "text/plain" } });
    if (!response.ok) throw new Error(`GitHub raw returned ${response.status}.`);
    const text = await response.text();
    if (looksBinaryText(text)) { setRepositoryPreview(data, "fallback", { message: "This file appears to contain binary content. Open it at the source instead." }); return; }
    if (requestId !== state.explorerRequestId || state.explorerPath !== entry.path) return;
    const shortened = text.slice(0, 60_000);
    const truncated = text.length > shortened.length;
    const guide = buildReadingGuide(entry.path, shortened, { truncated });
    if (order && guide) order.readingGuide = guide;
    refreshRepositoryInvestigations(data);
    setRepositoryPreview(data, "ready", { text: shortened, lines: shortened.split("\n").length, truncated, embedded: false, guide });
  } catch (error) {
    if (error.name === "AbortError" || requestId !== state.explorerRequestId) return;
    setRepositoryPreview(data, "error", { message: `${error.message || "GitHub raw did not respond."} The source link below still points to the tracked path.` });
  }
}

function selectRepositoryPath(data, path) {
  const entry = repositoryMapEntry(data.repositoryMap, path);
  if (!entry) return;
  state.explorerPath = entry.path;
  state.explorerPreview = null;
  state.explorerPreviewState = entry.type === "directory" ? "ready" : "loading";
  state.explorerRequestId += 1;
  const requestId = state.explorerRequestId;
  renderRepositoryRoute(data);
  renderRepositoryList(data);
  renderRepositoryPreview(data);
  if (entry.type !== "directory") loadRepositoryPreview(data, entry, requestId);
}

function renderRepositoryExplorer(data) {
  const explorer = el("repo-explorer");
  const map = data.repositoryMap;
  if (!explorer || !map?.entries?.length) { if (explorer) explorer.hidden = true; return; }
  explorer.hidden = false;
  el("repo-map-metrics").textContent = `${formatNumber(map.totalFiles)} files · ${formatNumber(map.totalDirectories)} folders · ${formatNumber(map.extensions?.length || 0)} extensions`;
  const partial = el("repo-map-partial");
  partial.hidden = !map.truncated;
  partial.textContent = map.truncated ? `Partial map: ${map.coverageNote || "GitHub stopped returning the recursive tree at its size limit."}` : "";
  const initialPath = state.explorerPath || map.readOrder?.[0]?.path || map.entries.find((entry) => entry.type === "file")?.path;
  const entryChanged = initialPath !== state.explorerPath;
  if (initialPath) state.explorerPath = initialPath;
  if (initialPath && entryChanged) {
    state.explorerPreview = null;
    state.explorerPreviewState = "loading";
  }
  renderRepositoryRoute(data);
  renderRepositoryFilters(data);
  renderRepositoryList(data);
  renderRepositoryPreview(data);
  if (initialPath && entryChanged) {
    state.explorerRequestId += 1;
    const entry = repositoryMapEntry(map, initialPath);
    if (entry?.type === "directory") state.explorerPreviewState = "ready";
    else if (entry) loadRepositoryPreview(data, entry, state.explorerRequestId);
  }
}

function renderHistoryPhaseDetail(data, phases) {
  const detail = el("history-phase-detail");
  if (!detail) return;
  const phase = phases[state.selectedHistory] || phases[0];
  if (!phase) {
    detail.replaceChildren(Object.assign(document.createElement("p"), { className: "empty-note", textContent: "No dated phase can be shown without inventing evidence." }));
    return;
  }
  const header = document.createElement("div"); header.className = "history-detail-header";
  const heading = document.createElement("div");
  const label = document.createElement("p"); label.className = "subsection-label"; label.textContent = `${phase.label || "Phase"} · ${phase.role || "record"}`;
  const title = document.createElement("h5"); title.textContent = phase.title || "A dated record";
  heading.append(label, title);
  const range = document.createElement("span"); range.className = "history-detail-range"; range.textContent = formatDayRange(phase.start, phase.end);
  header.append(heading, range);
  const summary = document.createElement("p"); summary.className = "history-detail-summary"; summary.textContent = phase.summary || "The archive records this phase without a longer narrative.";
  const facts = document.createElement("div"); facts.className = "history-detail-facts";
  if (phase.commitCount) { const item = document.createElement("span"); item.innerHTML = `<b>${phase.commitCount}</b> commit${phase.commitCount === 1 ? "" : "s"} grouped`; facts.append(item); }
  if (phase.reason) { const item = document.createElement("span"); item.textContent = phase.reason; facts.append(item); }
  const lesson = document.createElement("p"); lesson.className = "history-detail-lesson"; lesson.textContent = phase.lesson || "Treat this as an evidence-backed reading of the sampled record.";
  const trail = document.createElement("div"); trail.className = "history-detail-trail";
  (phase.evidence || []).forEach((item, index) => {
    const link = document.createElement("a"); link.href = sourceHref(data, item); link.target = "_blank"; link.rel = "noreferrer";
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("span");
    const ref = document.createElement("strong"); ref.textContent = item.label || item.ref || "Open evidence";
    const claim = document.createElement("small"); claim.textContent = item.claim || "This source supports the phase reading.";
    copy.append(ref, claim); link.append(number, copy, Object.assign(document.createElement("i"), { textContent: "↗" })); trail.append(link);
  });
  if (!trail.children.length) trail.append(Object.assign(document.createElement("span"), { className: "empty-note", textContent: "No direct evidence link was supplied for this phase." }));
  detail.replaceChildren(header, summary, facts, lesson, trail);
  if (phase.coverage) detail.append(Object.assign(document.createElement("p"), { className: "history-detail-coverage", textContent: phase.coverage }));
}

function renderHistoryTeaching(data) {
  const analysis = data.analysis || {};
  const phases = phaseList(data);
  el("history-summary").textContent = analysis.historySummary || "The history is a sequence of decisions that changed what the project could do.";
  el("history-arc").replaceChildren(...phases.slice(0, 3).map((chapter, index) => {
    const article = document.createElement("button"); article.type = "button"; article.className = `history-chapter${index === state.selectedHistory ? " is-selected" : ""}`; article.setAttribute("aria-pressed", String(index === state.selectedHistory));
    const top = document.createElement("div"); top.className = "history-chapter-top";
    const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
    const date = document.createElement("span"); date.className = "history-chapter-date"; date.textContent = formatDayRange(chapter.start, chapter.end);
    top.append(number, date);
    const label = document.createElement("p"); label.className = "story-label"; label.textContent = chapter.label || "Chapter";
    const title = document.createElement("h5"); title.textContent = chapter.title || "A chapter in the record";
    const summary = document.createElement("p"); summary.className = "history-chapter-summary"; summary.textContent = chapter.summary || "The archive records a change.";
    const evidence = document.createElement("div"); evidence.className = "history-evidence";
    if (chapter.commitCount) { const count = document.createElement("span"); count.className = "history-count"; count.textContent = `${chapter.commitCount} grouped`; evidence.append(count); }
    (chapter.evidence || []).slice(0, 2).forEach((item) => {
      const link = document.createElement("a"); link.href = sourceHref(data, item); link.target = "_blank"; link.rel = "noreferrer"; link.textContent = `${item.label || item.ref || "evidence"} ↗`; evidence.append(link);
    });
    article.append(top, label, title, summary, evidence); article.addEventListener("click", () => { state.selectedHistory = index; renderHistoryTeaching(data); }); return article;
  }));
  renderHistoryPhaseDetail(data, phases);
}

function compactLesson(value, fallback) {
  const text = String(value || fallback || "The archive is still being read.").replace(/\s+/g, " ").trim();
  return text.length > 190 ? `${text.slice(0, 187)}...` : text;
}

function buildExitQuestions(data) {
  const learning = data.learning || buildLearning(data);
  const roomTakeaway = (id, fallback) => learning.rooms?.find((room) => room.id === id)?.takeaway || fallback;
  const purpose = roomTakeaway("hall-overview", data.orientation?.oneLine || data.description);
  const path = roomTakeaway("hall-journey", data.journey?.summary || data.orientation?.how);
  const history = roomTakeaway("hall-history", data.analysis?.historySummary || data.analysis?.thesis);
  const optionsFor = (correct, alternatives, correctIndex) => {
    const unique = [correct, ...alternatives].filter((value, index, values) => value && values.indexOf(value) === index).slice(0, 3);
    while (unique.length < 3) unique.push("The public record does not support a stronger conclusion yet.");
    const ordered = correctIndex === 0 ? unique : correctIndex === 1 ? [unique[1], unique[0], unique[2]] : [unique[1], unique[2], unique[0]];
    return { options: ordered, correctIndex };
  };
  const purposeChoices = optionsFor(purpose, [path, history], 1);
  const pathChoices = optionsFor(path, [purpose, data.architecture?.summary || "The visible tree is the project's first blueprint."], 2);
  const historyChoices = optionsFor(history, [purpose, path], 0);
  return [
    { id: "purpose", roomId: "hall-overview", prompt: "What is this project for?", ...purposeChoices },
    { id: "path", roomId: "hall-journey", prompt: "What is the most useful first path to follow?", ...pathChoices },
    { id: "history", roomId: "hall-history", prompt: "Why does the project look this way now?", ...historyChoices },
  ];
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
  const questions = buildExitQuestions(data);
  const answers = state.exitAnswers || {};
  const score = questions.filter((question) => answers[question.id] === question.correctIndex).length;
  const quizComplete = score === questions.length;
  el("quiz-score").textContent = `${score} / ${questions.length} correct`;
  el("exit-quiz-list").replaceChildren(...questions.map((question, index) => {
    const selected = answers[question.id];
    const answered = Number.isInteger(selected);
    const isCorrect = answered && selected === question.correctIndex;
    const card = document.createElement("article"); card.className = `quiz-card${isCorrect ? " is-correct" : answered ? " is-review" : ""}`;
    const number = document.createElement("span"); number.className = "quiz-number"; number.textContent = String(index + 1).padStart(2, "0");
    const prompt = document.createElement("h6"); prompt.textContent = question.prompt;
    const options = document.createElement("div"); options.className = "quiz-options"; options.setAttribute("role", "group"); options.setAttribute("aria-label", question.prompt);
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button"); button.type = "button"; button.className = `quiz-option${selected === optionIndex ? " is-selected" : ""}${answered && optionIndex === question.correctIndex ? " is-answer" : ""}`; button.setAttribute("aria-pressed", String(selected === optionIndex));
      const marker = document.createElement("span"); marker.className = "quiz-option-marker"; marker.textContent = String.fromCharCode(65 + optionIndex);
      const copy = document.createElement("span"); copy.textContent = option;
      button.append(marker, copy); button.addEventListener("click", () => answerExitQuestion(question, optionIndex)); options.append(button);
    });
    const feedback = document.createElement("p"); feedback.className = "quiz-feedback"; feedback.textContent = !answered ? "Choose the sentence that belongs on the project map." : isCorrect ? "Correct. This is the conclusion the room asked you to carry forward." : "Read the room once more. The selected sentence is not the strongest evidence-backed reading.";
    card.append(number, prompt, options, feedback); return card;
  }));
  el("exit-stamp").textContent = complete && quizComplete ? "MAP COMPLETE" : quizComplete ? "REHEARSAL COMPLETE" : complete ? "MAP COMPLETE" : "REVIEW MAP";
  el("final-summary").textContent = quizComplete
    ? `Rehearsal complete: you can retell ${data.name} as purpose, path, and history${data.dependencies?.length ? ", with its ecosystem in view" : ""}.`
    : `${score} of ${questions.length} rehearsal answers are grounded. Keep going until the project can be explained without reopening the code.`;
}

function answerExitQuestion(question, optionIndex) {
  state.exitAnswers = { ...(state.exitAnswers || {}), [question.id]: optionIndex };
  if (optionIndex === question.correctIndex) state.understoodRooms.add(question.roomId);
  updateLearningControls();
  renderExit(state.data);
  const score = buildExitQuestions(state.data).filter((item) => state.exitAnswers[item.id] === item.correctIndex).length;
  showToast(optionIndex === question.correctIndex ? `Correct · ${score}/3 rehearsal answers` : "Keep reading the evidence and try again.");
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
  document.querySelectorAll(".room-guide").forEach((block) => block.remove());
  document.querySelectorAll(".room-discovery").forEach((block) => block.remove());
  rooms.forEach((room) => {
    const panel = document.getElementById(room.id);
    if (!panel) return;
    const guide = document.createElement("div"); guide.className = "room-guide";
    const guideMeta = document.createElement("div"); guideMeta.className = "room-guide-meta";
    const guideLabel = document.createElement("span"); guideLabel.textContent = room.interaction ? `${room.interaction} station` : "curator's prompt";
    const guideMode = document.createElement("span"); guideMode.textContent = room.mode === "inferred" ? "inferred" : room.mode === "mixed" ? "observed + inferred" : "observed";
    guideMeta.append(guideLabel, guideMode);
    const scene = document.createElement("p"); scene.className = "room-guide-scene"; scene.textContent = room.scene || room.question || "Begin with the visitor's question.";
    const plain = document.createElement("p"); plain.className = "room-guide-plain"; plain.textContent = room.plain || room.takeaway || "The archive is still being read.";
    const details = document.createElement("details"); details.className = "room-guide-details";
    const summary = document.createElement("summary"); summary.textContent = "Reveal the technical reading";
    const reveal = document.createElement("p"); reveal.textContent = room.reveal || room.whyItMatters || "Open the evidence to inspect the reading.";
    details.append(summary, reveal);
    guide.append(guideMeta, scene, plain, details);
    panel.querySelector(".panel-heading")?.after(guide);
    const discovery = document.createElement("div"); discovery.className = "room-discovery";
    const discoveryLabel = document.createElement("p"); discoveryLabel.textContent = "What this room revealed";
    const discoveryCopy = document.createElement("strong"); discoveryCopy.textContent = room.discovery || roomDiscoveryFallback(data, room);
    const trail = document.createElement("div"); trail.className = "discovery-trail";
    (room.evidenceTrail || roomEvidenceTrail(data, room)).slice(0, 4).forEach((item, index) => {
      const link = document.createElement("a"); link.href = sourceHref(data, item); link.target = "_blank"; link.rel = "noreferrer";
      const number = document.createElement("span"); number.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("span");
      const ref = document.createElement("strong"); ref.textContent = item.label || item.ref || "Open evidence";
      const claim = document.createElement("small"); claim.textContent = item.claim || "This source supports the discovery above.";
      copy.append(ref, claim); link.append(number, copy, Object.assign(document.createElement("i"), { "aria-hidden": "true", textContent: "↗" })); trail.append(link);
    });
    if (!trail.children.length) trail.append(Object.assign(document.createElement("span"), { className: "empty-note", textContent: "No direct evidence link was supplied for this room." }));
    discovery.append(discoveryLabel, discoveryCopy, trail);
    guide.after(discovery);
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
    discovery.after(block);
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
  if (!allRooms.some((room) => room.id === state.currentRoom)) state.currentRoom = allRooms[0]?.id || "hall-overview";
  updateVisitProgress(state.currentRoom);
  applyTourMode();
  updateLearningControls();
}

function updateSpaceNavigation() {
  const rooms = state.rooms || [];
  const index = rooms.findIndex((room) => room.id === state.currentRoom);
  const previous = el("previous-room");
  const next = el("next-room");
  if (previous) previous.disabled = index <= 0;
  if (next) next.disabled = index < 0 || index >= rooms.length - 1;
}

function roomStep(delta) {
  const rooms = state.rooms || [];
  const currentIndex = rooms.findIndex((room) => room.id === state.currentRoom);
  const target = rooms[currentIndex + delta]?.id;
  if (target) navigateToRoom(target);
}

function playRoomChime(fromIndex, toIndex) {
  if (state.isMuted) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  state.audioContext ||= new AudioContextClass();
  if (state.audioContext.state === "suspended") state.audioContext.resume().catch(() => {});
  const now = state.audioContext.currentTime;
  const rising = toIndex >= fromIndex;
  [0, 1].forEach((offset) => {
    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    const start = now + offset * 0.085;
    oscillator.type = offset ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime((rising ? 392 : 523) + offset * 98, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.018, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
    oscillator.connect(gain).connect(state.audioContext.destination);
    oscillator.start(start); oscillator.stop(start + 0.24);
  });
}

function holdNavigationProgress() {
  state.navigationLockUntil = performance.now() + 700;
}

function setRoomTarget(target) {
  const panel = document.getElementById(target);
  if (!panel) return;
  state.currentRoom = target;
  holdNavigationProgress();
  applyTourMode();
  updateVisitProgress(target);
  panel.scrollIntoView({ behavior: "auto", block: "start" });
}

function navigateToRoom(target) {
  const panel = document.getElementById(target);
  if (!panel || panel.hidden) return;
  if (target === state.currentRoom) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const rooms = state.rooms || [];
  const fromIndex = rooms.findIndex((room) => room.id === state.currentRoom);
  const toIndex = rooms.findIndex((room) => room.id === target);
  holdNavigationProgress();
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    setRoomTarget(target);
    return;
  }
  window.clearTimeout(state.transitionTimer);
  window.clearTimeout(state.transitionHideTimer);
  const overlay = el("room-transition");
  const fromRoom = rooms[fromIndex] || rooms[0];
  const toRoom = rooms[toIndex] || { id: target, label: panel.querySelector("h4")?.textContent || "the next room" };
  el("room-transition-kicker").textContent = `Leaving ${fromRoom?.label || "the foyer"}`;
  el("room-transition-title").textContent = `Entering ${String(toRoom.label || "the next room").toLowerCase()}`;
  el("room-transition-note").textContent = roomDefinition(state.data, target)?.question || "Following the evidence into the next room";
  el("room-transition-index").textContent = String(Math.max(0, toIndex) + 1).padStart(2, "0");
  if (overlay) {
    overlay.classList.remove("is-visible");
    void overlay.offsetWidth;
    overlay.classList.add("is-visible");
  }
  playRoomChime(Math.max(0, fromIndex), Math.max(0, toIndex));
  state.transitionTimer = window.setTimeout(() => {
    setRoomTarget(target);
    state.transitionHideTimer = window.setTimeout(() => overlay?.classList.remove("is-visible"), 170);
  }, 230);
}

function applyTourMode() {
  const panels = document.querySelector(".exhibition-panels");
  if (!panels) return;
  panels.classList.toggle("guided-mode", state.tourMode === "guided");
  panels.classList.toggle("map-mode", state.tourMode === "map");
  document.querySelectorAll(".exhibition-panels .panel").forEach((panel) => panel.classList.toggle("is-current", panel.id === state.currentRoom));
  document.querySelectorAll(".mode-button").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === state.tourMode));
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
  updateSpaceNavigation();
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
    const node = document.createElement("button"); node.type = "button"; node.className = `aquarium-node${index === state.selectedDependency ? " is-selected" : ""}`; node.dataset.index = String(index); node.style.left = `${left}%`; node.style.top = `${top}%`; node.setAttribute("aria-pressed", String(index === state.selectedDependency));
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const version = document.createElement("small"); version.textContent = dependency.version || "direct";
    node.append(name, version); node.addEventListener("click", () => { state.selectedDependency = index; renderAquarium(data); }); stage.append(node);
    const link = document.createElement("i"); link.className = "aquarium-link"; const x1 = 50; const y1 = 50; const x2 = left + 5; const y2 = top + 5; const dx = x2 - x1; const dy = y2 - y1;
    link.style.left = `${x1}%`; link.style.top = `${y1}%`; link.style.width = `${Math.sqrt(dx * dx + dy * dy)}%`; link.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`; stage.prepend(link);
  });
  list.replaceChildren(...dependencies.slice(0, 6).map((dependency) => {
    const item = document.createElement("a"); item.className = "dependency-item"; item.href = `${data.htmlUrl}/blob/${data.defaultBranch || "main"}/${dependency.sourcePath || data.manifestPath || "package.json"}`; item.target = "_blank"; item.rel = "noreferrer";
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const detail = document.createElement("span"); detail.textContent = `${dependency.version || "direct"} · ${dependency.type || "runtime"}`;
    item.append(name, detail); return item;
  }));
  renderDependencySpotlight(data, dependencies);
}

function dependencyCapability(name, type) {
  const value = (name || "").toLowerCase();
  if (/rollup|esbuild|webpack|parcel|swc|babel/.test(value)) return "Builds or transforms project files.";
  if (/chokidar|watch/.test(value)) return "Watches the file system for changes.";
  if (/postcss|sass|less|css/.test(value)) return "Processes styles before they reach the browser.";
  if (/react|vue|svelte|solid/.test(value)) return "Provides the application framework surface.";
  if (/eslint|prettier|lint|test|vitest|jest/.test(value)) return "Checks or formats the project during development.";
  return type === "build" ? "Supports the project's build-time workflow." : "Provides a capability the repository does not implement alone.";
}

function renderDependencySpotlight(data, dependencies = data.dependencies || []) {
  const dependency = dependencies[state.selectedDependency] || dependencies[0];
  if (!dependency) return;
  el("dependency-spotlight-title").textContent = dependency.name;
  el("dependency-spotlight-copy").textContent = `${dependencyCapability(dependency.name, dependency.type)} The visible version is ${dependency.version || "declared directly"}.`;
  el("dependency-spotlight-source").href = `${data.htmlUrl}/blob/${data.defaultBranch || "main"}/${dependency.sourcePath || data.manifestPath || "package.json"}`;
}

function renderScore(data) {
  const commits = data.commits?.length ? data.commits : demoData.commits;
  const bars = el("score-bars"); const dates = el("score-dates");
  bars.replaceChildren(...commits.map((commit, index) => { const bar = document.createElement("i"); bar.className = "score-bar"; bar.style.setProperty("--height", `${Math.max(8, commit.score)}%`); bar.style.setProperty("--delay", `${index * 70}ms`); bar.title = `${commit.sha} · ${commit.date}`; return bar; }));
  dates.replaceChildren(...commits.map((commit) => { const date = document.createElement("span"); date.textContent = commit.date; return date; }));
}

function render(data) {
  if (!data.learning) data.learning = buildLearning(data);
  const isNewCollection = state.data !== data || state.currentRepo !== data.repo;
  if (isNewCollection) resetRepositoryExplorer();
  state.data = data;
  state.currentRepo = data.repo;
  state.visitedRooms = new Set(["hall-overview"]);
  state.understoodRooms = new Set();
  state.currentRoom = "hall-overview";
  state.selectedJourneyStep = 0;
  state.selectedArchitecture = 0;
  state.selectedHistory = 0;
  state.selectedDependency = 0;
  state.exitAnswers = {};
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
  renderStats(data); renderAvatars(data); renderTimeline(data); renderAquarium(data); renderScore(data); renderAnalysis(data); renderOrientation(data); renderJourney(data); renderArchitecture(data); renderMachineMap(data); renderRepositoryExplorer(data); renderHistoryTeaching(data); renderLearning(data); renderExit(data); renderVisitMap(data);
  el("score-caption").textContent = `Commit pulse / ${data.commits?.length || 0} markers`;
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
    render(data); showContent(); document.title = `${data.name} · Repo Museum`;
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
    render(data); showContent(); document.title = `${data.name} · Repo Museum`;
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
  state.mode = "demo"; state.artifactPath = null; render(demoData); showContent(); el("repo-input").value = demoData.repo; history.replaceState({}, "", window.location.pathname); document.title = "Repo Museum - an exhibition for every repository";
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
  el("repo-map-search").addEventListener("input", (event) => { state.explorerQuery = event.target.value; renderRepositoryList(state.data); });
  el("repo-map-search").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const first = el("repo-map-list").querySelector(".repo-entry");
    if (first) first.click();
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".understand-button");
    if (button) toggleRoomUnderstanding(button.dataset.room);
  });
  el("demo-button").addEventListener("click", openDemo); el("error-demo-button").addEventListener("click", openDemo);
  el("random-button").addEventListener("click", () => { const repos = ["sindresorhus/ky", "tailwindlabs/tailwindcss", "denoland/deno", "pallets/flask", "rust-lang/rustlings"]; const repo = repos[Math.floor(Math.random() * repos.length)]; el("repo-input").value = repo; loadRepo(repo); });
  document.querySelectorAll(".index-item").forEach((button) => button.addEventListener("click", () => navigateToRoom(button.dataset.target)));
  document.querySelectorAll(".room-next, .room-back").forEach((button) => button.addEventListener("click", () => navigateToRoom(button.dataset.next)));
  el("previous-room").addEventListener("click", () => roomStep(-1));
  el("next-room").addEventListener("click", () => roomStep(1));
  document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    state.tourMode = mode;
    applyTourMode();
    el("floor-plan").hidden = mode !== "map";
    if (mode === "map") el("floor-plan").scrollIntoView({ behavior: "smooth", block: "nearest" });
    else document.getElementById(state.currentRoom)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  document.querySelectorAll("[data-foyer-view]").forEach((button) => button.addEventListener("click", () => { state.foyerView = button.dataset.foyerView; updateFoyerReveal(state.data); }));
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
      // Programmatic room changes scroll past intermediate panels. Do not let
      // those in-flight intersections overwrite the room the visitor selected.
      if (performance.now() < state.navigationLockUntil) return;
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
