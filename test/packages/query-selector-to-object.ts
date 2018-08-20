import querySelectorToObject from "@query-selector-to-object";

export default function (test) {
  test("querySelectorToObject: '.class'", function () {
    return querySelectorToObject(".class");
  }).isDeepEqual({
    attributes: {
      className: "class"
    }
  });

  test("querySelectorToObject: 'element'", function () {
    return querySelectorToObject("element");
  }).isDeepEqual({
    type: "element",
    attributes: {}
  });

  test("querySelectorToObject: 'element.class'", function () {
    return querySelectorToObject("element.class");
  }).isDeepEqual({
    type: "element",
    attributes: {
      className: "class"
    }
  });
};