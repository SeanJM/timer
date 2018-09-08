// tslint:disable:no-default-export

import _chain from "./chain";
import _join from "./join";
import _normalize from "./normalize";
import _params from "./params";
import _pop from "./pop";
import _push from "./push";
import _replace from "./replace";
import _reduce from "./reduce";
import _splice from "./splice";
import _slice from "./slice";
import _query from "./query";

export function path(pathname: string) {
  return _chain(pathname);
}

export namespace path {
  export const chain = _chain;
  export const join = _join;
  export const normalize = _normalize;
  export const params = _params;
  export const pop = _pop;
  export const push = _push;
  export const replace = _replace;
  export const reduce = _reduce;
  export const splice = _splice;
  export const slice = _slice;
  export const query = _query;
}

export default path;
export * from "./params";
export * from "./query";