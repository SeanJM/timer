import tinyTest from "tiny-test";
import url from "./url";
import components from "./components";
import database from "./database";
import path from "./path";
import packages from "./packages";

tinyTest(function (test, load) {
  components(test);
  database(test);
  path(test);
  url(test);
  packages(test);
  load();
});