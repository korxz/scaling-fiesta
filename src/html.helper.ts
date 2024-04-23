import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import sanitize from "sanitize-filename";
import scrapeService from "./scrape.service";

export class Page {
  $: cheerio.CheerioAPI;
  html: string;
  pagesDirectory = path.join("src", "pages");
  imagesDirectory = path.join("src", "images");

  constructor(data: string) {
    this.html = data;
    this.$ = cheerio.load(data, { xmlMode: true });
  }

  savePage(url: string): void {
    console.log(`Saving a page on url: ${url}`);

    fs.writeFileSync(
      path.join(this.pagesDirectory, `${sanitize(url)}.html`),
      this.html
    );
  }

  async downloadImages(pageUrl: string): Promise<void> {
    // Query for all <img></img>
    const images = this.$("img");

    console.log("Starting downloading images");

    for (const image of images) {
      const pathUrl = this.$(image).attr("src");

      if (pathUrl !== undefined) {
        const url = new URL(pathUrl, pageUrl).href;

        await scrapeService.downloadImage(
          url,
          path.join(this.imagesDirectory, url.replace(/\//g, "_"))
        );
      }
    }

    console.log(`Ended image download, downloaded: ${images.length} images`);
  }

  async scrapePage(url: string): Promise<void> {
    this.savePage(url);

    await this.downloadImages(url);
  }

  getPageLinks(url: string): Array<string> {
    const links = this.$("a");

    console.log("Scrapping <a></a> tags on page.");

    const hrefs: Array<string> = [];

    // Exclude previous page
    const previousPage = this.$("link.previous a").attr("href");

    for (const link of links) {
      const href = this.$(link).attr("href");

      if (href !== previousPage && href !== undefined) {
        // Add to arrays, already scrapped and yet to scrape so we prevent looping
        const absoluteUrl = new URL(href, url).href;
        hrefs.push(absoluteUrl);
      }
    }

    console.log("Ended scrapping <a></a> tags on page");

    return hrefs;
  }
}
