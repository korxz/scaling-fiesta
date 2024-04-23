import axios from "axios";
import { Page } from "./html.helper";
import { baseUrl } from "./constants";

(async () => {
  console.log("Program started.");

  console.log("Making initial page request");

  const response = await axios.get(baseUrl);

  const page = new Page(response.data);

  page.savePage(baseUrl);

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

    page.savePage(url);

    scrapedPages[url] = true;

    await page.downloadImages(url);

    for (const pageLink of page.getPageLinks(url)) {
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
