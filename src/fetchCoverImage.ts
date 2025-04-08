import axios from "axios";
import fs from "fs";
import path from "path";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export async function fetchCoverImage(query: string, savePath: string) {
  const res = await axios.get(PEXELS_API_URL, {
    headers: { Authorization: PEXELS_API_KEY },
    params: { query, per_page: 1 },
  });

  const photo = res.data.photos[0];
  if (!photo) {
    console.warn("⚠️ No photo found for:", query);
    return;
  }

  const imageUrl = photo.src.large;
  const imageData = await axios.get(imageUrl, { responseType: "arraybuffer" });

  fs.writeFileSync(savePath, imageData.data);
  console.log(`📷 Cover image saved: ${savePath}`);
}
