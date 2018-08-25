import { RouterLocation } from "@frontend/components/router/types";
import getLocation from "@frontend/components/router/get-location";

export interface History {
  stack: RouterLocation[],
  last: () => RouterLocation,
  push: (url: string) => void,
};

const history: History = {
  stack: [
    getLocation(window.location.hash.substring(1))
  ],

  last() {
    return history.stack.slice(-1)[0];
  },

  push(url: string) {
    window.location.hash = url;
  }
};

window.addEventListener("hashchange", function () {
  history.stack.push(
    getLocation(window.location.hash.substring(1))
  );
});

export default history;