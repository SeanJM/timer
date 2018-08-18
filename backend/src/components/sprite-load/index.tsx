import React from "react";
import path from "path";
import fs from "fs";
import generateId from "@generate-id";
import SvgIcon from "@components/sprite-load/svg-icon";
import spriteTracker from "@components/sprite-load/sprite-tracker";

function alias(src) {
  const resolve = {
    "@frontend": path.resolve(__dirname, "../../../../frontend"),
  };
  
  for (var k in resolve) {
    if (src.indexOf(k) === 0) {
      return resolve[k] + src.substring(k.length);
    }
  }

  return src;
}

export default function SpriteLoad(props) {
  const src = alias(props.src);
  const listOfIcons = [];
  const pathname = path.resolve(src);
  const files = fs.readdirSync(pathname);
  const prefix = props.prefix || path.basename(src);

  const iconStats = [];
  let i = -1;
  const n = files.length;

  while (++i < n) {
    if (/svg$/.test(files[i])) {
      spriteTracker.src(
        prefix + "_" + path.basename(files[i], ".svg"),
        path.join(src, files[i])
      );

      iconStats.push({
        name: path.basename(files[i], ".svg"),
        filesize: fs.lstatSync(path.join(src, files[i])).size,
      });

      listOfIcons.push(
        <SvgIcon
          key={generateId()}
          src={path.join(src, files[i])}
          prefix={prefix}
        />
      );
    }
  }

  return (
    <svg
      name={prefix}
      style={{ display: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {listOfIcons}
    </svg>);
}

export { spriteTracker };