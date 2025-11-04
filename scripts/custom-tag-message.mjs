import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { remark } from "remark";
import remarkParse from "remark-parse";

// Get the current version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
);
const version = packageJson.version;

// Read the changelog for this version
const changelogFile = path.resolve(`changelogs/${version}.md`);

if (!fs.existsSync(changelogFile)) {
  console.warn(`⚠️  Changelog file not found: ${changelogFile}`);
  process.exit(0);
}

const changelogContent = fs.readFileSync(changelogFile, "utf8");

// Extract plain text from markdown AST
const extractText = (node) => {
  if (node.type === "text") {
    return node.value;
  }

  if (node.children) {
    return node.children.map(extractText).join("");
  }

  return "";
};

const mdastToPlainText = (markdown) => {
  const tree = remark().use(remarkParse).parse(markdown);

  const lines = [];

  for (const node of tree.children) {
    if (node.type === "heading") {
      const text = extractText(node);
      lines.push("\n" + text + "\n");
    } else if (node.type === "paragraph") {
      const text = extractText(node);
      lines.push(text);
    } else if (node.type === "list") {
      for (const item of node.children) {
        const text = extractText(item);
        lines.push("- " + text.trim());
      }
    } else if (node.type === "code" || node.type === "blockquote") {
      const text = extractText(node);
      lines.push(text);
    }
  }

  return lines.join("\n").trim();
};

const plainText = mdastToPlainText(changelogContent);

// Build the tag message
const tagMessage = `chore(release): v${version}

# Changelog

${plainText.trim()}`;

// Delete the existing tag and recreate it with the custom message
const tagName = `v${version}`;

try {
  // Write message to temp file to handle multiline properly
  const tempFile = path.resolve(".git", "TAG_MESSAGE");
  fs.writeFileSync(tempFile, tagMessage, "utf8");

  // Delete the tag locally
  execSync(`git tag -d ${tagName}`, { stdio: "ignore" });

  // Create a new annotated tag with the custom message from file
  execSync(`git tag -a ${tagName} -F "${tempFile}" HEAD`, {
    stdio: "inherit",
  });

  // Clean up temp file
  fs.unlinkSync(tempFile);

  console.log(`\n✅ Updated tag ${tagName} with custom changelog message`);
} catch (err) {
  console.error("⚠️  Failed to update tag:", err.message);
  process.exit(1);
}
