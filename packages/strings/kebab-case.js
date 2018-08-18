/**
 * Returns a kebab-case string
 * ---
 * @param {string} string - The string to kebab-case
 * @return {string}
*/

const expression = /(?:[0-9]+|[A-Z][a-z]+|[a-z]+|\s+)/g;

function replace(a, i) {
  return !/\s/.test(a) ? (i ? "-" : "") + a.toLowerCase() : "";
}

export default function kebabCase() {
  let i = -1;
  const n = arguments.length;
  const result = [];

  while (++i < n) {
    result.push(
      (arguments[i] || "")
        .match(/[a-zA-Z0-9]+|/g)
        .filter((a) => /[a-zA-Z0-9]+/.test(a))
        .join(" ")
        .replace(expression, replace)
    );
  }

  return result.join("-");
}
