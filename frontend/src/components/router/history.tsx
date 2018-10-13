// tslint:disable:no-default-export

import { RouterLocation } from "@frontend/components/router/types";
import getLocation from "@frontend/components/router/get-location";
import path, { PathQueryValue } from "@path";

export interface HistoryLocation extends RouterLocation {
  query: PathQueryValue;
}

export type RouterHistory = typeof history;

function pushObject(location: Partial<HistoryLocation>) {
  let prevLocation = history.last();
  const newLocation: HistoryLocation = {...prevLocation, ...location};
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
  history.stack.push(newLocation);
  history.__updateHashChange = false;
  window.location.hash = "#" + href;
}

function push(url: Partial<HistoryLocation>): void;
function push(url: string): void;
function push(url: any) {
  if (typeof url === "string") {
    url = url[0] === "/" ? url : "/" + url;
    window.location.hash = url;
  } else {
    pushObject(url);
  }
}

export const history = {
  __updateHashChange: true,

  stack: [
    getLocation(window.location.hash.substring(1))
  ],

  last: () => history.stack.slice(-1)[0],
  push,
};

window.addEventListener("hashchange", () => {
  if (history.__updateHashChange) {
    let href = window.location.hash.substring(1);
    history.stack.push(
      getLocation(href)
    );
  } else {
    history.__updateHashChange = true;
  }
});