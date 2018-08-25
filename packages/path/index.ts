import chain from "./chain";
import join from "./join";
import normalize from "./normalize";
import params from "./params";
import pop from "./pop";
import push from "./push";
import replace from "./replace";
import reduce from "./reduce";
import splice from "./splice";

type Path = {
  chain: typeof chain,
  join: typeof join,
  normalize: typeof normalize,
  params: typeof params,
  pop: typeof pop,
  push: typeof push,
  replace: typeof replace,
  reduce: typeof reduce,
  splice: typeof splice,
};

const path: Path = {
  chain,
  join,
  normalize,
  params,
  pop,
  push,
  replace,
  reduce,
  splice,
};

export default path;
export * from "./params";