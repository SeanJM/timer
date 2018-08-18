import React from "react";
import path from "path";
import fs from "fs";
import generateId from "@generate-id";

const parse = require("flatman-parse");

function parseSvg(str) {
  const domTree = parse(str);
  let i = -1;
  const n = domTree.length;

  while (++i < n) {
    if (domTree[i].tagName === "svg") {
      return domTree[i];
    }
  }

  return null;
}

function nodeToElement(element) {
  const TagName = element.tagName;
  return TagName
    ? (
      <TagName
        {...element.attributes}
        key={generateId()}>
        {element.children.map(nodeToElement)}
      </TagName>
    )
    : element;
}

export default function SvgIcon({ prefix, src }) {
  const str = fs.readFileSync(src, "utf8");
  const id = prefix + "_" + path.basename(src, ".svg");
  const parsed = parseSvg(str);
  return (
    <symbol viewBox={parsed.attributes.viewBox} id={id}>
      {parsed.children
        .filter((vnode) => vnode.tagName !== "title")
        .map((element) => nodeToElement(element))}
    </symbol>
  );
}