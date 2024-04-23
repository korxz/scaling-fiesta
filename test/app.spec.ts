import { expect } from "chai";
import * as sinon from "sinon";
import scrapeService from "../src/scrape.service";
import { Page } from "../src/html.helper";
import { baseUrl } from "../src/constants";

describe("Entry Point", () => {
  let getPageContentStub: sinon.SinonStub;
  let getPageLinksStub: sinon.SinonStub;
  let scrapePageStub: sinon.SinonStub;

  before(() => {
    getPageContentStub = sinon
      .stub(scrapeService, "getPageContent")
      .resolves("<html><body>Page content</body></html>");

    getPageLinksStub = sinon
      .stub(Page.prototype, "getPageLinks")
      .returns(["http://example.com/page1", "http://example.com/page2"]);

    scrapePageStub = sinon.stub(Page.prototype, "scrapePage").resolves();
  });

  after(() => {
    sinon.restore();
  });

  it("should scrape pages recursively until all links are visited", async () => {
    // Execute the entry point function
    await require("../src/app.ts");

    expect(getPageContentStub.calledWith(baseUrl)).to.be.true;

    expect(scrapePageStub.calledWith(baseUrl)).to.be.true;
  });
});
