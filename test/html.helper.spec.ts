import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { Page } from "../src/html.helper";
import Sinon from "sinon";

describe("Html helper - Page class", () => {
  let page: Page;
  const html =
    '<html><body><img src="image.jpg"><a href="page2.html"></a></body></html>';
  const url = "http://example.com";

  beforeEach(() => {
    page = new Page(html);
  });

  afterEach(() => {
    // Cleanup: remove any files created during tests
    const pagesDir = path.join(__dirname, "..", "src", "pages");
    const imagesDir = path.join(__dirname, "..", "src", "images");
    fs.readdirSync(pagesDir).forEach((file) =>
      fs.unlinkSync(path.join(pagesDir, file))
    );
    fs.readdirSync(imagesDir).forEach((file) =>
      fs.unlinkSync(path.join(imagesDir, file))
    );
  });

  it("should save page correctly", () => {
    page.savePage(url);
    const filePath = path.join(
      __dirname,
      "..",
      "src",
      "pages",
      "http___example.com.html"
    );
    expect(fs.existsSync(filePath)).to.be.true;
  });

  it("should download images correctly", async () => {
    // Mock downloadImage function
    const downloadImage = async (url: string, filePath: string) => {
      // Create empty file to simulate image download
      fs.writeFileSync(filePath, "");
    };
    page.downloadImages(url);
    const imagesDir = path.join(__dirname, "..", "src", "images");
    const files = fs.readdirSync(imagesDir);
    expect(files.length).to.equal(1); // Assuming one image is downloaded
  });

  it("should scrape page correctly", async () => {
    // Mock savePage and downloadImages functions
    const savePageStub = Sinon.stub(page, "savePage");
    const downloadImagesStub = Sinon.stub(page, "downloadImages");
    await page.scrapePage(url);
    expect(savePageStub.calledOnceWith(url)).to.be.true;
    expect(downloadImagesStub.calledOnceWith(url)).to.be.true;
  });

  it("should get page links correctly", () => {
    const links = page.getPageLinks(url);
    expect(links).to.deep.equal(["http://example.com/page2.html"]);
  });
});
