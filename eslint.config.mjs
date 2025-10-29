import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".versionrc.js",
    "scripts/**",
    "changelogs/**",
    "commitlint.config.js",
    "postcss.config.mjs",
    "tailwind.config.mjs",
    "tsconfig.json",
    "next.config.ts",
  ]),
]);

export default eslintConfig;
