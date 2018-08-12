const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin/lib");
const nodeExternals = require("webpack-node-externals");
const spawn = require("child_process").spawn;
const __root = path.resolve(__dirname, "../../");

class StartTests {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("Test", (compilation) => {
      const { output } = compilation.options;
      const outfile = path.join(output.path, output.filename);
      fs.lstat(outfile, function (err) {
        if (!err) {
          spawn("node", [outfile], { stdio: "inherit" });
        }
      });
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "node",
  context: __root,
  entry: path.join(__root, "test/index.ts"),

  node: {
    __filename: true,
    __dirname: true,
  },

  externals: [nodeExternals()],

  output: {
    path: path.join(__root, "test", "public"),
    filename: "test.js",
  },

  devtool: process.env.NODE_ENV === "production"
    ? ""
    : "source-map",

  resolve: {
    extensions: [".ts", ".js", ".tsx"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__root, "test", "tsconfig.json"),
        extensions: [".ts", ".js", ".tsx"],
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts(x|)$/,
        exclude: /node_modules/,
        options: {
          configFile: path.join(__root, "test", "tsconfig.json"),
        },
        loader: "ts-loader",
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new StartTests(),
  ],
};