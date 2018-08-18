export interface UrlProperties {
  location: {
    protocol: string;
    href: string;
    pathname: string;
    hash: string;
    origin: string;
    search: {
      [key: string]: string;
    };
  }
}

interface UrlLocation {
  protocol?: string;
  href?: string;
  pathname?: string;
  hash?: string;
  search?: string;
  origin?: string;
}

export default class URL implements UrlProperties {
  location: UrlProperties["location"];

  constructor(x: string | object) {
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
    } else if (typeof x === "object") {
      this.setLocation(x);
    }
  }

  getOrigin(href: string) {
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

  getProtocol(href: string) {
    if (href.indexOf("http://") === 0) {
      return "http://";
    } else if (href.indexOf("https://") === 0) {
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

  getSearchObject(href: string) {
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

  getHash(href: string) {
    const indexOf = href.indexOf("#");
    return indexOf > -1 ? "#" + href.substring(indexOf) : "";
  }

  getPathname(href: string) {
    let strip = href.replace(/^http(s|):\/\//, "");
    const indexOf = strip.indexOf("/");
    if (indexOf > -1) {
      return strip.substring(indexOf);
    }
    return "/";
  }

  setLocation(x: UrlLocation | UrlProperties["location"]) {
    const prevLocation = Object.assign({}, this.location);
    if (x.href) {
      this.stringToLocation(x.href);
    } else {
      Object.assign(this.location, x, {
        search: typeof x.search === "string"
          ? this.getSearchObject(x.search)
          : typeof x.search === "object"
            ? x.search
            : prevLocation.search
      });
    }
  }

  stringToLocation(href: string) {
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

  parseParameters(parameters: string) {
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
    return (
      this.location.protocol +
      this.location.origin +
      this.location.pathname +
      this.searchToString()
    );
  }
}