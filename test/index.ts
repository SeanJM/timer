import tinyTest from "tiny-test";
import url from "./url";
import components from "./components";
import database from "./database";
import element from "./element";
import path from "./path";
import packages from "./packages";

let settings = {
  components: true,
  database: true,
  element: true,
  packages: true,
  path: true,
  url: true,
};

tinyTest(function (test, load) {
  if (settings.components) components(test);
  if (settings.database) database(test);
  if (settings.element) element(test);
  if (settings.packages) packages(test);
  if (settings.path) path(test);
  if (settings.url) url(test);
  load();
});