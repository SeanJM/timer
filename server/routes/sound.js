const path = require("path");
const _ = require("lodash");

require("colors");

module.exports = function (app) {
  app.get("/sound/:file", function (req, res) {
    const hh = new Date().getHours().toString();
    const mm = _.padStart(new Date().getMinutes().toString(), 2, "0");

    const filename = path.join(
      "sound",
      req.params.file
    );

    console.log(
      "[".cyan + hh + ":".cyan + mm + "] ".cyan + "GET   ".green + "sound/".cyan + req.params.file.yellow
    );

    res.sendFile(filename);
  });
};