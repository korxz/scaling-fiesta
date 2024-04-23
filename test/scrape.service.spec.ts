import { expect } from "chai";
import * as sinon from "sinon";
import axios from "axios";
import scrapeService from "../src/scrape.service";

describe("ScrapeService class", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should fetch page content correctly", async () => {
    const url = "http://example.com";
    const responseData = "Page content";
    const axiosGetStub = sinon
      .stub(axios, "get")
      .resolves({ data: responseData });

    const result = await scrapeService.getPageContent(url);

    expect(result).to.equal(responseData);
    expect(axiosGetStub.calledOnceWith(url)).to.be.true;
  });
});
