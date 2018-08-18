const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alpha = "abcdefghijklmnopqrstuvwxyz";
const number = "0987654321";
const symbol = "$._-";

const byType = {
  A: ALPHA,
  a: alpha,
  N: number,
  "$": symbol,
};

const typeKeys = Object.keys(byType);

function generateByLength(index) {
  var id = "";

  while (index-- > 0) {
    let target = typeKeys[Math.round(Math.random() * (typeKeys.length - 1))];
    let type = byType[target];
    id += type[Math.round(Math.random() * (type.length - 1))];
  }

  return id;
}

function generateByPattern(index) {
  let id = "";
  let i = -1;
  const n = index.length;

  while (++i < n) {
    id += byType[index[i]]
      ? byType[index[i]][Math.floor(Math.random() * byType[index[i]].length)]
      : index[i];
  }

  return id;
}

export default function generateId(index: number | string = 12) {
  if (typeof index === "number") {
    return generateByLength(index)
  }
  return generateByPattern(index);
};