import getParams from "@frontend/src/components/router/get-params";

export default function (test) {
  test("getParams", function () {
    return getParams("/a/b/c/", "/a/b/").__match
  }).isEqual(true);

  test("getParams: with parameter set in schema", function () {
    return getParams("/a/b/c/", "/a/:b/").__match
  }).isEqual(true);
}