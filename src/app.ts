import axios from "axios";
import { Page } from "./html.helper";
import { baseUrl } from "./constants";
import sanitize from "sanitize-filename";

(async () => {
  console.log("Program started.");

  console.log("Making initial page request");

  const response = await axios.get(baseUrl);

  const page = new Page(response.data);

  console.log(`Saving a page on url: ${baseUrl}`);

  page.savePage(response.data, `${sanitize(baseUrl)}.html`);

  const scrapedPages: {
    [key: string]: boolean;
  } = {};

  const pagesToSrap: { [key: string]: boolean } = {};

  for (const link of page.getPageLinks(baseUrl)) {
    pagesToSrap[link] = true;
  }

  scrapedPages[baseUrl] = true;

  await page.downloadImages(baseUrl);

  while (Object.keys(pagesToSrap).length > 0) {
    const keys = Object.keys(pagesToSrap);
    const url = keys[0];

    const response = await axios.get(url);

    const page = new Page(response.data);

    console.log(`Saving a page on url: ${url}`);

    page.savePage(response.data, `${sanitize(url)}.html`);

    scrapedPages[url] = true;
    await page.downloadImages(url);

    const otherPageLinks: Array<string> = page.getPageLinks(url);

    for (const pageLink of otherPageLinks) {
      if (
        scrapedPages[pageLink] === undefined &&
        pagesToSrap[pageLink] === undefined
      ) {
        pagesToSrap[pageLink] = true;
      }
    }
    console.log(`Number of pages to scrap: ${Object.keys(pagesToSrap).length}`);
    delete pagesToSrap[url];
  }

  console.log("Program ended.");

  return;
})();
