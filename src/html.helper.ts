import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { downloadImage, generateUrl } from "./scrape.service";

export class Page {
  html: any;
  pagesDirectory = path.join("src", "pages");
  imagesDirectory = path.join("src", "images");

  constructor(pageContent: string) {
    this.html = cheerio.load(pageContent);
  }

  savePage(pageContent: string, fileName: string): void {
    fs.writeFileSync(path.join(this.pagesDirectory, fileName), pageContent);
  }

  async downloadImages(): Promise<void> {
    // Query for all <img></img>
    const images = this.html("img");

    console.log("Starting downloading images");

    for (const image of images) {
      const imageUrl = this.html(image).attr("src").replace("..", "") as string;
      await downloadImage(
        generateUrl(imageUrl),
        path.join(this.imagesDirectory, imageUrl.replace(/\//g, "_"))
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

  hasNextPage(): boolean {
    return this.html("div ul.pager li.next").length > 0;
  }

  getNextPageUrl(): string {
    const urlParam = this.html("div ul.pager li.next a").attr("href");

    if (urlParam.split("/").length > 1) {
      return urlParam;
    }

    return `catalogue/${urlParam}`;
  }

  getNumberOfPage(): number {
    const urlParam = this.getNextPageUrl();

    return Number(urlParam.split("/")[1].split(".")[0].split("-")[1]) - 1;
  }
}
