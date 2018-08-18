export default function padStart(
  string: string | number, 
  length: number, 
  character: string = " "): string {
  let pad = "";
  string = string + "";
  while (pad.length < length) {
    pad += character;
  }
  return pad.substring(string.length, length) + (string + "");
}
