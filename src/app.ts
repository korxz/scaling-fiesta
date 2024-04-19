import axios from "axios";
import { Page } from "./html.helper";
import { baseUrl } from "./constants";
import { loadNextPage } from "./scrape.service";

(async () => {
  console.log("Program started.");

  console.log("Making initial page request");

  const response = await axios.get(baseUrl);

  const page = new Page(response.data);

  console.log("Saving page number: 1");

  page.savePage(response.data, "homepage.html");

  await page.downloadImages();

  let hasNextPage = page.hasNextPage();
  let nextPageUrl = page.getNextPageUrl();

  if (hasNextPage) {
    await loadNextPage(nextPageUrl, 1);
  }

  console.log("Program ended.");

  return;
})();
