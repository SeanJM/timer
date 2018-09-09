// tslint:disable:no-default-export

import { RouterLocation } from "@frontend/components/router/types";
import getLocation from "@frontend/components/router/get-location";
import path, { PathQueryValue } from "@path";

export interface HistoryLocation extends Partial<RouterLocation> {
  query?: PathQueryValue;
}

export type RouterHistory = typeof history;

function push(url: HistoryLocation): void;
function push(url: string): void;
function push(url: any) {
  if (typeof url === "string") {
    window.location.hash = url;
  } else {
    let location = history.stack.slice(-1)[0];
    const newLocation: HistoryLocation = {...location, ...url};
    let newUrl = newLocation.pathname;

    if (newLocation.query) {
      newUrl += path.query().assign(newLocation.query).toString();
    } else if (newLocation.search) {
      newUrl += (newLocation.search[0] === "?" ? "" : "?") + newLocation.search;
    }

    if (newLocation.hash) {
      newUrl += "#" + newLocation.hash;
    }

    window.location.hash = "#" + newUrl;
  }
}

function handleEvent() {
  history.stack.push(
    getLocation(window.location.hash.substring(1))
  );
}

const history = {
  stack: [
    getLocation(window.location.hash.substring(1))
  ],

  last: () => history.stack.slice(-1)[0],
  handleEvent,
  push,
};

window.addEventListener("hashchange", history);

export default history;