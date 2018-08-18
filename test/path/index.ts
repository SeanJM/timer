import path from "@path";

export default function (test) {
  test("path.splice", path.splice("/a/b/c/", "d", 1)).isEqual("/a/d/c/");
  test("path.splice", path.splice("/a/b/c/", "d", -1)).isEqual("/a/b/d/");
  test("path.splice", path.splice("/a/b/c/", "d", -2)).isEqual("/a/d/");
  test("path.splice", path.splice("/a/b/c/", "d", -2, 1)).isEqual("/a/d/c/");
  test("path.pop", path.pop("/a/b/c/")).isEqual("/a/b/");
  test("path.pop", path.pop("/a/b/c/d/", 2)).isEqual("/a/b/");
  test("path.push", path.push("/a/b/c/", "d")).isEqual("/a/b/c/d/");
  test("path.push (multiple arguments)", path.push("/a/b/c/", "d", "e")).isEqual("/a/b/c/d/e/");
}