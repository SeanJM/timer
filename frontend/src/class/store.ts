import { set, get } from "lodash";
import copy from "@frontend/scripts/copy";
import getPaths from "@frontend/scripts/get-paths";

export type OnChangeFunction<T> =
  (prevState: T, nextState: T) => void;

export type OnSetFunction<T> =
  (nextState: T) => void;

export type OnPathChangeFunction<T> =
  (prevValue: T, nextValue: T) => void;

export default class Store<T> {
  value: T;
  onchangeListeners: OnChangeFunction<T>[];
  onsetListeners: OnSetFunction<T>[];
  onpathset: {
    [key: string]: OnPathChangeFunction<T>[]
  };

  constructor(state: T) {
    this.value = state;
    this.onchangeListeners = [];
    this.onsetListeners = [];
    this.onpathset = {};
  }

  emitPathList(emitPathList: string[], prevState: T, nextState: T) {
    for (var k in this.onpathset) {
      if (emitPathList.indexOf(k) !== -1) {
        let prevValue = get(prevState, k);
        let nextValue = get(nextState, k);
        let onpathset = this.onpathset[k].slice();
        let i = -1;
        const n = onpathset.length;
        while (++i < n) {
          onpathset[i](prevValue, nextValue);
        }
      }
    }
    return this;
  }

  emitChange(prevState: T, nextState: T) {
    const onchangeListeners = this.onchangeListeners.slice();
    const onsetListeners = this.onsetListeners.slice();

    let i = -1;
    let n = onsetListeners.length;

    while (++i < n) {
      onsetListeners[i](nextState);
    }

    i = -1;
    n = onchangeListeners.length;
    while (++i < n) {
      let callback = onchangeListeners[i];
      callback(prevState, nextState);
    }
  }

  set(value: Partial<T>): this {
    const prevState = this.value;
    const paths = getPaths(value);
    const emitPathList: string[] = [];
    let i = -1;
    const n = paths.length;

    this.value = copy(this.value);

    while (++i < n) {
      let setPath = paths[i].slice(0, paths[i].length - 1);
      let setValue = paths[i][paths[i].length - 1];
      let x = 0;
      let y = setPath.length + 1;

      while (++x < y) {
        let setPathString = setPath.slice(0, x).join(".");
        if (emitPathList.indexOf(setPathString) === -1) {
          emitPathList.push(setPathString);
        }
      }

      set(this.value, setPath, setValue);
    }

    this.emitChange(
      prevState,
      this.value
    );

    this.emitPathList(
      emitPathList,
      prevState,
      this.value
    );

    return this;
  }

  onSet(callback: OnSetFunction<T>): this {
    this.onsetListeners.push(callback);
    return this;
  }

  onPathChange(path: string, callback: OnPathChangeFunction<T>): this {
    this.onpathset[path] = this.onpathset[path] || [];
    this.onpathset[path].push(callback);
    return this;
  }

  onChange(callback: OnChangeFunction<T>): this {
    this.onchangeListeners.push(callback);
    return this;
  }

  offChange(callback: OnChangeFunction<T>): this {
    this.onchangeListeners = this.onchangeListeners.filter((x) => x !== callback);
    return this;
  }
}