import * as fs from "fs";
import React, { Fragment } from "react";
import ReactDOM from "react-dom/server";
import SpriteLoad, { spriteTracker } from "@backend/components/sprite-load";
import * as path from "path";

const Page = (
  <Fragment>
    <div id="app" />
    <SpriteLoad src="@frontend/src/icon" />
  </Fragment>
);

function render(Component: JSX.Element, pathname) {
  const str = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

  const options = {
    head: process.env.NODE_ENV === "production"
      ? <link rel="stylesheet" href="bundle.css"/>
      : null,
    body: ReactDOM.renderToStaticMarkup(Component),
    script: "bundle.js",
  };

  return fs.writeFileSync(
    pathname,
    str.replace(/\{\{(\w+)\}\}/g, (a, b) => options[b] || "")
  );
}

export default function (__root: string) {
  render(Page, path.join(__root, "frontend/public/index.html"));
  spriteTracker.log();
}
