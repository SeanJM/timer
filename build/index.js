const html = require("./html");
const execSync = require("child_process").execSync;
const path = require("path");
const dirname = path.resolve(__dirname, "../frontend/public");
execSync(`rm -rf ${dirname} && mkdir ${dirname}`);
html();