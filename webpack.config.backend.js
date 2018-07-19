const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin/lib");
const nodeExternals = require("webpack-node-externals");
const spawn = require("child_process").spawn;

class StartServer {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("Server", (compilation) => {
      const { output } = compilation.options;
      const outfile = path.join(output.path, output.filename);
      spawn("node", [outfile], { stdio: "inherit" });
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "node",
  context: __dirname,
  entry: path.join(__dirname, "server/src/index.ts"),

  node: {
    __filename: true,
    __dirname: true,
  },

  externals: [nodeExternals()],

  output: {
    path: path.join(__dirname, "server", "public"),
    filename: "index.js",
  },

  devtool: process.env.NODE_ENV === "production"
    ? ""
    : "cheap-eval-source-map",

  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, "tsconfig.json"),
        extensions: [".ts", ".js"],
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new StartServer()
  ],
};