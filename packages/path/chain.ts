import replace from "./replace";
import replaceReduce from "./replace-reduce";
import join from "./join";
import normalize from "./normalize";
import params from "./params";
import pop from "./pop";
import push from "./push";
import splice from "./splice";
export default function chain(pathname: string) {
  const self = {
    value: pathname,

    replace(template: object) {
      this.value = replace(this.value, template);
      return this;
    },

    replaceReduce(template: object) {
      this.value = replaceReduce(this.value, template);
      return this;
    },

    join(...args: string[]) {
      this.value = join(this.value, ...args);
      return this;
    },

    normalize() {
      this.value = normalize(this.value);
      return this;
    },

    params(schema: string) {
      return params(this.value, schema);
    },

    pop(times: number = 1) {
      this.value = pop(this.value, times);
      return this;
    },

    push(...members: string[]) {
      this.value = push(this.value, ...members);
      return this;
    },

    splice(member: string, index: number, length?: number) {
      this.value = splice(this.value, member, index, length);
      return this;
    },
  };
  return self;
};