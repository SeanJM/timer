const path = require("path");
const merge = require("webpack-merge");
const __build = path.resolve(__dirname, "build/webpack");

module.exports = process.env.NODE_ENV === "test"
  ? require(path.join(__build, "webpack.config.test.js"))(__dirname)
  : merge(
    require(path.join(__build, "webpack.config.frontend.js"))(__dirname),
    require(path.join(__build, "webpack.config.styles.js"))(__dirname)
  );