import { RouterLocation } from "@frontend/components/router/types";
import getLocation from "@frontend/components/router/get-location";
import path, { PathQueryValue } from "@path";

export interface HistoryLocation extends Partial<RouterLocation> {
  query?: PathQueryValue;
}

export interface RouterHistory {
  stack: RouterLocation[];
  last: () => RouterLocation;
  push: (url: string | HistoryLocation) => void;
}

const history: RouterHistory = {
  stack: [
    getLocation(window.location.hash.substring(1))
  ],

  last() {
    return history.stack.slice(-1)[0];
  },

  push(url) {
    if (typeof url === "string") {
      window.location.hash = url;
    } else {
      let location = history.stack.slice(-1)[0];
      const newLocation: HistoryLocation = Object.assign({}, location, url);
      let newUrl = newLocation.pathname;

      if (newLocation.query) {
        newUrl += path.query().assign(newLocation.query).toString();
      } else if (newLocation.search) {
        newUrl += "?" + newLocation.search;
      }

      if (newLocation.hash) {
        newUrl += "#" + newLocation.hash;
      }

      window.location.hash = "#" + newUrl;
    }
  }
};

window.addEventListener("hashchange", function () {
  history.stack.push(
    getLocation(window.location.hash.substring(1))
  );
});

export default history;