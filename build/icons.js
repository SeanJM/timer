const glob = require("glob");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");

const watch = require("./watch");
const { el, parse, Component } = require("flatman-server");

require("colors");

Component.create("icons", {
  constructor(props) {
    this.props = {
      src: props.src || "src/icons/*.svg"
    };

    watch(this.props.src, () => this.build());
    this.on("build", props.onBuild);
    this.build();
  },

  build() {
    glob(this.props.src, (err, files) => {
      if (err) {
        this.trigger("error", {
          error: err
        });
      } else {
        this.groupToSprite(files);
      }
    });
  },

  truncate(str, len) {
    if (str.length > len) {
      return str.substr(0, len) + "...";
    }
    return str;
  },

  svgToSymbol(image) {
    const xml = fs.readFileSync(image, "utf8");
    const node = parse(xml).find("svg")[0];
    const children = node.children().filter(a => a.tagName !== "defs" && a.tagName !== "style");

    const symbol = el("symbol", {
      viewBox: node.attr("viewBox"),
      id: "icon-" + path.basename(image, ".svg")
    }, children);

    return symbol;
  },

  groupToSprite(images) {
    let filename = "icons.html";

    let doc = el("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      style: {
        display: "none"
      }
    });

    images.forEach(image => {
      try {
        doc.append([ this.svgToSymbol(image) ]);
      } catch (e) {
        console.log(
          ("[".cyan + moment().format("HH:mm") + "] [icons] SVG Error: \"" + image + "\" failed to generate").red
        );
      }
    });

    this.trigger("build", doc);

    console.log(
      "[".cyan + moment().format("HH:mm") + "] [icons] ".cyan +
      "\"".yellow + filename.yellow + "\"".yellow +
      " (" + images.length + ")"
    );

    _(images)
      .map(a => _.padEnd(
        this.truncate(path.basename(a), 30), 30, " "
      ))
      .chunk(3)
      .forEach(arr => {
        console.log(arr.join(" ").green);
      });

    console.log("Done @ ".cyan + moment().format("HH:mm:ss").cyan + "\n");
  }
});