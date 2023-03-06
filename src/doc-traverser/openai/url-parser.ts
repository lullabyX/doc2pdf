// /docs/guides/...
// /docs/api-reference
// /docs/...

import { Page } from "puppeteer";
import waitTillHTMLRendered from "../../functions/wait-till-html-rendered.js";

const urlParser = async (baseUrl: string, page: Page): Promise<string[]> => {
  await page.goto(baseUrl, { waitUntil: "networkidle2" });
  await waitTillHTMLRendered(page);

  const urls = await page.$$eval(
    "a.scroll-link.side-nav-item",
    (anchorElements) => {
      return anchorElements.map(
        (anchorElement) => anchorElement.href
      ) as string[];
    },
    [baseUrl]
  );

  const filteredUrls: string[] = urls.filter(
    (url) =>
      !url?.includes("/docs/api-reference") && !url?.includes("/introduction/")
  );
  filteredUrls.push("https://platform.openai.com/docs/api-reference/");

  return filteredUrls;
};

export default urlParser;
