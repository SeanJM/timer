// tslint:disable:no-default-export
export default function getHash(url: string) {
  const index = url.indexOf("#");
  return index === -1 ? null : url.substring(index);
}