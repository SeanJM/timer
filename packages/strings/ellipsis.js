/**
 * Returns a string which is trucated with an ellipsis
 * @param {string} str
 * @param {number} length
 * @returns {string}
*/
export default function ellipsis(str, length) {
  let total = length - 1;
  let left = Math.floor(total * 0.7) - 3;
  let right = total - left - 3;
  return str.length > total
    ? str.substring(0, left) + "..." + str.substring(str.length - right)
    : str;
}