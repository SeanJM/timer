import el, { render, Html } from "flatman-server";
import * as path from "path";
const __root = path.resolve(__dirname, "../../");

module.exports = function () {
  const filename =
    path.join(__root, "frontend/public/index.html");

  const page = (
    <Html scripts="bundle.js">
      <div id="app" />
    </Html>
  );

  render(page, filename);
}