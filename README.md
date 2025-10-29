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

add this script to package.json:

```json
"scripts": {
  "release": "standard-version"
}
```

run this command to create the changelog folder structure:

```bash
mkdir changelogs
```

run `npx husky init` to initialize husky and add any relevant hooks.
