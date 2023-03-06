import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import getPDFs from "./doc-traverser/openai/get-pdfs.js";
const baseURL = "https://platform.openai.com/docs/";
(async () => {
    let browser;
    let url;
    try {
        url = new URL(baseURL);
    }
    catch (error) {
        console.log(`${baseURL} is not valid`);
        return;
    }
    try {
        browser = await puppeteer.launch();
    }
    catch (error) {
        console.log("Browser didn't launch");
        return;
    }
    try {
        const buffer = await getPDFs(baseURL, browser);
        const mergedPdf = await PDFDocument.create();
        if (!buffer) {
            await browser.close();
            return;
        }
        for (const pdfBytes of buffer) {
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }
        const mergedBuf = await mergedPdf.save();
        const saveDir = path.join("./output", `${url.hostname}.pdf`);
        fs.open(saveDir, "w", function (err, fd) {
            fs.write(fd, mergedBuf, 0, mergedBuf.length, null, function (err) {
                fs.close(fd, function () {
                    console.log("wrote the file successfully");
                });
            });
        });
        await browser.close();
    }
    catch (error) {
        console.log(`${error}`);
        await browser.close();
    }
})();
