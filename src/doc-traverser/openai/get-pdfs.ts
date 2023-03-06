import { Browser } from "puppeteer";
import waitTillHTMLRendered from "../../functions/wait-till-html-rendered.js";
import urlParser from "./url-parser.js";

const getPDFs = async (baseUrl: string, browser: Browser) => {
  const page = await browser.newPage();
  const urls = await urlParser(baseUrl, page);
  // console.log(urls);
  const buffer: Buffer[] = [];
  let count = 0;
  for (const url of urls) {
    // await page.emulateMediaType("");
    await page.goto(url, {waitUntil: "networkidle2"});
    await waitTillHTMLRendered(page);

    buffer.push(
      await page.pdf({
        // displayHeaderFooter: true,
        // headerTemplate: "title",
        // footerTemplate: "url",
        margin: {
          bottom: 0,
          top: 0,
          left: 0,
          right: 0
        },
        format: "A4",
      })
    );
    count++;
  }

  return buffer;
};

export default getPDFs;
