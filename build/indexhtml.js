const moment = require("moment");
const { el, Component } = require("flatman-server");

require("colors");

Component.create("index.html", {
  constructor() {
    this.document = (
      el("HTML", [
        el("link", {
          rel: "stylesheet",
          href: "dist/index.css"
        }),
        el("script", { src: "dist/bundle.js" })
      ])
    );

    this.icons = (
      el("icons", {
        src: "src/icons/*.svg",
        onBuild: sprite => {
          this.document
            .append([ sprite ]);
          this.update();
        }
      })
    );
  },

  write() {
    console.log(
      "[".cyan + moment().format("HH:mm") + "] Writing ".cyan + "\"index.html\"".yellow
    );
    this.document.toFile("index.html");
  },

  update() {
    clearTimeout(this.__d);
    this.__d = setTimeout(() =>
      this.write(),
      10
    );
  }
});