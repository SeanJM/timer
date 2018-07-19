const { el } = require("flatman-server");

module.exports = function () {
  const page = el("HTML", [
    el("div", { id: "app" }),
    el("script", { src: "bundle.js" })
  ]);
  page.toFile("frontend/public/index.html");
}