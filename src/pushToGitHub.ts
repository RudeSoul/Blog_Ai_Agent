import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import "dotenv/config";

const { GIT_REPO, GIT_USERNAME, GIT_EMAIL } = process.env;
const CLONE_DIR = path.resolve("repo");

export async function pushPost(slug: string, title: string) {
  const repoUrl = `git@github.com:${GIT_REPO!.split("github.com/")[1]}`;
  const safeSlug = slug
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  const MAX_COMMIT_TITLE_LENGTH = 72;
  const cleanTitle = title.replace(/["'`]/g, "").trim();

  const shortTitle =
    cleanTitle.length <= MAX_COMMIT_TITLE_LENGTH
      ? cleanTitle
      : cleanTitle.split(":")[0].trim();

  const git = simpleGit();

  if (!fs.existsSync(CLONE_DIR)) {
    console.log("📥 Cloning repo...");
    await git.clone(repoUrl, CLONE_DIR);
  }

  const repoGit = simpleGit(CLONE_DIR);

  const gitPath = path.join(CLONE_DIR, ".git");
  if (!fs.existsSync(gitPath)) {
    throw new Error("❌ Cloned directory is not a Git repository.");
  }

  try {
    await repoGit.addConfig("user.name", GIT_USERNAME!, false, "local");
    await repoGit.addConfig("user.email", GIT_EMAIL!, false, "local");
  } catch (err) {
    console.warn("⚠️ Failed to set Git config:", err);
  }

  await repoGit.fetch("origin", "main");
  await repoGit.checkout(["-B", "temp-main", "origin/main"]);

  const branchName = `blog/${safeSlug}-${dayjs().format("YYYY-MM-DD")}`;
  console.log(`🌿 Creating branch: ${branchName}`);
  await repoGit.checkoutBranch(branchName, "origin/main");

  await repoGit.add(`content/blog/${slug}`);
  const commitTitle = `add(blog): ${shortTitle}`;
  const commitBody = `- Blog post on "${shortTitle}"\n- Includes visual content for better UX\n- Auto-published via AI agent`;
  await repoGit.commit(`${commitTitle}\n\n${commitBody}`);

  await repoGit.push("origin", branchName);
  console.log(`✅ Blog pushed and branch '${branchName}' created`);
}
