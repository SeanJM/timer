import _ from "lodash";

const EXCLUDED_PROPERTIES = {
  __deferred: true,
  __subsribers: true
};

function StoreEvent(props) {
  this.path = props.path;
  this.value = props.value;
  this.__store = props.__store;
}

StoreEvent.prototype.parentPath = function () {
  return this.path.split(".").slice(0, -1);
};

StoreEvent.prototype.parent = function () {
  return this.__store.get(
    this.parentPath()
  );
};

function Store(props) {
  const cache = {};

  let i = 0;
  let key;
  let value;

  for (; window.localStorage.key(i); i += 1) {
    key = window.localStorage.key(i);
    value = window.localStorage.getItem(key);
    if (value !== "undefined") {
      cache[key] = JSON.parse(value);
    }
  }

  _.assign(
    this,
    props,
    cache
  );

  this.__deferred = false;
  this.__subscribersRegExp = [];
  this.__subsribers = {};

  this.save();
}

Store.prototype.set = function (maybePathString, value) {
  let match;
  let path = [].concat(maybePathString).join(".");

  if (typeof this[path] === "function") {
    throw new Error(
      "[Store] Cannot set value \"" + path + "\", it is a reserved name."
    );
  } else if (
    !Array.isArray(maybePathString) &&
    typeof maybePathString === "object"
  ) {
    throw new Error(
      "[Store] Cannot use an object to set a value."
    );
  } else {
    _.set(this, path, value);
    this.trigger(path, value);

    for (var i = this.__subscribersRegExp.length - 1; i >= 0; i--) {
      match = path
        .match(
          this.__subscribersRegExp[i].match
        );

      if (match) {
        this.__subscribersRegExp[i]
          .callback({
            match: match,
            path: path,
            value: value
          });
      }
    }

    this.trigger("*", new StoreEvent({
      path: [].concat(path).join("."),
      value: value,
      __store: this
    }));
  }

  this.save();
  return this;
};

Store.prototype.assign = function (path, value) {
  Object.assign(this.get("path"), value);
  this.trigger(path, value);
  return this;
};

Store.prototype.get = function (path) {
  return _.get(this, [].concat(path).join("."));
};

Store.prototype.push = function (path, value) {
  const $path = [].concat(path).join(".");
  let list = _.get(this, $path);

  if (Array.isArray(list)) {
    list.push(value);
    this.trigger($path, list);
    this.trigger("*", new StoreEvent({
      path: $path,
      value: value,
      __store: this
    }));
    this.save();
  } else {
    throw new Error(
      "[Store] Invalid push target \"" + $path + "\""
    );
  }
};

Store.prototype.on = function (path, callback) {
  if (path instanceof RegExp) {
    this.__subscribersRegExp.push({
      match: path,
      callback: callback
    });
  } else {
    if (!this.__subsribers[path]) {
      this.__subsribers[path] = [];
    }

    this.__subsribers[path].push(callback);
    return this;
  }
};

Store.prototype.off = function (path, callback) {
  const s = this.__subsribers[path];

  if (path instanceof RegExp) {
    this.__subscribersRegExp = (
      this.__subscribersRegExp
        .filter(group => {
          return callback
            ? (
              group.path.toString() !== path.toString() &&
              group.callback !== callback
            ) : (
              group.path.toString() !== path.toString()
            );
        })
    );
  } else {
    if (callback) {
      s.splice(
        s.indexOf(callback),
        1
      );
    } else {
      delete this.__subsribers[path];
    }
  }

  return this;
};

Store.prototype.trigger = function (path, value) {
  const $path = [].concat(path).join(".");
  const s = this.__subsribers[$path];

  if (s) {
    for (var i = 0, n = s.length; i < n; i++) {
      s[i](value);
    }
  }

  return this;
};

Store.prototype.save = function () {
  clearTimeout(this.__deferred);
  this.__deferred = setTimeout(() => {
    this.__saved = new Date().getTime();
    for (var key in this) {
      if (
        this.hasOwnProperty(key) &&
        !EXCLUDED_PROPERTIES[key] &&
        typeof this[key] !== "function"
      ) {
        // console.log(key, JSON.stringify(this[key]));
        window.localStorage.setItem(
          key,
          JSON.stringify(this[key])
        );
      }
    }
  }, 50);

};

export default Store;