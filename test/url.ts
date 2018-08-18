import URL from "../frontend/src/class/url";

export default function (test) {
  test("URL", function () {
    const location = new URL("http://www.google.com/").location;
    return location;
  })
    .isDeepEqual({
      origin: "www.google.com",
      protocol: "http://",
      pathname: "/",
      href: "http://www.google.com/",
      hash: "",
      search: {}
    });

  test("URL: search", function () {
    const url = new URL("?firstName=Sean");
    return url.location
  })
    .isDeepEqual({
      protocol: "",
      origin: "",
      hash: "",
      href: "?firstName=Sean",
      pathname: "/",
      search: { firstName: "Sean" }
    });

  test("URL: toString", function () {
    return new URL({
      href: "http://www.google.com/",
    }).toString();
  })
    .isEqual("http://www.google.com/");

  test("URL: parseParameters", function () {
    return new URL({
      href: "/todo/category/98374fh",
    }).parseParameters("/todo/cagegory/:id");
  })
    .isDeepEqual({
      id: "98374fh"
    });
}