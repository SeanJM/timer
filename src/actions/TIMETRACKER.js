import moment from "moment";
import store from "../store/";
import getClockedInTime from "../helpers/getClockedInTime";

const TIMERS = {};

store.on("PUNCH_IN", ({ projectId }) => {
  const today = moment().format("YYYY_MM_DD");
  const path = [ "projects", projectId, "timeTracker", today ];

  console.log(path);

  function update() {
    const clockedInTime = getClockedInTime(store.get(path));
    if (store.get(path.concat("punchedIn"))) {
      store.set(path.concat("clockedInTime"), clockedInTime);
      TIMERS[path.join(".")] = setTimeout(update, 1000);
    }
  }

  if (typeof store.get(path) === "undefined") {
    console.log("path is undefined");
    store.set(path, {
      break: false,
      punchedIn: false,

      clockedInTime: 0,

      clockIn: [],
      clockOut: [],
    });
  }

  store.set(path.concat("punchedIn"), true);
  store.push(path.concat("clockIn"), new Date().getTime());
  update();
});

store.on("PUNCH_OUT", ({ projectId }) => {
  const today = moment().format("YYYY_MM_DD");
  const path = [ "projects", projectId, "timeTracker", today ];
  store.set(path.concat("punchedIn"), false);
  store.push(path.concat("clockOut"), new Date().getTime());
  clearTimeout(TIMERS[path.join(".")]);
});

store.on("RESET_TIMETRACKER", ({ projectId }) => {
  const today = moment().format("YYYY_MM_DD");
  const path = [ "projects", projectId, "timeTracker", today ];
  store.set(path.concat("clockedInTime"), 0);
  store.set(path.concat("clockIn"), []);
  store.set(path.concat("clockOut"), []);
  store.set(path.concat("punchedIn"), false);
});

store.on("SET_TIME", ({ projectId, value }) => {
  // const today = moment().format("YYYY_MM_DD");
  // const path = [ "projects", projectId, "timeTracker", today ];
  // const punchedIn = store.get(path.concat("punchedIn"));

  // store.set(path.concat("punchedIn"), punchedIn[0] - value);
  // store.set(path.concat("punchedOut"), punchedIn[0] - 1);
});
