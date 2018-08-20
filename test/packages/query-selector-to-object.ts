import querySelectorToObjectList from "@query-selector-to-object";

export default function (test) {
  test("querySelectorToObject: '.class'", function () {
    return querySelectorToObjectList(".class");
  }).isDeepEqual([{
    attributes: {
      className: "class"
    }
  }]);

  test("querySelectorToObject: 'element'", function () {
    return querySelectorToObjectList("element");
  }).isDeepEqual([{
    type: "element",
    attributes: {}
  }]);

  test("querySelectorToObject: '.class1.class2'", function () {
    return querySelectorToObjectList(".class1.class2");
  }).isDeepEqual([{
    attributes: {
      className: "class1 class2"
    }
  }]);

  test("querySelectorToObject: 'element.class'", function () {
    return querySelectorToObjectList("element.class");
  }).isDeepEqual([{
    type: "element",
    attributes: {
      className: "class"
    }
  }]);

  test("querySelectorToObject: '[value=\"Here with space\"]'", function () {
    return querySelectorToObjectList("[value=\"Here with space\"]");
  }).isDeepEqual([{
    attributes: {
      value: "Here with space"
    }
  }]);
};