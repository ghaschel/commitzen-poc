const fs = require("fs");
const path = require("path");

const changelogPath = path.resolve("CHANGELOG.md");
const changelogsDir = path.resolve("changelogs");

if (!fs.existsSync(changelogsDir)) fs.mkdirSync(changelogsDir);

const content = fs.readFileSync(changelogPath, "utf8");

// match the latest version section (from standard-version output)
const versionMatch = content.match(
  /#{2,3}\s*\[?v?([\d.]+)\]?.*?(\d{4}-\d{2}-\d{2})/im
);

if (!versionMatch) {
  console.warn("⚠️  No version section found in changelog.");
  process.exit(0);
}

const [_, version] = versionMatch;
const versionFile = path.join(changelogsDir, `${version}.md`);

// save full changelog contents to versioned file
fs.writeFileSync(versionFile, content.trim(), "utf8");

// read existing changelog index (if any)
let indexContent = "";
if (fs.existsSync(changelogPath)) {
  indexContent = fs.readFileSync(changelogPath, "utf8");
}

// rebuild index links from files in changelogs folder
const versions = fs
  .readdirSync(changelogsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(".md", ""))
  .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

const links = versions.map((v) => `- [${v}](./changelogs/${v}.md)`).join("\n");

// overwrite CHANGELOG.md with index
const newIndex = `# Changelog Index\n\n${links}\n`;
fs.writeFileSync(changelogPath, newIndex, "utf8");

console.log(`✅ Created changelogs/${version}.md and updated CHANGELOG index.`);
