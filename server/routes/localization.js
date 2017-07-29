const path = require("path");
const fs = require("fs");
const _ = require("lodash");

require("colors");

module.exports = function (app) {
  app.get("/localization/:lang", function (req, res) {
    const hh = new Date().getHours().toString();
    const mm = _.padStart(new Date().getMinutes().toString(), 2, "0");

    const filename = path.join(
      "src",
      "localization",
      req.params.lang + ".json"
    );

    console.log(
      "[".cyan + hh + ":".cyan + mm + "] Language request for ".cyan + "\"".yellow + req.params.lang.yellow + "\"".yellow
    );

    const json = JSON.parse(
      fs.readFileSync(filename)
    );

    res.json(json);
  });
};