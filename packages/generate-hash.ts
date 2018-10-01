const { round, random } = Math;
const r = (s) => s[round(random() * (s.length - 1))];

export default function generateHash(n: number = 32): string {
  let i = -1;
  let str = "";
  while (++i < n) {
    str += random() > 0.6
      ? r("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
      : r("0123456789");
  }
  return str;
}