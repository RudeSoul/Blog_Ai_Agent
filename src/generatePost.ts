import { OpenAI } from "openai";
import "dotenv/config";
import slugify from "slugify";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generatePost() {
  const title = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Give me a tech blog topic new and trending." },
    ],
  });

  const topic = title.choices[0].message.content!;

  const prompt = `
Generate a high-quality, SEO-friendly tech blog post on the topic: "${topic}".
- Use markdown formatting
- Include a title, excerpt
- Add a YAML frontmatter block (title, slug, date (today), tags, excerpt, coverImage)
- Suggest relevant tags
- Make the post at more 1500 words
- Include at table or code snippet if relevant
- Add a placeholder for a cover image and one inline visual using copyright image availabe on Unsplash (with alt text)

Output should include ONLY the full Markdown file with frontmatter and no explanation.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content!;
  const slug = slugify(topic, { lower: true });

  return { content, slug, title: topic };
}
