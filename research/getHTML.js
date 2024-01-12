import axios from "axios";
import fs from "fs";

axios.defaults.baseURL = "https://google.com";
axios
  .get("/search", {
    params: {
      q: "nodejs",
      ie: "UTF-8",
      oe: "UTF-8",
      client: "firefox-b-d",
      lr: "lang_en",
    },
  })
  .then((res) => {
    fs.writeFileSync("./result.html", res.data);
  });
