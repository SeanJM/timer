const path = require("path");
const fs = require("fs");
const glob = require("glob");
const minimatch = require("minimatch");
const _ = require("lodash");
const directories = [];

require("colors");

function watchFile(props) {
  const {
    filename,
    callback,
    watched
  } = props;

  let debounce = false;

  if (watched.indexOf(filename) === -1) {
    fs.watch(filename, (e, filename) => {
      if (!debounce) {
        callback({
          name: e,
          filename: path.basename(filename)
        });

        debounce = true;
        setTimeout(
          () => {
            debounce = false;
          },
          3000
        );
      }
    });

    watched.push(filename);
  }
}

function watchDir(props) {
  const {
    dirname,
    callback,
    watched,
    files,
    globBasename
  } = props;

  // Watch directories
  if (directories.indexOf(dirname) === -1) {
    directories.push(dirname);
    fs.watch(dirname, (e, basename) => {
      let filename = path.resolve(
        path.join(dirname, basename)
      );

      // Check for new files
      if (e !== "change" && minimatch(basename, globBasename) && files.indexOf(filename) === -1) {
        fs.lstat(filename, (err) => {
          if (!err) {
            callback({
              name: "New File",
              filename: basename,
              files: files.slice()
            });

            files.push(filename);

            watchFile({
              filename,
              callback,
              watched
            });
          }
        });
      }
    });
  }
}

function watch(globPattern, callback) {
  const files = glob.sync(globPattern);
  const globBasename = path.basename(globPattern);
  const watched = [];

  const HH = _.padStart(new Date().getHours(), 2, "0");
  const MM = _.padStart(new Date().getMinutes(), 2, "0");

  console.log(
    "[".cyan + HH.white + ":".cyan + MM.white + "] Watching: ".cyan + "\"".yellow + globPattern.yellow + "\"".yellow
  );

  files.forEach(filename => {
    watchDir({
      dirname: path.dirname(filename),
      files,
      callback,
      watched,
      globBasename
    });

    watchFile({
      filename,
      callback,
      watched
    });
  });
}

module.exports = watch;
