import join from "./join";
import normalize from "./normalize";
import params from "./params";
import pop from "./pop";
import push from "./push";
import replace from "./replace";
import splice from "./splice";

type Path = {
  join: typeof join,
  normalize: typeof normalize,
  params: typeof params,
  pop: typeof pop,
  push: typeof push,
  replace: typeof replace,
  splice: typeof splice,
};

const path: Path = {
  join,
  normalize,
  params,
  pop,
  push,
  replace,
  splice,
};

export default path;
export * from "./params";