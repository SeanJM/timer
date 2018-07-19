const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";

module.exports = function (__root) {
  return {
    resolve: {
      extensions: [".scss"],
      alias: {
        "@styles": path.resolve(__root, "frontend/src/styles"),
      },
    },

    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          isProduction
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              minimize: isProduction,
              importLoaders: 1,
            },
          },
          { loader: "postcss-loader", options: {} },
          "sass-loader",
        ],
      }],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    ],
  };
};