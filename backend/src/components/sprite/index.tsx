import el from "flatman-server";
import * as fs from "fs";
import * as path from "path";
import parse from "flatman-parse";

interface SpriteProps {
  src: string
}

function resolve(src: string) {
  const resolved = src.replace(/^@/, path.resolve(__dirname, "../../../../") + "/");
  return resolved;
}

function toElement(element) {
  const TagName = element.tagName;
  return TagName ?
    <TagName {...element.attributes}>{element.children.map(toElement)}</TagName>
    : element;
}

export function SpriteLoad(props: SpriteProps) {
  const dirname = resolve(props.src);
  const files = fs.readdirSync(resolve(props.src));

  return (
    <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
      {
        files
          .filter((file) => /\.svg$/.test(file))
          .map((file) => {
            const basename =
              path.basename(dirname) + "-" + path.basename(file, ".svg");

            const filename =
              path.join(dirname, file);

            const str = fs.readFileSync(filename, "utf8");
            const svg = parse(str).find((a) => a.tagName === "svg");

            return <symbol id={basename} viewBox={svg.attributes.viewBox}>{svg.children.map(toElement)}</symbol>
          })
      }
    </svg>
  );
}