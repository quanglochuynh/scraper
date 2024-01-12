import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";

axios.defaults.baseURL = "https://google.com";
axios
  .get("/search", {
    params: {
      q: "hcmiu",
      ie: "UTF-8",
      oe: "UTF-8",
      client: "opera",
      sourceid: "opera",
      lr: "lang_en",
      ip: 1,
    },
  })
  .then((res) => {
    const $ = cheerio.load(res.data, {
      lowerCaseTags: true,
      decodeEntities: false,
    });
    console.log($("title").text());
    $(".KP7LCb").remove();
    $("#st-card").remove();
    $("script, meta, noscript, header, footer, textarea").remove();
    fs.writeFileSync("./result_simplyfied.html", $.html());
  });
