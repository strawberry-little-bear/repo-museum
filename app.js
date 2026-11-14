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
    const key = assignment[1] || assignment[2] || assignment[3];
    let value = assignment[4];
    while (!tomlValueComplete(value) && index + 1 < lines.length) {
      index += 1;
      value += `\n${lines[index]}`;
    }
    records.push({ section, key, value: value.trim() });
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
  if (section === "tool.poetry.dependencies") return "runtime";
  if (section === "tool.poetry.dev-dependencies") return "build";
  if (section.startsWith("tool.poetry.group.") && section.endsWith(".dependencies")) return "build";
  return null;
}

function parseTomlDependencies(contents, path) {
  const entries = [];
  for (const { section, key, value } of tomlAssignmentRecords(contents)) {
    const kind = dependencySectionKind(path, section, key);
    if (!kind) continue;
    if (path === "Cargo.toml") {
      const nested = section.match(/^(?:dev-|build-)?dependencies\.(.+)$/);
      if (nested) {
        const version = key === "workspace" ? "workspace" : (tomlStringValue(value) || "declared");
        entries.push({ name: nested[1], version, type: kind, sourcePath: path });
        continue;
      }
      if (key.endsWith(".workspace")) {
        entries.push({ name: key.slice(0, -".workspace".length), version: "workspace", type: kind, sourcePath: path });
        continue;
      }
      const version = tomlStringValue(value) || value.match(/(?:^|[,{]\s*)version\s*=\s*["']([^"']+)/)?.[1] || "declared";
      entries.push({ name: key, version, type: kind, sourcePath: path });
      continue;
    }
    for (const spec of stringsInTomlValue(value)) {
      const dependency = splitDependencySpec(spec);
      if (dependency) entries.push({ ...dependency, type: kind, sourcePath: path });
    }
  }
  return entries;
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

function buildArchitecture(tree = [], manifestPath, readmeText, repository) {
  const folderCounts = new Map();
  for (const path of tree.filter((item) => item.includes("/"))) {
    const folder = path.split("/")[0];
    if (!GENERATED_FOLDERS.has(folder.toLowerCase())) folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
  }
  const folders = [...folderCounts].map(([name, fileCount]) => ({ name, role: inferRole(name, true), evidence: name, fileCount }))
    .sort((left, right) => folderPriority(left.name) - folderPriority(right.name) || right.fileCount - left.fileCount || left.name.localeCompare(right.name)).slice(0, 10);
  const rootFiles = tree.filter((item) => !item.includes("/"));
  const readmePath = rootFiles.find((item) => item.toLowerCase().startsWith("readme")) || (readmeText ? "README.md" : "");
  const entryPattern = /^(main|app|cli|server|index|__main__|manage|bin)(\.|$)/i;
  const entryCandidates = rootFiles.filter((item) => entryPattern.test(item));
  entryCandidates.push(...rootFiles.filter((item) => /\.(?:py|js|mjs|cjs|ts|tsx|rs|go|rb|java|html)$/.test(item) && !entryCandidates.includes(item)));
  const configCandidates = rootFiles.filter((item) => /workspace|config|lock|test|spec/i.test(item));
  const interesting = [...new Set([readmePath, manifestPath, ...entryCandidates.slice(0, 4), ...configCandidates.slice(0, 4)].filter(Boolean))];
  const files = interesting.slice(0, 10).map((name) => ({ name, role: inferRole(name), evidence: name }));
  const entrypoints = entryCandidates.slice(0, 3).length ? entryCandidates.slice(0, 3) : [manifestPath || readmePath || "README.md"].filter(Boolean);
  if (!folders.length && !files.length) return demoData.architecture;
  const workingFolders = folders.filter((item) => !isSupportFolder(item.name));
  const sourceFiles = files.filter((item) => /source file|application script|application entry point|document entry point|presentation layer|server or request surface/i.test(item.role)).slice(0, 2);
  const leadingPaths = [...new Set([...sourceFiles.map((item) => item.name), ...workingFolders.slice(0, 3).map((item) => item.name)])];
  const summary = leadingPaths.length
    ? `${repository.language || "Mixed stack"} project whose visible working paths lead through ${naturalList(leadingPaths)}.`
    : `${repository.language || "Mixed stack"} project whose work is visible mainly through its tracked files.`;
  const mainFolder = workingFolders.find((item) => IMPLEMENTATION_FOLDERS.has(item.name.toLowerCase()));
  const resultFolder = workingFolders.find((item) => LEARNING_FOLDERS.has(item.name.toLowerCase()));
  return {
    summary,
    flow: [
      { label: "Person or caller", role: "Where the request begins", detail: "A user, command, or another system gives the project something to do.", evidence: readmePath || manifestPath || "README.md" },
      { label: "Entry point", role: "The front door", detail: "A tracked source file or command surface is the clearest visible boundary into the project.", evidence: entrypoints[0] || manifestPath || readmePath || "README.md" },
      { label: "Main implementation", role: "Where the work happens", detail: "The most legible implementation-named area coordinates the project's main behavior.", evidence: mainFolder?.evidence || entrypoints[0] || readmePath || "README.md" },
      { label: "Supporting tools", role: "Capabilities the project borrows", detail: "Dependencies and configuration fill in the parts the repository does not build alone.", evidence: manifestPath || files[0]?.name || readmePath || "README.md" },
      { label: "Result", role: "What comes back", detail: "Documentation, examples, tests, or the public description show the project's output.", evidence: resultFolder?.evidence || readmePath || manifestPath || "README.md" },
    ],
    folders,
    files,
    entrypoints,
    sourceNote: "Roles are inferred from tracked names and paths; each item links back to the file or directory that supports the reading.",
  };
}

function clipSentence(value, limit = 210) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const sentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || text;
  return sentence.length > limit ? `${sentence.slice(0, limit - 1).trim()}…` : sentence;
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

function buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText = "", tree = [], historyMeta = {}) {
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
    architecture: buildArchitecture(tree, manifestPath, readmeText, repository),
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
  const [repository, commitPage, releases, contributors, languages, readmeResponse, tree] = await Promise.all([
    githubFetch(`/repos/${repo}`),
    githubFetchPage(`/repos/${repo}/commits?per_page=100`),
    githubFetch(`/repos/${repo}/releases?per_page=8`),
    githubFetch(`/repos/${repo}/contributors?per_page=6`),
    githubFetch(`/repos/${repo}/languages`),
    githubFetch(`/repos/${repo}/readme`).catch(() => null),
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
  const visibleRootFiles = new Set(Array.isArray(tree) ? tree.map((item) => item?.name).filter(Boolean) : []);
  const manifests = Array.isArray(tree)
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
  const treeItems = Array.isArray(tree) ? tree.map((item) => item.type === "dir" ? `${item.name}/.directory` : item.name).filter(Boolean) : [];
  return buildLiveData(repo, repository, commits, releases, contributors, languages, dependencies, manifestPath, readmeText, treeItems, { coverage });
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
  renderStats(data); renderAvatars(data); renderTimeline(data); renderAquarium(data); renderScore(data); renderAnalysis(data); renderOrientation(data); renderJourney(data); renderArchitecture(data); renderMachineMap(data); renderHistoryTeaching(data); renderLearning(data); renderExit(data); renderVisitMap(data);
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
