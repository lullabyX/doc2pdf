// /docs/guides/...
// /docs/api-reference
// /docs/...
import waitTillHTMLRendered from "../../functions/wait-till-html-rendered.js";
const urlParser = async (baseUrl, page) => {
    await page.goto(baseUrl, { waitUntil: "networkidle2" });
    await waitTillHTMLRendered(page);
    const urls = await page.$$eval("a.scroll-link.side-nav-item", (anchorElements) => {
        return anchorElements.map((anchorElement) => anchorElement.href);
    }, [baseUrl]);
    const filteredUrls = urls.filter((url) => !url?.includes("/docs/api-reference") && !url?.includes("/introduction/"));
    filteredUrls.push("https://platform.openai.com/docs/api-reference/");
    return filteredUrls;
};
export default urlParser;
