const { HotModuleReplacementPlugin, DefinePlugin } = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = function (__root) {
  return {
    mode: process.env.NODE_ENV === "production"
      ? "production"
      : "development",

    devtool: process.env.NODE_ENV === "production"
      ? false
      : "source-map",

    devServer: {
      contentBase: path.join(__root, "frontend/public/"),
      historyApiFallback: true,
      hot: true, // This is what allows to just replace a module (component)
      port: 3004,
      open: "Google Chrome",
      proxy: {
        "/": {
          target: "http://localhost:3005",
          bypass: function ({ headers }) {
            if (headers.accept.indexOf("html") !== -1) {
              return "/index.html";
            }
          },
        },
      },
    },

    entry: "./frontend/src/index.tsx",
    output: {
      path: path.join(__root, "frontend", "public"),
      filename: "bundle.js",
    },

    resolve: {
      extensions: [".ts", ".js", ".tsx"],
      plugins: [
        new TsconfigPathsPlugin({
          extensions: [".ts", ".js", ".tsx"],
        }),
      ],
    },

    module: {
      rules: [{
        test: /\.ts(x|)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      }],
    },

    plugins: process.env.NODE_ENV === "production"
      ? [
        new DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new UglifyJsPlugin(),
      ]
      : [
        new HotModuleReplacementPlugin(),
        new DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
      ],
  };
};