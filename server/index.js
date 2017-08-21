const path = require("path");
const exec = require("child_process").exec;

const bodyParser = require("body-parser");
const express = require("express");        // call express
const routes = require("./routes");
const app = express();                 // define our app using express

const port = 5000;        // set our port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/dist", express.static(path.resolve("dist/")));
app.use("/sound", express.static(path.resolve("sound/")));

routes(app);
app.listen(port);

console.log(
  "Proxy is running on http://localhost:" + port
);

exec("open http://localhost:" + port);