import tinyTest from "tiny-test";
import url from "./url";
import database from "./database";
import components from "./components";

tinyTest(function (test, load) {
  url(test);
  database(test);
  components(test);
  load();
});