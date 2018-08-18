const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin/lib");
const nodeExternals = require("webpack-node-externals");
const spawn = require("child_process").spawn;
const __root = path.resolve(__dirname, "../../");

let server_open = false;
let __nodemon = path.join(__root, "backend", "nodemon.json");

class StartServer {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("Server", (compilation) => {
      if (!server_open) {
        const { output } = compilation.options;
        const outfile = path.join(output.path, output.filename);
        server_open = true;
        spawn("nodemon", ["--config", __nodemon, outfile], { stdio: "inherit" });
      }
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "node",
  context: __root,
  entry: path.join(__root, "backend/src/index.tsx"),

  node: {
    __filename: true,
    __dirname: true,
  },

  externals: [nodeExternals()],

  output: {
    path: path.join(__root, "backend", "public"),
    filename: "index.js",
  },

  devtool: process.env.NODE_ENV === "production"
    ? ""
    : "source-map",

  resolve: {
    extensions: [".ts", ".js", ".tsx"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__root, "backend", "tsconfig.json"),
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
          configFile: path.join(__root, "backend", "tsconfig.json"),
        },
        loader: "ts-loader",
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new StartServer(),
  ],
};