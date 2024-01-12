import * as cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("./result.html", "utf-8");
const $ = cheerio.load(html);

console.log($("title").text());
const result = [];

$(".kCrYT").each((index, element) => {
  let txt = $(element).text();
  txt = txt.replace(/\n/g, "").trim().replace(/\s\s+/g, " ");
  result.push({ id: index, txt });
});

fs.writeFileSync("./result.json", JSON.stringify(result, null, 2));
