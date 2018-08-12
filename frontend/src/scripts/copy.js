export default function copy(x) {
  var i = -1;
  var n;
  var t;

  if (x) {
    if (Array.isArray(x)) {
      t = [];
      n = Math.min(x.length, 100000);
      while (++i < n) {
        t[i] = copy(x[i]);
      }
    } else if (typeof x === "object") {
      t = {};
      for (var k in x) {
        t[k] = copy(x[k]);
      }
    }
  }

  return t || x;
}