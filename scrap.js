import fs from "fs";
import cheerio from "cheerio";
import axios from "axios";

const searchTerm = "vệ sinh máy lạnh tphcm";

axios.defaults.baseURL = "https://google.com";
axios
  .get("/search", {
    params: {
      q: searchTerm,
      ie: "UTF-8",
      oe: "UTF-8",
      client: "opera",
      sourceid: "opera",
      lr: "lang_en",
      ip: 1,
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0",
    },
  })
  .then((res) => {
    fs.writeFileSync(`./result_${searchTerm}.html`, res.data);
    const $ = cheerio.load(res.data, {
      lowerCaseTags: true,
      decodeEntities: false,
    });
    console.log($("title").text());
    console.log(
      $("div[innerHTML='Sponsored'], div[innerHTML='Được tài trợ']") +
        "Sponsored"
    );
    console.log("Result stat: " + $("#result-stats").text());
    $(".KP7LCb").remove();
    $("#st-card").remove();
    $("script, meta, noscript, header, footer, textarea").remove();
    fs.writeFileSync(`./result_simplyfied_${searchTerm}.html`, $.html());
  });
