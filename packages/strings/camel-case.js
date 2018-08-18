/**
 * Returns a camelCased string
 * ---
 * Based on this example: https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 * @param {string} string - The string to camelCase
 * @return {string}
*/
export default function camelCase() {
  let i = -1;
  const n = arguments.length;
  const result = [];

  while (++i < n) {
    result.push(
      (arguments[i] || "")
        .match(/[a-zA-Z0-9]+|/g)
        .join(" ")
        .replace(/(?:^\w|\b\w|\s+)/g, (a, index) => {
          return isNaN(+a)
            ? index
              ? a.toUpperCase()
              : a.toLowerCase()
            : "";
        })
    );
  }

  return result.length > 1
    ? camelCase(result.join(" "))
    : result.join();
}
