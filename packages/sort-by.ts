// tslint:disable:no-default-export

type SortByFunction = (x: any) => string;

export function sortBy(key: SortByFunction): (a: any, b: any) => number;
export function sortBy(key: string): (a: any, b: any) => number;
export default function sortBy(key: any): (a: any, b: any) => number {
  let f;

  if (typeof key === "string") {
    f = (x) => x[key];
  } else if (typeof key === "function") {
    f = key;
  }

  return (a, b) => f(a) > f(b) ? 1 : -1;
}