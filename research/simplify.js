import cheerio from "cheerio";
import fs from "fs";

const html = fs.readFileSync("./businessplan.html", "utf-8");

const $ = cheerio.load(html, { lowerCaseTags: true, decodeEntities: false });

console.log($("title").text());
$(
  "script, meta, noscript, header, footer, textarea, style, path, cite, g-loading-icon"
).remove();

$(".fl").remove();

// remove all aria-hidden="true"
$("[aria-hidden='true']").each((i, el) => {
  $(el).remove();
});
// remove all atrributes with name "data-ved" and "jsaction" from all elements
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

console.log(classNameLUT);

// create classname count histogram array
const classNameCount = Array.from({ length: 40 }, () => 0);
classNameLUT.forEach((item) => {
  classNameCount[item.count] += 1;
});

console.log(classNameCount);

const maxClassNameCount = Math.max(...classNameCount);

const maxClassNameIndex = classNameCount.findIndex(
  (item) => item === maxClassNameCount
);
console.log(maxClassNameIndex);

const maxClassName = classNameLUT[maxClassNameIndex].name;
console.log(maxClassName);

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
console.log(results);

fs.writeFileSync("./result_simplyfied.html", $.html());
