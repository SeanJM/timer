const path = require("path");
const webpack = require("webpack");

module.exports = {
  module : {
    loaders : [
      {
        loader : "babel-loader",
        include : [
          path.resolve(__dirname, "src/"),
        ],
        test : /\.js$/,
        query : {
          presets : [ "env" ]
        }
      }
    ],
  },

  entry : [ "babel-polyfill", "./src/index.js" ],

  output : {
    filename : "bundle.js",
    path : path.resolve(__dirname, "dist")
  },

  devtool: process.env.NODE_ENV === "development"
    ? "#eval-source-map"
    : false,

  plugins: process.env.NODE_ENV === "production"
    ? [
      new webpack.optimize.UglifyJsPlugin({ minimize: true }),
      new webpack.optimize.OccurrenceOrderPlugin()
    ]
    : []
};