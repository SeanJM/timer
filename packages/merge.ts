function mergeArray(left, right) {
  let i = -1;
  const n = right.length;
  while (++i < n) {
    if (left.indexOf(right[i]) === -1) {
      if (Array.isArray(right[i])) {
        left.push(mergeRightToLeft([], right[i]));
      } else if (typeof right[i] === "object") {
        left.push(mergeRightToLeft({}, right[i]));
      } else {
        left.push(right[i]);
      }
    }
  }
  return left;
}

function mergeRightToLeftObject(left, right) {
  for (var k in right) {
    if (right.hasOwnProperty(k)) {
      if (Array.isArray(right[k])) {
        left[k] = merge([], left[k], right[k]);
      } else if (typeof right[k] === "object") {
        left[k] = merge({}, left[k], right[k]);
      } else {
        left[k] = right[k];
      }
    }
  }
  return left;
}

function mergeRightToLeft(left, right) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return mergeArray(left, right);
  } else if (typeof left === "object" && typeof right === "object") {
    return mergeRightToLeftObject(left, right);
  }
  return right;
}

export default function merge(a: any[], ...args: any[]): any[];
export default function merge(a: object, ...args: any[]): object;
export default function merge(a: null, ...args: any[]): object;
export default function merge(a, ...args: any[]) {
  let i = -1;
  const n = args.length;

  if (a == null) {
    a = {};
  }

  while (++i < n) {
    if (args[i]) {
      mergeRightToLeft(a, args[i]);
    }
  }

  return a;
}