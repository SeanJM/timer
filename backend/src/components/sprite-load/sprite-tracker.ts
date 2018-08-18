import fs from "fs";
import padEnd from "@strings/pad-end";
import padStart from "@strings/pad-start";
import ellipsis from "@strings/ellipsis";
import { bold, magenta, yellow, green, red, dim } from "@terminal";
import round from "@round";

function padFilesize(n) {
  const rounded = round((n / 1024), 2);
  const left = (rounded + "").split(".")[0];
  return padEnd(rounded, left.length > 1 ? 5 : 4, "0") + " KiB";
}

const tracker = {
  useStack: [],
  srcStack: [],
  missingStack: [],
  unusedStack: [],
  fileSize: {},
  usedCount: {},
  totalSize: 0,

  use: function (name) {
    if (tracker.useStack.indexOf(name) === -1) {
      tracker.useStack.push(name);
    }
  },

  src: function (src, filename) {
    if (tracker.srcStack.indexOf(src) === -1) {
      tracker.fileSize[src] = fs.lstatSync(filename).size;
      tracker.totalSize += tracker.fileSize[src];
      tracker.srcStack.push(src);
    }
  },

  logName(name, length) {
    const isUsed = tracker.useStack.indexOf(name) > -1;
    const isMissing = tracker.srcStack.indexOf(name) === -1;
    const padded = padStart(ellipsis(name, length), length, " ");
    return isMissing ? magenta(padded) : isUsed ? padded : dim(padded);
  },

  logFileSize(name, length) {
    const isUsed = tracker.useStack.indexOf(name) > -1;
    const padded = padStart(padFilesize(tracker.fileSize[name]), length, " ");
    return tracker.fileSize[name]
      ? isUsed ? padded : dim(padded)
      : magenta(padStart("-", length, " "));
  },

  logUsedState(name, length) {
    const isUsed = tracker.useStack.indexOf(name) > -1;
    const isMissing = tracker.srcStack.indexOf(name) === -1;
    const padded = bold(padStart("+", length, " "));
    return isMissing ? magenta(padded) : isUsed ? green(padded) : red(padded);
  },

  logMissingState(name, length) {
    const isMissing = tracker.srcStack.indexOf(name) === -1;
    const padded = bold(padStart("+", length, " "));
    return isMissing ? magenta(padded) : green(padded);
  },

  log: function () {
    const missing = [];
    let stack;
    let i = -1;
    let n = tracker.useStack.length;

    while (++i < n) {
      if (tracker.srcStack.indexOf(tracker.useStack[i]) === -1) {
        missing.push(tracker.useStack[i]);
      }
    }

    i = -1;
    stack = missing.concat(tracker.srcStack);
    n = stack.length;

    console.log(yellow(bold(padStart("Sprites", 25, " "))));
    console.log(
      bold(padStart("Name", 25, " ")) +
      bold(padStart("Size", 12, " ")) +
      bold(padStart("Used", 6, " ")) +
      bold(padStart("Missing", 9, " "))
    );

    stack.sort((a, b) => {
      return tracker.fileSize[b] - tracker.fileSize[a];
    });

    while (++i < n) {
      console.log(
        this.logName(stack[i], 25) +
        this.logFileSize(stack[i], 12) +
        this.logUsedState(stack[i], 6) +
        this.logMissingState(stack[i], 6)
      );
    }

    console.log(
      bold(padStart(stack.length, 25, " ")) +
      bold(padStart(padFilesize(tracker.totalSize), 12, " ")) +
      bold(padStart(tracker.useStack.length, 6, " ")) +
      bold(padStart(missing.length, 6, " "))
    );
  },
};

export default tracker;