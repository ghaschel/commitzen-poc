import { execSync } from "child_process";

// --- Stage files and amend the release commit ---
try {
  execSync(`git add .`);
  console.log(`✅ Staged split changelog files for release commit.`);

  // Amend the commit to include the changelog files without changing the message
  execSync(`git commit --amend --no-edit`, { stdio: "inherit" });
  console.log(`✅ Amended release commit to include split changelog files.`);
} catch (err) {
  console.error("⚠️  Failed to amsend commit:", err.message);
}
