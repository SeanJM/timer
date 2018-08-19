import normalize from "./normalize";
import join from "./join";
import pop from "./pop";
import splice from "./splice";
import push from "./push";
import params from "./params";

const path: {
  join: typeof join,
  normalize: typeof normalize,
  params: typeof params,
  pop: typeof pop,
  splice: typeof splice,
  push: typeof push,
} = {
  join,
  normalize,
  params,
  pop,
  splice,
  push,
};

export default path;
export * from "./params";