import axios from "axios";
import { Page } from "./html.helper";
import { baseUrl } from "./constants";
import * as fs from "fs";
import * as https from "https";

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
