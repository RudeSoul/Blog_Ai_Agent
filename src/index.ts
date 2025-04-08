import { generatePost } from "./generatePost";
import { savePost } from "./savePost";
import { pushPost } from "./pushToGitHub";
import { scheduleDaily } from "./schedule";

scheduleDaily(async () => {
  try {
    const { content, slug, title } = await generatePost();
    await savePost(content, slug, title);
    await pushPost(slug, title);
  } catch (error) {
    console.error("❌ Error during blog automation:", error);
  }
}, false);
