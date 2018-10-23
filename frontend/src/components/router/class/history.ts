import getHash from "../scripts/get-hash";
import getPathname from "../scripts/get-pathname";
import getSearch from "../scripts/get-search";
import path, { PathQueryValue } from "@path";
import { RouterLocation } from "../types";

class History {
  __onchange: History.SubscriberType[];
  stack: History.Location[];

  constructor() {
    this.__onchange = [];

    this.stack = [
      this.getLocation(window.location.hash.substring(1))
    ];

    window.addEventListener("hashchange", this);
  }

  handleEvent(e: HashChangeEvent) {
    const href = window.location.hash.substring(1);
    const location = this.getLocation(href);
    const evt: History.ChangeEvent = {
      hash: location.hash,
      href: location.href,
      pathname: location.pathname,
      query: path.query(location.search).value,
      search: location.search,
      type: "historychange",
    };

    this.stack.push(location);
    this.__onchange.forEach((callback) => {
      if (typeof callback === "function") {
        callback(evt);
      } else {
        callback.handleEvent(evt);
      }
    });
  }

  getLocation(href: string): History.Location {
    const search = getSearch(href);
    return {
      hash: getHash(href),
      href: href,
      pathname: getPathname(href),
      query: path.query(search).value,
      search,
    };
  }

  push(url: Partial<History.Location>): void;
  push(url: string): void;
  push(url: any) {
    if (typeof url === "string") {
      url = url[0] === "/" ? url : "/" + url;
      window.location.hash = url;
    } else {
      let prevLocation = this.last();
      const newLocation: History.Location = { ...prevLocation, ...url };
      let href = newLocation.pathname;

      if (newLocation.query) {
        href += path.query().assign(newLocation.query).toString();
      } else if (newLocation.search) {
        href += (newLocation.search[0] === "?" ? "" : "?") + newLocation.search;
      }

      if (newLocation.hash) {
        href += "#" + newLocation.hash;
      }

      newLocation.href = href;
      window.location.hash = "#" + href;
    }
  }

  onChange(callback: History.SubscriberType) {
    this.__onchange.push(callback);
  }

  offChange(callback: History.SubscriberType) {
    const index = this.__onchange.indexOf(callback);
    if (index !== -1) {
      this.__onchange.splice(index, 1);
    }
  }

  last() {
    return this.stack.slice(-1)[0];
  }
}

namespace History {
  export interface Location extends RouterLocation {
    query: PathQueryValue;
  }

  export type SubscriberType =
    | History.Subscriber
    | { handleEvent: History.Subscriber }
  ;

  export interface ChangeEvent extends Location {
    type: "historychange";
  }

  export interface Subscriber {
    (e: History.ChangeEvent): void;
  }
}

export { History };