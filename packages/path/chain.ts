import join from "./join";
import normalize from "./normalize";
import params from "./params";
import pop from "./pop";
import push from "./push";
import query from "@path/query";
import replace from "./replace";
import reduce from "@path/reduce";
import slice from "@path/slice";
import splice from "./splice";

export default function chain(pathname: string) {
  const self = {
    value: pathname,

    join(...args: string[]) {
      this.value = join(this.value, ...args);
      return this;
    },

    normalize() {
      this.value = normalize(this.value);
      return this;
    },

    params<T>(schema: string) {
      return params<T>(this.value, schema);
    },

    pop(times: number = 1) {
      this.value = pop(this.value, times);
      return this;
    },

    push(...members: string[]) {
      this.value = push(this.value, ...members);
      return this;
    },

    query() {
      return query(this.value);
    },

    replace(template: object) {
      this.value = replace(this.value, template);
      return this;
    },

    reduce(template: object) {
      this.value = reduce(this.value, template);
      return this;
    },

    splice(member: string, index: number, length?: number) {
      this.value = splice(this.value, member, index, length);
      return this;
    },

    slice(start?: number, end?: number) {
      this.value = slice(this.value, start, end);
      return this;
    },
  };
  return self;
}