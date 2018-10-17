export default function (singlular: string, plural: string, length: number) {
  return length > 1 ? plural : singlular;
}