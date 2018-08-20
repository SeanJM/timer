import appendChild from "./append-child";
import querySelector from "./query-selector";
import querySelectorAll from "./query-selector-all";

export default function (test) {
  appendChild(test);
  querySelector(test);
  querySelectorAll(test);
}