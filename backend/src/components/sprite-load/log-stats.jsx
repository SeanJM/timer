import padStart from "@strings/pad-start";
import padEnd from "@strings/pad-end";
import round from "@round";
import ellipsis from "@strings/ellipsis";
import { bold, yellow, green, red } from "@terminal";

const loaded = {};

function timestamp() {
  const d = new Date();
  return (
    padStart((d.getMonth() + 1), 2, "0") +
    "/" + padStart(d.getDate(), 2, "0") +
    "/" + padStart(d.getFullYear(), 4, "0") + " " +
    bold(padStart(d.getHours() % 12, 2, "0") + ":" +
    padStart(d.getMinutes(), 2, "0") + ":" +
    padStart(d.getSeconds(), 2, "0")) + " " +
    (d.getHours() > 11 ? "PM" : "AM")
  );
}

function padFilesize(n) {
  const rounded = round((n / 1024), 2);
  const left = (rounded + "").split(".")[0];
  return padEnd(rounded, left.length > 1 ? 5 : 4, "0") + " KiB";
}

export default function logStats(src, iconStats) {
  let totalSize = 0;
  let loadedType = loaded[src];
  let mean;
  let largest = iconStats[0].filesize;
  let smallest = iconStats[0].filesize;

  if (!loadedType || (loadedType && new Date().getTime() - loadedType.time > 2000)) {
    loaded[src] = {
      time: new Date().getTime(),
    };

    iconStats.forEach((stats) => {
      if (stats.filesize > largest) {
        largest = stats.filesize;
      } else if (stats.filesize < smallest) {
        smallest = stats.filesize;
      }
      totalSize += stats.filesize;
    });

    mean = totalSize / iconStats.length;

    console.log(
      yellow(bold(padStart("SpriteLoad", 25, " "))) +
      green(bold(padStart(ellipsis(src, 24), 24, " ")))
    );

    console.log(
      bold(padStart(ellipsis("Built at:", 25), 25, " ")) + "  " +
      timestamp()
    );

    console.log(
      bold(padStart("Sprite", 25, " ")) +
      bold(padStart("Size", 12, " ")) +
      bold(padStart("%", 9, " "))
    );

    iconStats.sort((a, b) => b.filesize - a.filesize).forEach((stats) => {
      const floor = mean - ((mean - smallest) / 2);
      const ceil = mean + ((largest - mean) / 2);

      let str =
        padStart(ellipsis(stats.name, 25), 25, " ") +
        padStart(padFilesize(stats.filesize), 12, " ") +
        padStart(padEnd(round(stats.filesize / totalSize * 100, 1), 3, "0.0") + " %", 9, " ");

      if (stats.filesize > floor && stats.filesize < ceil) {
        str = str + bold(yellow(padStart("+", 3, " ")));
      } else if (stats.filesize < floor) {
        str = str + bold(green(padStart("+", 3, " ")));
      } else if (stats.filesize > ceil) {
        str = str + bold(red(padStart("+", 3, " ")));
      }

      console.log(str);
    });

    console.log(
      yellow(bold(padStart("Mean:", 25, " ") +
          padStart(padFilesize(mean), 12, " ")))
    );

    console.log(
      bold(padStart("Total:", 25, " ") +
        padStart(padFilesize(totalSize), 12, " "))
    );
  }

}