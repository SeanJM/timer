function r(s) { return s[Math.round(Math.random() * (s.length - 1))]; }

export default function generateHash(n: number = 32): string {
  let i = -1;
  let str = "";
  while (++i < n) {
    str += Math.random() > 0.6
      ? r("abcdef")
      : r("0123456789");
  }
  return str;
}