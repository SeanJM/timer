/**
 * @param {function} fn
 * @param {...*} any
 * @returns {function} While the arguments are incomplete, it returns another curried function
 */
export default function curry(fn: <T>(...args: any[]) => T) {
  const args = [];
  let i = 0;
  const n = arguments.length;

  while (++i < n) {
    args.push(arguments[i]);
  }

  return args.length >= fn.length
    ? fn.apply(null, args)
    : function () {
      let i = -1;
      const n = arguments.length;
      const args2 = [];

      while (++i < n) {
        args2.push(arguments[i]);
      }

      return curry.apply(null, [fn].concat(args.concat(args2)));
    };
}