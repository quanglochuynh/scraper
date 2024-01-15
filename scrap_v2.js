import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";

axios.defaults.baseURL = "https://google.com";
axios.defaults.headers.common["User-Agent"] =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0";

const searchTerm = "hostinger";
console.log("Search term: ", searchTerm);

const res = await axios.get("/search", {
  params: {
    q: searchTerm,
    ie: "UTF-8",
    oe: "UTF-8",
    client: "opera",
    sourceid: "opera",
    lr: "lang_en",
    ip: 1,
  },
});

const $ = cheerio.load(res.data, {
  lowerCaseTags: true,
  decodeEntities: false,
});
$(
  "script, meta, noscript, header, footer, textarea, path, cite, g-loading-icon"
).remove();

console.log(
  $("span[innerHTML='Sponsored'], span[innerHTML='Được tài trợ']").length +
    " Sponsored"
);
console.log("Result stat: " + $("#result-stats").text());

$(".fl").remove();

$("[aria-hidden='true']").each((i, el) => {
  $(el).remove();
});

$(
  "[data-ved], [jsaction], [jsname], [aria-controls], [data-lk], [jscontroller], [src]"
).each((i, el) => {
  $(el).removeAttr("data-ved");
  $(el).removeAttr("jsaction");
  $(el).removeAttr("jsname");
  $(el).removeAttr("aria-controls");
  $(el).removeAttr("data-lk");
  $(el).removeAttr("jscontroller");
  $(el).removeAttr("src");
  $(el).removeAttr("jsdata");
  //data-usg
  $(el).removeAttr("data-usg");
  //data-jsarwt
  $(el).removeAttr("data-jsarwt");
});

//remove empty div and span
$("div").each((i, el) => {
  if ($(el).html() === "") {
    $(el).remove();
  }
});
$("div").each((i, el) => {
  if ($(el).html() === "") {
    $(el).remove();
  }
});
$("div").each((i, el) => {
  if ($(el).html() === "") {
    $(el).remove();
  }
});

$("span").each((i, el) => {
  if ($(el).html() === "" || $(el).html() === " " || $(el).html() === "  ") {
    $(el).remove();
  }
});

const classNameLUT = [];
const divList = $("#search").find("#rso");
divList
  .find("div")
  .toArray()
  .forEach((el) => {
    if (el.attribs.class !== undefined) {
      const index = classNameLUT.findIndex(
        (item) => item.name === $(el).attr("class").split(" ")[0]
      );
      if (index == -1) {
        classNameLUT.push({
          name: $(el).attr("class").split(" ")[0],
          count: 1,
        });
      } else {
        classNameLUT[index].count += 1;
      }
    }
  });

// console.log(classNameLUT);

// create classname count histogram array
const classNameCount = Array.from({ length: 30 }, () => 0);
classNameLUT.forEach((item) => {
  classNameCount[item.count] += 1;
});
const maxClassNameCount = Math.max(...classNameCount);

const maxClassNameIndex = classNameCount.findIndex(
  (item) => item === maxClassNameCount
);
const maxClassName = classNameLUT[maxClassNameIndex].name;
console.log("Extracted class: ", maxClassName);

const results = divList
  .find(`.${maxClassName}`)
  .toArray()
  .map((el) => {
    const title = $(el).find("h3").text();
    const link = $(el).find("a").attr("href");
    const description = $(el)
      .find("span")
      .toArray()
      .map((el) => {
        const txt = $(el).text();
        if (txt !== "Dịch trang này" && txt !== "Translate this page") {
          return $(el).text();
        }
      })
      .filter((item) => item !== item.length > 10)
      .join("; ");

    return {
      title,
      link,
      description,
    };
  });
fs.writeFileSync("res.json", JSON.stringify(results));

fs.writeFileSync("res_div.html", $("#search").find("#rso").html());

console.log("Done");
