// tslint:disable:no-default-export

import _chain from "./chain";
import _join from "./join";
import _normalize from "./normalize";
import _params from "./params";
import _pathname from "./pathname";
import _pop from "./pop";
import _push from "./push";
import _query from "./query";
import _reduce from "./reduce";
import _replace from "./replace";
import _slice from "./slice";
import _splice from "./splice";

export function path(pathname: string) {
  return _chain(pathname);
}

export namespace path {
  export const chain = _chain;
  export const join = _join;
  export const normalize = _normalize;
  export const params = _params;
  export const pathname = _pathname;
  export const pop = _pop;
  export const push = _push;
  export const query = _query;
  export const reduce = _reduce;
  export const replace = _replace;
  export const slice = _slice;
  export const splice = _splice;
}

export default path;
export * from "./params";
export * from "./query";