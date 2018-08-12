import { debounce } from "lodash";
import getPaths from "@scripts/get-paths";

import Store, {
  OnChangeFunction,
  OnPathChangeFunction
} from "@class/store";

const validFirstCharacter = {
  "\"": true,
  "[": true,
  "{": true,
};

const INVALID = {
  "[object Object]": true,
};

const IS_VALID_VALUE = {
  "true": true,
  "false": true,
  "null": true,
};

function set(
  target: object,
  path: string[] | string,
  value: any
) {
  let p = Array.isArray(path)
    ? path
    : path.split(".");

  let i = -1;
  let o = target;
  const n = p.length - 1;

  while (++i < n) {
    if (!o[p[i]]) {
      o[p[i]] = {};
    } else if (Array.isArray(o[p[i]])) {
      o[p[i]] = Object.assign({}, o[p[i]]);
    }
    o = o[p[i]];
  }

  o[p[p.length - 1]] = value;
  return target;
}

type Ignore = RegExp[];

interface Settings {
  validator?: (state: object) => boolean;
  ignore?: Ignore;
}

export default class PersiStore<T> {
  /**
   *
   * @param {object} initialState
   * @param {object=} settings
   * @param {function} settings.validator
   */
  store: Store<T>;
  ignore: Ignore;
  value: T;
  saveLocalStorageDebounced: () => void;

  constructor(initialState: T, settings?: Settings) {
    let persistentState = Object.assign({}, initialState);
    const n = localStorage.length;
    let i = -1;

    settings = settings || {};
    this.ignore = settings.ignore || [];

    while (++i < n) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      if (
        this.isValidValue(value) &&
        !INVALID[value.substring(0, 15)] &&
        !this.isIgnored(key)
      ) {
        set(persistentState, key, JSON.parse(value));
      }
    }

    if (typeof settings.validator === "function" && !settings.validator(persistentState)) {
      console.log("Store is invalid - setting initial state");
      this.store = new Store<T>(initialState);
      this.value = this.store.value;
      localStorage.clear();
      this.saveLocalStorage();
    } else {
      console.log("Store is valid - setting initial state");
      this.store = new Store<T>(persistentState as T);
      this.value = this.store.value;
    }

    this.saveLocalStorageDebounced = debounce(() => this.saveLocalStorage(), 500);
    this.store.onSet((value) => {
      this.value = value;
      this.saveLocalStorageDebounced();
    });
  }

  isValidValue(value): boolean {
    return (
      IS_VALID_VALUE[value] ||
      /^[0-9.]+$/.test(value) ||
      validFirstCharacter[value[0]]);
  }

  isIgnored(setPath): boolean {
    let i = -1;
    let n = this.ignore.length;

    while (++i < n) {
      if (this.ignore[i].test(setPath)) {
        return true;
      }
    }

    return false;
  }

  saveLocalStorage(): this {
    const paths = getPaths(this.value);
    let i = -1;
    let n = paths.length;

    while (++i < n) {
      let setPath = paths[i].slice(0, -1).join(".");
      let value = paths[i].slice(-1)[0];
      if (!this.isIgnored(setPath)) {
        localStorage.setItem(
          setPath,
          JSON.stringify(value)
        );
      }
    }

    return this;
  }

  set(value: Partial<T>): this {
    this.store.set(value);
    return this;
  }

  onChange(callback: OnChangeFunction<T>): this {
    this.store.onChange(callback);
    return this;
  }

  onPathChange(path: string, callback: OnPathChangeFunction<T>): this {
    this.store.onPathChange(path, callback);
    return this;
  }

  offChange(callback): this {
    this.store.offChange(callback);
    return this;
  }
}