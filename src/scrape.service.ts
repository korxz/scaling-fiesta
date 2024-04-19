import axios from "axios";
import { Page } from "./html.helper";
import { baseUrl } from "./constants";
import * as fs from "fs";
import * as https from "https";

export async function loadNextPage(
  url: string,
  numberOfPage: number
): Promise<void> {
  numberOfPage++;

  const response = await axios.get(`${baseUrl}/${url}`);

  const page = new Page(response.data);

  const fileName = url.split("/")[1];

  console.log(`Saving page number: ${numberOfPage}`);

  page.savePage(response.data, fileName);
  await page.downloadImages();

  const hasNextPage = page.hasNextPage();

  if (hasNextPage) {
    await loadNextPage(page.getNextPageUrl(), numberOfPage);
  }

  return;
}

export function generateUrl(urlPath: string): string {
  if (urlPath.startsWith("/")) {
    return `${baseUrl}${urlPath}`;
  }

  return `${baseUrl}/${urlPath}`;
}

export async function downloadImage(
  url: string,
  filename: string
): Promise<void> {
  const file = fs.createWriteStream(filename);

  await new Promise<void>((resolve, reject) => {
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filename, () => {
          reject(err.message);
        });
      });
  });
}
