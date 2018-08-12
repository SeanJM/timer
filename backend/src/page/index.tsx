import el, { render, Html } from "flatman-server";
import { SpriteLoad } from "@components/sprite";
import * as path from "path";

const Page = (
  <Html scripts="bundle.js">
    <div id="app" />
    <SpriteLoad src="@frontend/src/icon" />
  </Html>
);

export default function (__root: string) {
  render(Page, path.join(__root, "frontend/public/index.html"));
}
