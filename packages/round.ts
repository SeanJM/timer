export default function round(number: number, precision: number = 1) {
  const n = Math.pow(10, precision);
  return Math.round(number * n) / n;
}