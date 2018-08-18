export default function padEnd(
  string: string | number, 
  length: number, 
  character = " "): string {
  let pad = "";
  string = string + "";
  while (pad.length < length) {
    pad += character;
  }
  return (string + "") + pad.substring(string.length, length);
}
