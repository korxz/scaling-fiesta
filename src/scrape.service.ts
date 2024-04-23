import axios from "axios";
import * as fs from "fs";
import * as https from "https";

export async function getPageContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (err: any) {
    console.log(`Failed to fetch page content.`);
    throw new Error(err.message);
  }
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
