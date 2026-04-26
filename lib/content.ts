import fs from "node:fs/promises";
import path from "node:path";

const contentFile = path.join(process.cwd(), "data", "content.json");

export type SiteContent = {
  [key: string]: unknown;
};

export async function getSiteContent() {
  const content = await fs.readFile(contentFile, "utf8");
  return JSON.parse(content) as SiteContent;
}

export async function saveSiteContent(content: SiteContent) {
  await fs.writeFile(contentFile, JSON.stringify(content, null, 2), "utf8");
  return content;
}
