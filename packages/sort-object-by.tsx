// tslint:disable:no-default-export
export function sortObjectBy(key: (e: object) => string): (a: object, b: object) => number;
export function sortObjectBy(key: string): (a: object, b: object) => number;
export function sortObjectBy(key: any) {
  return (a: object, b: object) => {
    const isString = typeof key === "string";
    const keyA = isString ? a[key] : key(a);
    const keyB = isString ? b[key] : key(b);
    return keyA.toLowerCase() > keyB.toLowerCase() ? 1 : -1;
  };
}
export default sortObjectBy;