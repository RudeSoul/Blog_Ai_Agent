import { fetchCoverImage } from "./fetchCoverImage";
import path from "path";
import fs from "fs";

export async function savePost(content: string, slug: string, topic: string) {
  const blogDir = path.join("repo", "content", "blog", slug);
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  fs.writeFileSync(path.join(blogDir, "index.md"), content);

  const coverPath = path.join(blogDir, "cover.jpg");
  await fetchCoverImage(topic, coverPath);

  return `content/blog/${slug}/`;
}
