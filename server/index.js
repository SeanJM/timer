const express    = require("express");        // call express
const app        = express();                 // define our app using express
const bodyParser = require("body-parser");
const routes = require("./routes");
const path = require("path");
const port = 5000;        // set our port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/dist', express.static(path.resolve('dist/')));
app.use('/sound', express.static(path.resolve('sound/')));

routes(app);
app.listen(port);

console.log(
  "Proxy is running on http://localhost:" + port
);
