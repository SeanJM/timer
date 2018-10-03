/**
 * Will return an array of matching indexes in a string
 * @param {string} string String to match against
 * @param {string} match
 */
export default function indexesOf(string, match) {
  let i = string.indexOf(match);
  let max = 100;
  const indexes = [];
  while (--max > 0 && i > -1) {
    indexes.push(i);
    i = string.indexOf(match, i + match.length);
  }
  return indexes;
}
