import cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("./result.html", "utf-8");

const $ = cheerio.load(html, { lowerCaseTags: true, decodeEntities: false });

console.log($("title").text());

$(".KP7LCb").remove();
$("#st-card").remove();
$("script, meta, noscript, header, footer").remove();

fs.writeFileSync("./result_simplyfied.html", $.html());
