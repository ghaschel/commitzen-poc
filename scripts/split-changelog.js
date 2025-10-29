const fs = require("fs");
const path = require("path");
const versionrc = require("../.versionrc.js");

const { infile, header } = versionrc;

const changelogPath = path.resolve(infile);
const changelogsDir = path.resolve("changelogs");

if (!fs.existsSync(changelogsDir)) fs.mkdirSync(changelogsDir);

const content = fs.existsSync(changelogPath)
  ? fs.readFileSync(changelogPath, "utf8")
  : "";

if (!content.trim()) {
  console.warn(`⚠️  ${infile} is empty or missing.`);
  process.exit(0);
}

// Grab the first version section including everything after it until "# Changelog Index" or EOF
const versionSectionRegex =
  /^(#{2,3}\s*\[?v?(\d+\.\d+\.\d+)\]?.*?\(\d{4}-\d{2}-\d{2}\))([\s\S]*?)(?=\n# Changelog Index|\Z)/m;
const match = versionSectionRegex.exec(content);

if (!match) {
  console.warn("⚠️  No version section found in changelog.");
  process.exit(0);
}

const version = match[2];
const sectionContent = `${header}${match[0].trim()}`;

// write the full section to a version file
const versionFile = path.join(changelogsDir, `${version}.md`);
fs.writeFileSync(versionFile, sectionContent + "\n", "utf8");

// rebuild index
const files = fs.readdirSync(changelogsDir).filter((f) => f.endsWith(".md"));

function readDate(filePath) {
  const txt = fs.readFileSync(filePath, "utf8");
  const m = txt.match(
    /#{2,3}\s*\[?v?(\d+\.\d+\.\d+)\]?.*?\((\d{4}-\d{2}-\d{2})\)/i
  );
  return m ? m[2] : "";
}

const versions = files
  .map((f) => {
    const ver = f.replace(".md", "");
    const date = readDate(path.join(changelogsDir, f));
    return { ver, date };
  })
  .sort((a, b) => b.ver.localeCompare(a.ver, undefined, { numeric: true }));

const links = versions
  .map((v) =>
    v.date
      ? `- [${v.ver}](./changelogs/${v.ver}.md) — ${v.date}`
      : `- [${v.ver}](./changelogs/${v.ver}.md)`
  )
  .join("\n");

const newIndex = `# Changelog Index\n\n${links}\n`;
fs.writeFileSync(changelogPath, newIndex, "utf8");

console.log(
  `✅ Extracted full changelog for ${version} → changelogs/${version}.md and updated index.`
);
