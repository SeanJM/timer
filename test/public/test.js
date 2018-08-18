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
const _query_selector_to_object_1 = __importDefault(__webpack_require__(/*! @query-selector-to-object */ "./packages/query-selector-to-object.ts"));
const writeFile = util_1.promisify(fs.writeFile);
function queryIsMatch(query, data) {
    if (typeof data === "object") {
        if (query.type && query.type !== data.type) {
            return false;
        }
        for (var k in query.attributes) {
            if (query.attributes[k] !== data.attributes[k]) {
                return false;
            }
        }
        return true;
    }
    return false;
}
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
    find(query) {
        const queryObject = typeof query === "string"
            ? _query_selector_to_object_1.default(query)
            : query;
        function findChild(node) {
            let i = -1;
            const n = node.children
                ? node.children.length
                : 0;
            while (++i < n) {
                if (queryIsMatch(queryObject, node.children[i])) {
                    return node.children[i];
                }
                else if (typeof node.children[i] === "object") {
                    let c = findChild(node.children[i]);
                    if (c) {
                        return c;
                    }
                }
            }
            return null;
        }
        return findChild(this.body);
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

Object.defineProperty(exports, "__esModule", { value: true });
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

/***/ "./frontend/src/components/router/get-params.tsx":
/*!*******************************************************!*\
  !*** ./frontend/src/components/router/get-params.tsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _path_1 = __importDefault(__webpack_require__(/*! @path */ "./packages/path.ts"));
function isMatch(query, url) {
    return query === url || (query && url && query[0] === ":");
}
function getParams(pathname = "", schema) {
    const urlPathname = _path_1.default.normalize(_path_1.default.join(pathname)).split("/");
    const queryPathname = schema ? _path_1.default.normalize(schema).split("/") : null;
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
exports.default = getParams;


/***/ }),

/***/ "./packages/path.ts":
/*!**************************!*\
  !*** ./packages/path.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = {};
function parse(pathname) {
    const p = path.normalize(pathname);
    const chunks = p.split("/");
    return {
        chunks,
        isRelative: pathname[0] !== "/",
        root: pathname[0] === "/" ? "/" : "",
    };
}
path.normalize = function (pathname) {
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
};
path.join = function (...pathname) {
    let i = -1;
    const p = parse(pathname[0]);
    const n = pathname.length;
    const res = [];
    while (++i < n) {
        res.push(this.normalize(pathname[i]));
    }
    return p.root + res.join("/") + "/";
};
path.pop = function (pathname, times = 1) {
    const p = parse(pathname);
    let i = -1;
    while (++i < times) {
        p.chunks.pop();
    }
    return p.root + p.chunks.join("/") + "/";
};
path.splice = function (pathname, member, index, length) {
    const p = parse(pathname);
    const m = this.normalize(member);
    if (index < 0 && typeof length === "undefined") {
        p.chunks.splice(p.chunks.length + index, p.chunks.length, m);
    }
    else {
        p.chunks.splice(index, length || index, m);
    }
    return p.root + p.chunks.join("/") + "/";
};
path.push = function (pathname, ...members) {
    const p = parse(pathname);
    const m = members.map((member) => this.normalize(member));
    Array.prototype.push.apply(p.chunks, m);
    return p.root + p.chunks.join("/") + "/";
};
exports.default = path;


/***/ }),

/***/ "./packages/query-selector-to-object.ts":
/*!**********************************************!*\
  !*** ./packages/query-selector-to-object.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function querySelectorToObject(selector) {
    const attributes = {};
    const queryObject = {
        attributes,
    };
    let i = -1;
    const n = selector.length;
    const boundary = {
        " ": true,
        ".": true,
        "[": true,
        "]": true,
        "#": true,
    };
    while (++i < n) {
        if (/[a-zA-Z]/.test(selector[i])) {
            queryObject.type = "";
            while (selector[i] && !boundary[selector[i]]) {
                queryObject.type += selector[i];
                i += 1;
            }
        }
        else if (selector[i] === "#") {
            attributes.id = "";
            i += 1;
            while (selector[i] && !boundary[selector[i]]) {
                attributes.id += selector[i];
                i += 1;
            }
        }
        else if (selector[i] === ".") {
            attributes.className = attributes.className ? attributes.className + " " : "";
            i += 1;
            while (selector[i] && !boundary[selector[i]]) {
                attributes.className += selector[i];
                i += 1;
            }
        }
    }
    return queryObject;
}
exports.default = querySelectorToObject;


/***/ }),

/***/ "./test/components/index.ts":
/*!**********************************!*\
  !*** ./test/components/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_params_1 = __importDefault(__webpack_require__(/*! @components/router/get-params */ "./frontend/src/components/router/get-params.tsx"));
function default_1(test) {
    test("getParams", function () {
        return get_params_1.default("/a/b/c/", "/a/b/").__match;
    }).isEqual(true);
    test("getParams: with parameter set in schema", function () {
        return get_params_1.default("/a/b/c/", "/a/:b/").__match;
    }).isEqual(true);
}
exports.default = default_1;


/***/ }),

/***/ "./test/database.ts":
/*!**************************!*\
  !*** ./test/database.ts ***!
  \**************************/
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
const database_1 = __importDefault(__webpack_require__(/*! ../backend/src/class/database */ "./backend/src/class/database.ts"));
const _query_selector_to_object_1 = __importDefault(__webpack_require__(/*! @query-selector-to-object */ "./packages/query-selector-to-object.ts"));
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
    test("Database: appendChild", function () {
        const a = database.createElement("div");
        const b = database.createElement("span");
        const body = database.body;
        body.appendChild(a);
        a.appendChild(b);
        return body.children.indexOf(a) > -1 && a.children.indexOf(b) > -1;
    }).isEqual(true);
    test("Database: appendChild as string", function () {
        const element = database.body.appendChild("Child");
        return element.children.find(a => a === "Child");
    }).isEqual("Child");
    test("Database: find", function () {
        const validator = new verified_1.default({
            type: "element",
            attributes: {
                id: "bnm"
            },
            children: "any[]",
            parentNode: "object",
        });
        database.body.appendChild(database.createElement({ id: "76l" }));
        database.body.appendChild(database.createElement({ id: "bnm" }));
        database.body.appendChild(database.createElement({ id: "9jh" }));
        database.body.appendChild(database.createElement({ id: "76h" }));
        return validator.validate(database.find("#bnm")).isValid;
    }).isEqual(true);
    test("Database: removeChild", function () {
        let a = database.createElement("div", { id: "98a" });
        let b = database.createElement("div", { id: "071k" });
        database.body.appendChild(a);
        database.body.appendChild(b);
        database.body.removeChild(b);
        return database.find("#071k") === null && !!database.find("#98a");
    }).isEqual(true);
    test("Database: setAttirbute", function () {
        let a = database.createElement("div", { id: "98a" });
        a.setAttributes("created", new Date().getTime());
        a.setAttributes("id", "someId");
        return new verified_1.default({ created: "number", id: "string" }).validate(a.attributes).isValid;
    }).isEqual(true);
    test("Database: queryStringToObject ID", function () {
        const a = _query_selector_to_object_1.default("#bnm");
        return a;
    }).isDeepEqual({
        attributes: { id: "bnm" }
    });
    test("Database: queryStringToObject className", function () {
        const a = _query_selector_to_object_1.default(".todo");
        return a;
    }).isDeepEqual({
        attributes: { className: "todo" }
    });
    test("Database: persistence", function () {
        const db = new database_1.default(path.resolve(__dirname, "elements.json"));
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
    test("Database: persistence, remove child", function () {
        const db = new database_1.default(path.resolve(__dirname, "elements.json"));
        const categories = db.getElementById("categories");
        const category = db.getElementById("0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg");
        categories.removeChild(category);
        return categories.children.indexOf(category) === -1;
    }).isEqual(true);
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(this, "test"))

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
const database_1 = __importDefault(__webpack_require__(/*! ./database */ "./test/database.ts"));
const path_1 = __importDefault(__webpack_require__(/*! ./path */ "./test/path/index.ts"));
tiny_test_1.default(function (test, load) {
    components_1.default(test);
    database_1.default(test);
    path_1.default(test);
    url_1.default(test);
    load();
});


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
const _path_1 = __importDefault(__webpack_require__(/*! @path */ "./packages/path.ts"));
function default_1(test) {
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", 1)).isEqual("/a/d/c/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -1)).isEqual("/a/b/d/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -2)).isEqual("/a/d/");
    test("path.splice", _path_1.default.splice("/a/b/c/", "d", -2, 1)).isEqual("/a/d/c/");
    test("path.pop", _path_1.default.pop("/a/b/c/")).isEqual("/a/b/");
    test("path.pop", _path_1.default.pop("/a/b/c/d/", 2)).isEqual("/a/b/");
    test("path.push", _path_1.default.push("/a/b/c/", "d")).isEqual("/a/b/c/d/");
    test("path.push (multiple arguments)", _path_1.default.push("/a/b/c/", "d", "e")).isEqual("/a/b/c/d/e/");
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