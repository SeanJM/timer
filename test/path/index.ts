import path from "@path";

export default function (test) {
  test("path - / - URL is match", path.params("/", "/a/b/c/").isMatch).isEqual(true);
  test("path - / - Params is match", path.params("/a/b/c/", "/").isMatch).isEqual(true);
  test("path.splice", path.splice("/a/b/c/", "d", 1)).isEqual("/a/d/c/");
  test("path.splice", path.splice("/a/b/c/", "d", -1)).isEqual("/a/b/d/");
  test("path.splice", path.splice("/a/b/c/", "d", -2)).isEqual("/a/d/");
  test("path.splice", path.splice("/a/b/c/", "d", -2, 1)).isEqual("/a/d/c/");
  test("path.pop", path.pop("/a/b/c/")).isEqual("/a/b/");
  test("path.pop", path.pop("/a/b/c/d/", 2)).isEqual("/a/b/");
  test("path.push", path.push("/a/b/c/", "d")).isEqual("/a/b/c/d/");
  test("path.push (multiple arguments)", path.push("/a/b/c/", "d", "e")).isEqual("/a/b/c/d/e/");
  test("path.replace (/a/:b/:c/)", path.replace("/a/:b/:c/", {b: "t"})).isEqual("/a/t/:c/");
  test("path.reduce (/a/:b/:c/)", path.reduce("/a/:b/:c/", {b: "t"})).isEqual("/a/t/");

  test("path.reduce 1 present",
    path.reduce("/:type/:categoryID/:todoID/", {
      type: "todo"
    })
  ).isEqual("/todo/");

  test("path.reduce 2 present", () => {
    return path.reduce("/:type/:categoryID/:todoID/", {
      type: "todo",
      categoryID: "an7yH"
    });
  }).isEqual("/todo/an7yH/");
}