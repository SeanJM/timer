export default class Action {
  debug: boolean;
  __deferred: boolean;
  __subscribers: {
    [key: string]: ((value: any) => void)[]
  };

  constructor() {
    this.debug = false;
    this.__deferred = false;
    this.__subscribers = {};
  }

  subscribe(path: string, callback: (value: any) => void) {
    if (!this.__subscribers[path]) {
      this.__subscribers[path] = [];
    }
    this.__subscribers[path].push(callback);
    return this;
  }

  off(path, callback) {
    const s = this.__subscribers[path];
    if (callback) {
      s.splice(s.indexOf(callback), 1);
    } else {
      delete this.__subscribers[path];
    }
    return this;
  }

  dispatch(name: string, value: any) {
    let s = (this.__subscribers[name] || []);

    if (this.debug) {
      console.log(
        "%c ACTION %c (" + s.length + ") -> %c" + name + "\n",
        [
          "font-family: monospace",
          "font-weight: bold",
          "background: #3e3d7f",
          "color: #fff",
        ].join(";"),
        "color: #000; font-weight: bold; font-family: monospace;",
        "font-weight: normal; font-family: monospace;",
        value
      );
    }

    for (var i = 0, n = s.length; i < n; i++) {
      s[i](value);
    }
  }
}