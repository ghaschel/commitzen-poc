module.exports = {
  skip: { tag: false },
  infile: "CHANGELOG.md",
  header: "# Changelog\n\n",
  scripts: {
    postchangelog: "node scripts/split-changelog.mjs",
  },
  issuePrefixes: ["INSE-"],
  issueUrlFormat: "https://linear.app/ae-studio/issue/{{prefix}}{{id}}",
};
