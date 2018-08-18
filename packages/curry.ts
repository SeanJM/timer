/**
 * @param {function} fn
 * @param {...*} any
 * @returns {function} While the arguments are incomplete, it returns another curried function
 */
export default function curry<G, T>(fn: (...args: any[]) => T, ...args: any[]): G {
  return args.length >= fn.length
    ? fn.apply(null, args)
    : function (...args2: any[]) {
      return curry.apply(null, [fn].concat(args.concat(args2)));
    };
}