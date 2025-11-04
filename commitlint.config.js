module.exports = {
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
  // ✅ cz-git configuration
  prompt: {
    messages: {
      type: "Yo! What kinda change we makin'?",
      subject: "Hit me with a quick summary:",
      body: "Add some extra deets (optional):",
      breaking: "BREAKIN' things? Tell me:",
      footer:
        'Any issues to close? (enter refs like "LINEAR-123" or just press enter to skip):',
    },
    types: [
      { value: "feat", name: "✨ feat: A new feature" },
      { value: "fix", name: "🐞 fix: A bug fix" },
      { value: "docs", name: "📝 docs: Documentation only changes" },
      { value: "style", name: "💅 style: Code style / formatting only" },
      {
        value: "refactor",
        name: "♻️ refactor: Code change that isn't a fix or a feature",
      },
      { value: "perf", name: "⚡ perf: Performance improvement" },
      { value: "test", name: "✅ test: Adding or correcting tests" },
      { value: "build", name: "📦 build: Build system changes" },
      { value: "ci", name: "🔧 ci: CI configuration changes" },
      {
        value: "chore",
        name: "🧹 chore: Build process or auxiliary tool changes",
      },
      { value: "revert", name: "⏪ revert: Revert a previous commit" },
      { value: "improvement", name: "🚀 improvement: An improvement" },
    ],
    skipQuestions: ["scope", "footerPrefix", "confirmCommit"],
    allowBreakingChanges: ["feat", "fix"],
    useEmoji: false,
    maxHeaderLength: 100,
    maxSubjectLength: 100,
    // Disable preview and confirmation entirely
    skipEmptyScopes: true,
    enableMultipleScopes: false,
    confirmColorize: false,
    confirmCommit: false,
  },
};
