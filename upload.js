require("colors");

const fs = require("fs");
const exec = require("child_process").exec;
const glob = require("glob");

// Settings
const settings = JSON.parse(fs.readFileSync("./upload.json"));

function rsync(props) {
  const address = settings.username + "@" + settings.server;
  return new Promise(function (resolve, reject) {
    exec("rsync -ra " + props.from + " " + address + ":" + props.to, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getFiles(callback) {
  const files = [];

  function each(i) {
    if (settings.files[i]) {
      glob(settings.files[i], function (err, list) {
        [].push.apply(files, list);
        each(i + 1);
      });
    } else {
      callback(files);
    }
  }

  each(0);
}

getFiles(function (files) {
  function each(i) {
    if (files[i]) {
      rsync({
        from: files[i],
        to: settings.dir + files[i]
      }).then(() => each(i + 1))
      .catch(err => { console.log(err); });
    } else {
      console.log("Files uploaded");
    }
  }

  each(0);
});