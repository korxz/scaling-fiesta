import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { downloadImage } from "./scrape.service";

export class Page {
  html: any;
  pagesDirectory = path.join("src", "pages");
  imagesDirectory = path.join("src", "images");

  constructor(pageContent: string) {
    this.html = cheerio.load(pageContent, { xmlMode: true });
  }

  savePage(pageContent: string, fileName: string): void {
    fs.writeFileSync(path.join(this.pagesDirectory, fileName), pageContent);
  }

  async downloadImages(baseUrl: string): Promise<void> {
    // Query for all <img></img>
    const images = this.html("img");

    console.log("Starting downloading images");

    for (const image of images) {
      const pathUrl = this.html(image).attr("src");
      const url = new URL(pathUrl, baseUrl).href;

      await downloadImage(
        url,
        path.join(this.imagesDirectory, url.replace(/\//g, "_"))
      );
    }

    console.log(`Ended image download, downloaded: ${images.length} images`);
  }

  getPageLinks(url: string): Array<string> {
    const links = this.html("a");

    console.log("Scrapping <a></a> tags on page.");

    const hrefs: Array<string> = [];

    // Exclude previous page
    const previousPage = this.html("link.previous a").attr("href");

    for (const link of links) {
      const href = this.html(link).attr("href");

      if (href !== previousPage) {
        // Add to arrays, already scrapped and yet to scrape so we prevent looping
        const absoluteUrl = new URL(href, url).href;
        hrefs.push(absoluteUrl);
      }
    }

    console.log("Ended scrapping <a></a> tags on page");

    return hrefs;
  }
}
