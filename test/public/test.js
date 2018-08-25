/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./backend/src/class/database.ts":
/*!***************************************!*\
  !*** ./backend/src/class/database.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const util_1 = __webpack_require__(/*! util */ "util");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const element_1 = __importDefault(__webpack_require__(/*! ./element */ "./backend/src/class/element.ts"));
const writeFile = util_1.promisify(fs.writeFile);
function toElement(node, idList) {
    if (node.children) {
        let element = new element_1.default(node.type, node.attributes, node.children.map((child) => toElement(child, idList)));
        if (element.attributes.id) {
            idList[element.attributes.id] = element;
        }
        return element;
    }
    return node;
}
class Database {
    constructor(filename) {
        const str = fs_1.readFileSync(filename, "utf8");
        this.filename = filename;
        this.idList = {};
        this.body = str.length
            ? toElement(JSON.parse(str), this.idList)
            : this.createElement({ id: "body" });
    }
    createElement(...args) {
        let type = "element";
        let attributes = {};
        let children = [];
        let i = -1;
        const n = args.length;
        while (++i < n) {
            if (typeof args[i] === "string" && i === 0) {
                type = args[i];
            }
            else if (typeof args[i] === "string") {
                children.push(args[i]);
            }
            else if (Array.isArray(args[i])) {
                Array.prototype.push.apply(children, args[i]);
            }
            else if (typeof args[i] === "object") {
                Object.assign(attributes, args[i]);
            }
        }
        let element = new element_1.default(type, attributes, children);
        if (element.attributes.id) {
            this.idList[element.attributes.id] = element;
        }
        return element;
    }
    save() {
        const string = JSON.stringify(this.body, null, "  ");
        return writeFile(this.filename, string)
            .catch((e) => console.error(e));
    }
    getElementById(id) {
        return this.idList[id];
    }
}
exports.default = Database;


/***/ }),

/***/ "./backend/src/class/element.ts":
/*!**************************************!*\
  !*** ./backend/src/class/element.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _query_selector_to_object_1 = __importDefault(__webpack_require__(/*! @query-selector-to-object */ "./packages/query-selector-to-object.ts"));
function findElementFromQuery(node, index, queryObject) {
    let i = -1;
    const query = queryObject[index];
    const n = node.children
        ? node.children.length
        : 0;
    while (++i < n) {
        if (node.children[i] instanceof Element) {
            let child = node.children[i];
            if (child.is(query)) {
                if (index === queryObject.length - 1) {
                    return child;
                }
                else {
                    let c = findElementFromQuery(child, index + 1, queryObject);
                    if (c) {
                        return c;
                    }
                }
            }
            else {
                let c = findElementFromQuery(child, index, queryObject);
                if (c) {
                    return c;
                }
            }
        }
    }
    return null;
}
function findElementsFromQuery(node, index, queryObject) {
    const n = node.children ? node.children.length : 0;
    const children = [];
    const query = queryObject[index];
    let i = -1;
    while (++i < n) {
        let child = node.children[i];
        if (child instanceof Element) {
            if (child.is(query)) {
                if (index === queryObject.length - 1) {
                    children.push(child);
                }
                if (queryObject[index + 1]) {
                    [].push.apply(children, findElementsFromQuery(child, index + 1, queryObject));
                }
            }
            else {
                [].push.apply(children, findElementsFromQuery(child, index, queryObject));
            }
        }
    }
    return children;
}
class Element {
    constructor(type, attributes, children) {
        let i = -1;
        const n = children.length;
        this.type = type;
        this.attributes = attributes;
        this.children = children;
        while (++i < n) {
            if (children[i] instanceof Element) {
                children[i].parentNode = this;
            }
        }
    }
    setAttributes() {
        if (typeof arguments[0] === "object") {
            Object.assign(this.attributes, arguments[0]);
        }
        else {
            this.attributes[arguments[0]] = arguments[1];
        }
        return this;
    }
    is(query) {
        if (query.type && query.type !== this.type) {
            return false;
        }
        for (var k in query.attributes) {
            if (query.attributes[k] instanceof RegExp) {
                if (!query.attributes[k].test(this.attributes[k])) {
                    return false;
                }
            }
            else if (k === "className") {
                if (this.attributes[k]) {
                    let i = -1;
                    const queryClassList = query.attributes[k].split(" ");
                    const elementClassList = this.attributes[k].split(" ");
                    const n = queryClassList.length;
                    while (++i < n) {
                        if (elementClassList.indexOf(queryClassList[i]) === -1) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else if (query.attributes[k] !== this.attributes[k]) {
                return false;
            }
        }
        return true;
    }
    querySelectorAll(selector) {
        const queryObjectList = _query_selector_to_object_1.default(selector);
        return findElementsFromQuery(this, 0, queryObjectList);
    }
    querySelector(selector) {
        const queryObjectList = _query_selector_to_object_1.default(selector);
        return findElementFromQuery(this, 0, queryObjectList);
    }
    toJSON() {
        return {
            type: this.type,
            attributes: this.attributes,
            children: this.children,
        };
    }
    appendChild(child) {
        this.children.push(child);
        if (child instanceof Element) {
            child.parentNode = this;
        }
        return this;
    }
    removeChild(child) {
        this.children = this.children.filter((c) => c !== child);
        return this;
    }
}
exports.default = Element;


/***/ }),

/***/ "./frontend/src/class/url.ts":
/*!***********************************!*\
  !*** ./frontend/src/class/url.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class URL {
    constructor(x) {
        this.location = {
            search: {},
            origin: "",
            protocol: "",
            pathname: "",
            hash: "",
            href: "",
        };
        if (typeof x === "string") {
            this.stringToLocation(x);
        }
        else if (typeof x === "object") {
            this.setLocation(x);
        }
    }
    getOrigin(href) {
        let strip = href.replace(/http(s|):\/\//, "");
        let end = strip.indexOf("/");
        if (end === -1) {
            end = strip.length;
        }
        strip = strip.substring(0, end);
        if (/\.[a-z]+$/.test(strip)) {
            return strip;
        }
        return "";
    }
    getProtocol(href) {
        if (href.indexOf("http://") === 0) {
            return "http://";
        }
        else if (href.indexOf("https://") === 0) {
            return "https://";
        }
        return "";
    }
    searchToString() {
        let res = [];
        for (var k in this.location.search) {
            res.push(k + "=" + this.location.search[k]);
        }
        return res.length ? "?" + encodeURI(res.join("&")) : "";
    }
    getSearchObject(href) {
        const indexOf = href.indexOf("?");
        const search = href.substring(indexOf + 1);
        const result = {};
        if (indexOf > -1) {
            search.split("&").forEach((searchParam) => {
                const s = searchParam.split("=");
                result[s[0]] = s[1];
            });
        }
        return result;
    }
    getHash(href) {
        const indexOf = href.indexOf("#");
        return indexOf > -1 ? "#" + href.substring(indexOf) : "";
    }
    getPathname(href) {
        let strip = href.replace(/^http(s|):\/\//, "");
        const indexOf = strip.indexOf("/");
        if (indexOf > -1) {
            return strip.substring(indexOf);
        }
        return "/";
    }
    setLocation(x) {
        const prevLocation = Object.assign({}, this.location);
        if (x.href) {
            this.stringToLocation(x.href);
        }
        else {
            Object.assign(this.location, x, {
                search: typeof x.search === "string"
                    ? this.getSearchObject(x.search)
                    : typeof x.search === "object"
                        ? x.search
                        : prevLocation.search
            });
        }
    }
    stringToLocation(href) {
        const pathname = this.getPathname(href);
        const search = this.getSearchObject(href);
        const hash = this.getHash(href);
        const origin = this.getOrigin(href);
        const protocol = this.getProtocol(href);
        this.location = {
            protocol,
            origin,
            hash: hash,
            href: href,
            pathname: pathname,
            search,
        };
    }
    parseParameters(parameters) {
        const list = parameters.split("/").filter(a => a.length);
        const path = this.location.pathname.split("/").filter(a => a.length);
        let i = -1;
        const n = list.length;
        const res = {};
        while (++i < n) {
            if (list[i][0] === ":") {
                res[list[i].substring(1)] = path[i];
            }
            if (!path[i]) {
                return false;
            }
        }
        return res;
    }
    toString() {
        return (this.location.protocol +
            this.location.origin +
            this.location.pathname +
            this.searchToString());
    }
}
exports.default = URL;


/***/ }),

/***/ "./packages/path/chain.ts":
/*!********************************!*\
  !*** ./packages/path/chain.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replace_1 = __importDefault(__webpack_require__(/*! ./replace */ "./packages/path/replace.ts"));
const reduce_1 = __importDefault(__webpack_require__(/*! @path/reduce */ "./packages/path/reduce.ts"));
const join_1 = __importDefault(__webpack_require__(/*! ./join */ "./packages/path/join.ts"));
const normalize_1 = __importDefault(__webpack_require__(/*! ./normalize */ "./packages/path/normalize.ts"));
const params_1 = __importDefault(__webpack_require__(/*! ./params */ "./packages/path/params.ts"));
const pop_1 = __importDefault(__webpack_require__(/*! ./pop */ "./packages/path/pop.ts"));
const push_1 = __importDefault(__webpack_require__(/*! ./push */ "./packages/path/push.ts"));
const splice_1 = __importDefault(__webpack_require__(/*! ./splice */ "./packages/path/splice.ts"));
function chain(pathname) {
    const self = {
        value: pathname,
        replace(template) {
            this.value = replace_1.default(this.value, template);
            return this;
        },
        replaceReduce(template) {
            this.value = reduce_1.default(this.value, template);
            return this;
        },
        join(...args) {
            this.value = join_1.default(this.value, ...args);
            return this;
        },
        normalize() {
            this.value = normalize_1.default(this.value);
            return this;
        },
        params(schema) {
            return params_1.default(this.value, schema);
        },
        pop(times = 1) {
            this.value = pop_1.default(this.value, times);
            return this;
        },
        push(...members) {
            this.value = push_1.default(this.value, ...members);
            return this;
        },
        splice(member, index, length) {
            this.value = splice_1.default(this.value, member, index, length);
            return this;
        },
    };
    return self;
}
exports.default = chain;
;


/***/ }),

/***/ "./packages/path/index.ts":
/*!********************************!*\
  !*** ./packages/path/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chain_1 = __importDefault(__webpack_require__(/*! ./chain */ "./packages/path/chain.ts"));
const join_1 = __importDefault(__webpack_require__(/*! ./join */ "./packages/path/join.ts"));
const normalize_1 = __importDefault(__webpack_require__(/*! ./normalize */ "./packages/path/normalize.ts"));
const params_1 = __importDefault(__webpack_require__(/*! ./params */ "./packages/path/params.ts"));
const pop_1 = __importDefault(__webpack_require__(/*! ./pop */ "./packages/path/pop.ts"));
const push_1 = __importDefault(__webpack_require__(/*! ./push */ "./packages/path/push.ts"));
const replace_1 = __importDefault(__webpack_require__(/*! ./replace */ "./packages/path/replace.ts"));
const reduce_1 = __importDefault(__webpack_require__(/*! ./reduce */ "./packages/path/reduce.ts"));
const splice_1 = __importDefault(__webpack_require__(/*! ./splice */ "./packages/path/splice.ts"));
const path = {
    chain: chain_1.default,
    join: join_1.default,
    normalize: normalize_1.default,
    params: params_1.default,
    pop: pop_1.default,
    push: push_1.default,
    replace: replace_1.default,
    reduce: reduce_1.default,
    splice: splice_1.default,
};
exports.default = path;
__export(__webpack_require__(/*! ./params */ "./packages/path/params.ts"));


/***/ }),

/***/ "./packages/path/join.ts":
/*!*******************************!*\
  !*** ./packages/path/join.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
const normalize_1 = __importDefault(__webpack_require__(/*! @path/normalize */ "./packages/path/normalize.ts"));
function join(...pathname) {
    let i = -1;
    const p = parse_1.default(pathname[0]);
    const n = pathname.length;
    const res = [];
    while (++i < n) {
        res.push(normalize_1.default(pathname[i]));
    }
    return p.root + res.join("/") + "/";
}
exports.default = join;


/***/ }),

/***/ "./packages/path/normalize.ts":
/*!************************************!*\
  !*** ./packages/path/normalize.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function normalize(pathname) {
    let i = -1;
    const p = pathname.split("/");
    const n = p.length;
    const res = [];
    while (++i < n) {
        if (p[i]) {
            res.push(p[i]);
        }
    }
    return res.join("/");
}
exports.default = normalize;
;


/***/ }),

/***/ "./packages/path/params.ts":
/*!*********************************!*\
  !*** ./packages/path/params.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
function isMatch(query, url) {
    return query === url || (query && url && query[0] === ":");
}
function params(pathname = "", schema = "") {
    const urlPathname = parse_1.default(pathname).chunks;
    const queryPathname = parse_1.default(schema).chunks;
    const params = {
        __exact: true,
        __match: true,
        __pathname: urlPathname,
        __schema: queryPathname,
    };
    if (queryPathname) {
        let i = -1;
        const n = Math.max(queryPathname.length, urlPathname.length);
        while (++i < n) {
            if (i < queryPathname.length && !isMatch(queryPathname[i], urlPathname[i])) {
                params.__match = false;
            }
            if (!isMatch(queryPathname[i], urlPathname[i])) {
                params.__exact = false;
            }
            if (queryPathname[i] && queryPathname[i][0] === ":") {
                params[queryPathname[i].substring(1)] = urlPathname[i];
            }
        }
    }
    return params;
}
exports.default = params;


/***/ }),

/***/ "./packages/path/parse.ts":
/*!********************************!*\
  !*** ./packages/path/parse.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = __importDefault(__webpack_require__(/*! @path/normalize */ "./packages/path/normalize.ts"));
function parse(pathname) {
    const p = normalize_1.default(pathname);
    const chunks = p.split("/");
    return {
        chunks,
        isRelative: pathname[0] !== "/",
        root: pathname[0] === "/" ? "/" : "",
    };
}
exports.default = parse;


/***/ }),

/***/ "./packages/path/pop.ts":
/*!******************************!*\
  !*** ./packages/path/pop.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
function pop(pathname, times = 1) {
    const p = parse_1.default(pathname);
    let i = -1;
    while (++i < times) {
        p.chunks.pop();
    }
    return p.root + p.chunks.join("/") + "/";
}
exports.default = pop;
;


/***/ }),

/***/ "./packages/path/push.ts":
/*!*******************************!*\
  !*** ./packages/path/push.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = __importDefault(__webpack_require__(/*! @path/normalize */ "./packages/path/normalize.ts"));
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
function push(pathname, ...members) {
    const p = parse_1.default(pathname);
    const m = members.map((member) => normalize_1.default(member));
    Array.prototype.push.apply(p.chunks, m);
    return p.root + p.chunks.join("/") + "/";
}
exports.default = push;


/***/ }),

/***/ "./packages/path/reduce.ts":
/*!*********************************!*\
  !*** ./packages/path/reduce.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
function reduceReplace(schema, params) {
    const p = parse_1.default(schema);
    const n = p.chunks.length;
    let i = -1;
    let res = [];
    let cache;
    let isSchema;
    while (++i < n) {
        isSchema = p.chunks[i][0] === ":";
        cache = isSchema && params[p.chunks[i].substring(1)];
        if (cache === true || !isSchema) {
            res.push(p.chunks[i]);
        }
        else if (cache) {
            res.push(cache);
        }
    }
    return p.root + res.join("/") + "/";
}
exports.default = reduceReplace;


/***/ }),

/***/ "./packages/path/replace.ts":
/*!**********************************!*\
  !*** ./packages/path/replace.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
function replace(schema, params) {
    const p = parse_1.default(schema);
    const n = p.chunks.length;
    let i = -1;
    let res = [];
    let cache;
    while (++i < n) {
        cache = p.chunks[i][0] === ":" && params[p.chunks[i].substring(1)];
        if (cache) {
            res.push(cache);
        }
        else {
            res.push(p.chunks[i]);
        }
    }
    return p.root + res.join("/") + "/";
}
exports.default = replace;


/***/ }),

/***/ "./packages/path/splice.ts":
/*!*********************************!*\
  !*** ./packages/path/splice.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = __importDefault(__webpack_require__(/*! @path/parse */ "./packages/path/parse.ts"));
const normalize_1 = __importDefault(__webpack_require__(/*! @path/normalize */ "./packages/path/normalize.ts"));
function splice(pathname, member, index, length) {
    const p = parse_1.default(pathname);
    const m = normalize_1.default(member);
    if (index < 0 && typeof length === "undefined") {
        p.chunks.splice(p.chunks.length + index, p.chunks.length, m);
    }
    else {
        p.chunks.splice(index, length || index, m);
    }
    return p.root + p.chunks.join("/") + "/";
}
exports.default = splice;
;


/***/ }),

/***/ "./packages/query-selector-to-object.ts":
/*!**********************************************!*\
  !*** ./packages/query-selector-to-object.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function querySelectorToObjectList(selector) {
    const queryList = [];
    let attributes = {};
    let queryObject = {
        attributes,
    };
    let i = -1;
    let c;
    const n = selector.length;
    const boundary = {
        " ": true,
        ".": true,
        "[": true,
        "]": true,
        "#": true,
        ">": true,
    };
    while (++i < n) {
        if (/[a-zA-Z]/.test(selector[i])) {
            queryObject.type = "";
            while (selector[i] && !boundary[selector[i]]) {
                queryObject.type += selector[i];
                i += 1;
            }
            i -= 1;
        }
        if (selector[i] === "#") {
            attributes.id = "";
            i += 1;
            while (selector[i] && !boundary[selector[i]]) {
                attributes.id += selector[i];
                i += 1;
            }
            i -= 1;
        }
        if (selector[i] === ".") {
            attributes.className = attributes.className ? attributes.className + " " : "";
            i += 1;
            while (selector[i] && !boundary[selector[i]]) {
                attributes.className += selector[i];
                i += 1;
            }
            i -= 1;
        }
        if (selector[i] === "[") {
            c = [""];
            i += 1;
            while (selector[i] && selector[i] !== "]") {
                c[0] += selector[i];
                i += 1;
            }
            c[1] = c[0].match(/[A-Za-z\-\_]+|/)[0];
            c[2] = c[0].match(/[\^|\*|\$]=|/)[0][0];
            c[3] = (c[0].match(/=[^\]]+$/) || [""])[0].substring(1).replace(/^"|"$/g, "");
            if (c[2] === "^") {
                c[4] = new RegExp("^" + c[3]);
            }
            else if (c[2] === "$") {
                c[4] = new RegExp(c[3] + "$");
            }
            else if (c[2] === "*") {
                c[4] = new RegExp(c[3]);
            }
            else {
                c[4] = c[3];
            }
            attributes[c[0].match(/[A-Za-z\-\_]+|/)[0]] = c[4];
            i -= 1;
        }
        if (selector[i] === " " || i === n - 1) {
            queryList.push(queryObject);
            attributes = {};
            queryObject = {
                attributes,
            };
        }
    }
    return queryList;
}
exports.default = querySelectorToObjectList;


/***/ }),

/***/ "./test/components/index.ts":
/*!**********************************!*\
  !*** ./test/components/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(test) {
}
exports.default = default_1;


/***/ }),

/***/ "./test/database/index.ts":
/*!********************************!*\
  !*** ./test/database/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const database_1 = __importDefault(__webpack_require__(/*! @class/database */ "./backend/src/class/database.ts"));
const verified_1 = __importDefault(__webpack_require__(/*! verified */ "verified"));
fs.writeFileSync(path.resolve(__dirname, "test.json"), "");
const database = new database_1.default(path.resolve(__dirname, "test.json"));
function default_1(test) {
    test("Database: createElement", function () {
        const element = database.createElement({
            id: "test",
            created: new Date().getTime(),
        }, [true]);
        return new verified_1.default({
            type: "string",
            attributes: {
                id: "test",
                created: "number",
            },
            children: "any[]",
        }).validate(element).isValid;
    }).isEqual(true);
    test("Database: createElement", function () {
        const element = database.createElement("div", {
            id: "test",
            created: new Date().getTime(),
        }, [true]);
        return new verified_1.default({
            type: "div",
            attributes: {
                id: "test",
                created: "number",
            },
            children: "any[]",
        }).validate(element).isValid;
    }).isEqual(true);
    test("Database: createElement (child is boolean)", function () {
        const element = database.createElement([false]);
        return new verified_1.default({
            type: "element",
            children: "any[]",
            attributes: "object",
        }).validate(element).isValid;
    }).isEqual(true);
    test("Database: persistence", function () {
        const db = new database_1.default(path.resolve(__dirname, "../elements.json"));
        return new verified_1.default({
            type: "category",
            attributes: {
                id: "0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg",
                "[string]?": "any",
            },
            "[string]?": "any",
        })
            .validate(db.getElementById("0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg")).isValid;
    }).isEqual(true);
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(this, "test/database"))

/***/ }),

/***/ "./test/element/append-child.ts":
/*!**************************************!*\
  !*** ./test/element/append-child.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const database_1 = __importDefault(__webpack_require__(/*! @class/database */ "./backend/src/class/database.ts"));
const verified_1 = __importDefault(__webpack_require__(/*! verified */ "verified"));
fs.writeFileSync(path.resolve(__dirname, "test.json"), "");
const database = new database_1.default(path.resolve(__dirname, "test.json"));
function default_1(test) {
    test("Element: appendChild", function () {
        const a = database.createElement("div");
        const b = database.createElement("span");
        const body = database.body;
        body.appendChild(a);
        a.appendChild(b);
        return body.children.indexOf(a) > -1 && a.children.indexOf(b) > -1;
    }).isEqual(true);
    test("Element: appendChild as string", function () {
        const element = database.body.appendChild("Child");
        return element.children.find(a => a === "Child");
    }).isEqual("Child");
    test("Element: removeChild", function () {
        let a = database.createElement("div", { id: "98a" });
        let b = database.createElement("div", { id: "071k" });
        database.body.appendChild(a);
        database.body.appendChild(b);
        database.body.removeChild(b);
        return (database.body.querySelector("#071k") === null &&
            !!database.body.querySelector("#98a"));
    }).isEqual(true);
    test("Element: setAttirbute", function () {
        let a = database.createElement("div", { id: "98a" });
        a.setAttributes("created", new Date().getTime());
        a.setAttributes("id", "someId");
        return new verified_1.default({ created: "number", id: "string" }).validate(a.attributes).isValid;
    }).isEqual(true);
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(this, "test/element"))

/***/ }),

/***/ "./test/element/index.ts":
/*!*******************************!*\
  !*** ./test/element/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const append_child_1 = __importDefault(__webpack_require__(/*! ./append-child */ "./test/element/append-child.ts"));
const query_selector_1 = __importDefault(__webpack_require__(/*! ./query-selector */ "./test/element/query-selector.ts"));
const query_selector_all_1 = __importDefault(__webpack_require__(/*! ./query-selector-all */ "./test/element/query-selector-all.ts"));
function default_1(test) {
    append_child_1.default(test);
    query_selector_1.default(test);
    query_selector_all_1.default(test);
}
exports.default = default_1;


/***/ }),

/***/ "./test/element/query-selector-all.ts":
/*!********************************************!*\
  !*** ./test/element/query-selector-all.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const database_1 = __importDefault(__webpack_require__(/*! @class/database */ "./backend/src/class/database.ts"));
fs.writeFileSync(path.resolve(__dirname, "test.json"), "");
const database = new database_1.default(path.resolve(__dirname, "test.json"));
function default_1(test) {
    test("Element: querySelectorAll (tag)", function () {
        const parentNode = database.createElement();
        const tags = [
            database.createElement("tag", { className: "test" }),
            database.createElement("tag", { className: "test" })
        ];
        let res;
        parentNode
            .appendChild(database.createElement({ id: "76l" }))
            .appendChild(database.createElement({ id: "bnm" }))
            .appendChild(tags[0])
            .appendChild(tags[1])
            .appendChild(database.createElement());
        res = parentNode.querySelectorAll("tag");
        return (res[0] === tags[0] &&
            res[1] === tags[1]);
    }).isEqual(true);
    test("Element: querySelectorAll variable nesting (tag)", function () {
        const parentNode = database.createElement();
        const tags = [
            database.createElement("tag", { className: "test" }),
            database.createElement("tag", { className: "test" })
        ];
        let res;
        parentNode
            .appendChild(database.createElement({ id: "76l" }))
            .appendChild(database.createElement({ id: "bnm" }))
            .appendChild(database.createElement().appendChild(tags[0]))
            .appendChild(tags[1])
            .appendChild(database.createElement());
        res = parentNode.querySelectorAll("tag");
        return (res[0] === tags[0] &&
            res[1] === tags[1]);
    }).isEqual(true);
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(this, "test/element"))

/***/ }),

/***/ "./test/element/query-selector.ts":
/*!****************************************!*\
  !*** ./test/element/query-selector.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const database_1 = __importDefault(__webpack_require__(/*! @class/database */ "./backend/src/class/database.ts"));
const verified_1 = __importDefault(__webpack_require__(/*! verified */ "verified"));
fs.writeFileSync(path.resolve(__dirname, "test.json"), "");
const database = new database_1.default(path.resolve(__dirname, "test.json"));
function default_1(test) {
    test("Element: querySelector (#9jh tag)", function () {
        const validator = new verified_1.default({
            type: "tag",
            attributes: {
                id: "72h"
            },
            children: "any[]",
            parentNode: "object",
        });
        let parentElement = database.createElement({ id: "9jh" });
        database.body.appendChild(database.createElement({ id: "76l" }));
        database.body.appendChild(database.createElement({ id: "bnm" }));
        database.body.appendChild(parentElement);
        parentElement.appendChild(database.createElement({ id: "76h" }));
        parentElement.appendChild(database.createElement("tag", { id: "72h" }));
        parentElement.appendChild(database.createElement({ id: "1ef" }));
        return validator.validate(database.body.querySelector("#9jh tag")).isValid;
    }).isEqual(true);
    test("Element: querySelector with skipping parent (#9jh tag)", function () {
        const validator = new verified_1.default({
            type: "tag",
            attributes: {
                id: "72h"
            },
            children: "any[]",
            parentNode: "object",
        });
        let parentElement = database.createElement({ id: "9jh" });
        let childElement = database.createElement({ id: "kj7" });
        database.body.appendChild(database.createElement({ id: "76l" }));
        database.body.appendChild(database.createElement({ id: "bnm" }));
        database.body.appendChild(parentElement);
        parentElement.appendChild(childElement);
        childElement.appendChild(database.createElement({ id: "76h" }));
        childElement.appendChild(database.createElement("tag", { id: "72h" }));
        childElement.appendChild(database.createElement({ id: "1ef" }));
        return validator.validate(database.body.querySelector("#9jh tag")).isValid;
    }).isEqual(true);
    test("Element: querySelector with deep parents (.parent .class tag)", function () {
        const validator = new verified_1.default({
            type: "tag",
            attributes: {
                className: "class"
            },
            children: "any[]",
            parentNode: "object",
        });
        let childElement = database.createElement();
        let tagElement = database.createElement("tag", { className: "class" });
        database.body.appendChild(database.createElement()
            .appendChild(database.createElement({
            className: "parent"
        })
            .appendChild(childElement
            .appendChild(database.createElement()
            .appendChild(database.createElement({ className: "class" })
            .appendChild(database.createElement()
            .appendChild(tagElement)))))));
        return validator.validate(database.body.querySelector(".parent .class tag")).isValid;
    }).isEqual(true);
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(this, "test/element"))

/***/ }),

/***/ "./test/index.ts":
/*!***********************!*\
  !*** ./test/index.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tiny_test_1 = __importDefault(__webpack_require__(/*! tiny-test */ "tiny-test"));
const url_1 = __importDefault(__webpack_require__(/*! ./url */ "./test/url.ts"));
const components_1 = __importDefault(__webpack_require__(/*! ./components */ "./test/components/index.ts"));
const database_1 = __importDefault(__webpack_require__(/*! ./database */ "./test/database/index.ts"));
const element_1 = __importDefault(__webpack_require__(/*! ./element */ "./test/element/index.ts"));
const path_1 = __importDefault(__webpack_require__(/*! ./path */ "./test/path/index.ts"));
const packages_1 = __importDefault(__webpack_require__(/*! ./packages */ "./test/packages/index.ts"));
let settings = {
    components: true,
    database: true,
    element: true,
    packages: true,
    path: true,
    url: true,
};
tiny_test_1.default(function (test, load) {
    if (settings.components)
        components_1.default(test);
    if (settings.database)
        database_1.default(test);
    if (settings.element)
        element_1.default(test);
    if (settings.packages)
        packages_1.default(test);
    if (settings.path)
        path_1.default(test);
    if (settings.url)
        url_1.default(test);
    load();
});


/***/ }),

/***/ "./test/packages/index.ts":
/*!********************************!*\
  !*** ./test/packages/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_selector_to_object_1 = __importDefault(__webpack_require__(/*! ./query-selector-to-object */ "./test/packages/query-selector-to-object.ts"));
function default_1(test) {
    query_selector_to_object_1.default(test);
}
exports.default = default_1;
;


/***/ }),

/***/ "./test/packages/query-selector-to-object.ts":
/*!***************************************************!*\
  !*** ./test/packages/query-selector-to-object.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _query_selector_to_object_1 = __importDefault(__webpack_require__(/*! @query-selector-to-object */ "./packages/query-selector-to-object.ts"));
function default_1(test) {
    test("querySelectorToObject: '.class'", function () {
        return _query_selector_to_object_1.default(".class");
    }).isDeepEqual([{
            attributes: {
                className: "class"
            }
        }]);
    test("querySelectorToObject: 'element'", function () {
        return _query_selector_to_object_1.default("element");
    }).isDeepEqual([{
            type: "element",
            attributes: {}
        }]);
    test("querySelectorToObject: '.class1.class2'", function () {
        return _query_selector_to_object_1.default(".class1.class2");
    }).isDeepEqual([{
            attributes: {
                className: "class1 class2"
            }
        }]);
    test("querySelectorToObject: 'element.class'", function () {
        return _query_selector_to_object_1.default("element.class");
    }).isDeepEqual([{
            type: "element",
            attributes: {
                className: "class"
            }
        }]);
    test("querySelectorToObject: '[value=\"Here with space\"]'", function () {
        return _query_selector_to_object_1.default("[value=\"Here with space\"]");
    }).isDeepEqual([{
            attributes: {
                value: "Here with space"
            }
        }]);
}
exports.default = default_1;
;


/***/ }),

/***/ "./test/path/index.ts":
/*!****************************!*\
  !*** ./test/path/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _path_1 = __importDefault(__webpack_require__(/*! @path */ "./packages/path/index.ts"));
function default_1(test) {
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", 1)).isEqual("/a/d/c/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -1)).isEqual("/a/b/d/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -2)).isEqual("/a/d/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -2, 1)).isEqual("/a/d/c/");
    test("path.pop", _path_1.default.pop("/a/b/c/")).isEqual("/a/b/");
    test("path.pop", _path_1.default.pop("/a/b/c/d/", 2)).isEqual("/a/b/");
    test("path.push", _path_1.default.push("/a/b/c/", "d")).isEqual("/a/b/c/d/");
    test("path.push (multiple arguments)", _path_1.default.push("/a/b/c/", "d", "e")).isEqual("/a/b/c/d/e/");
    test("path.replace (/a/:b/:c/)", _path_1.default.replace("/a/:b/:c/", { b: "t" })).isEqual("/a/t/:c/");
    test("path.reduce (/a/:b/:c/)", _path_1.default.reduce("/a/:b/:c/", { b: "t" })).isEqual("/a/t/");
    test("path.reduce 1 present", _path_1.default.reduce("/:type/:categoryID/:todoID/", {
        type: "todo"
    })).isEqual("/todo/");
    test("path.reduce 2 present", () => {
        return _path_1.default.reduce("/:type/:categoryID/:todoID/", {
            type: "todo",
            categoryID: "an7yH"
        });
    }).isEqual("/todo/an7yH/");
}
exports.default = default_1;


/***/ }),

/***/ "./test/url.ts":
/*!*********************!*\
  !*** ./test/url.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(__webpack_require__(/*! ../frontend/src/class/url */ "./frontend/src/class/url.ts"));
function default_1(test) {
    test("URL", function () {
        const location = new url_1.default("http://www.google.com/").location;
        return location;
    })
        .isDeepEqual({
        origin: "www.google.com",
        protocol: "http://",
        pathname: "/",
        href: "http://www.google.com/",
        hash: "",
        search: {}
    });
    test("URL: search", function () {
        const url = new url_1.default("?firstName=Sean");
        return url.location;
    })
        .isDeepEqual({
        protocol: "",
        origin: "",
        hash: "",
        href: "?firstName=Sean",
        pathname: "/",
        search: { firstName: "Sean" }
    });
    test("URL: toString", function () {
        return new url_1.default({
            href: "http://www.google.com/",
        }).toString();
    })
        .isEqual("http://www.google.com/");
    test("URL: parseParameters", function () {
        return new url_1.default({
            href: "/todo/category/98374fh",
        }).parseParameters("/todo/cagegory/:id");
    })
        .isDeepEqual({
        id: "98374fh"
    });
}
exports.default = default_1;


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "tiny-test":
/*!****************************!*\
  !*** external "tiny-test" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tiny-test");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "verified":
/*!***************************!*\
  !*** external "verified" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("verified");

/***/ })

/******/ });
//# sourceMappingURL=test.js.map