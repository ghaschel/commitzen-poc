import { execSync } from "child_process";

import versionrc from "../.versionrc.js";

const { infile } = versionrc;

const changelogPath = path.resolve(infile);

const changelogsDir = path.resolve("changelogs");

// --- Stage files and amend the release commit ---
try {
  execSync(`git add ${changelogsDir} ${changelogPath}`);
  console.log(`✅ Staged split changelog files for release commit.`);

  // Amend the commit to include the changelog files without changing the message
  execSync(`git commit --amend --no-edit`, { stdio: "inherit" });
  console.log(`✅ Amended release commit to include split changelog files.`);
} catch (err) {
  console.error("⚠️  Failed to amsend commit:", err.message);
}
