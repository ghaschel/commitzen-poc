### How to implement

Install the following dependency globally:

```bash
npm install -g commitizen
```

Install the following dependencies:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional cz-conventional-changelog eslint husky prettier standard-version
```

Run this command to initialize commitizen:

```bash
commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact
```

Create commitlint.config.js and add this:

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "improvement",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
};
```

create .versionrc.js and add this:

```js
const path = require("path");

module.exports = {
  skip: { tag: false },
  infile: "CHANGELOG.md",
  header: "# Changelog\n\n",
  scripts: {
    postchangelog: "node scripts/split-changelog.js",
  },
};
```

create `scripts/split-changelog.js` and add this:

```js
const fs = require("fs");
const path = require("path");
const versionrc = require("../.versionrc.js");
const { execSync } = require("child_process");

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

try {
  // stage the new version file
  execSync(`git add ${versionFile}`);

  // amend into the current commit (no message change)
  execSync(`git commit --amend --no-edit`);

  console.log(`✅ Amended changelog ${versionFile} into the current commit`);
} catch (err) {
  console.error("⚠️  Failed to amend changelog into commit:", err.message);
}
```

add this script to package.json:

```json
"scripts": {
  "release": "standard-version",
  "push": "git push --follow-tags"
}
```

run this command to create the changelog folder structure:

```bash
mkdir changelogs
```

run `npx husky init` to initialize husky and add any relevant hooks.
