import moment from "moment";
import store from "../store/";
import getClockedInTime from "../helpers/getClockedInTime";

const TIMERS = {};

store.on("PUNCH_IN", ({ projectId }) => {
  const today = moment().format("YYYY_MM_DD");
  const path = [ "projects", projectId, "timeTracker", today ];

  function update() {
    const clockedInTime = getClockedInTime(store.get(path));
    const timeOffset = store.get(path.concat("timeOffset"));

    if (store.get(path.concat("punchedIn"))) {
      store.set(
        path.concat("clockedInTime"),
        clockedInTime + (timeOffset.type === "add" ? timeOffset.value : -timeOffset.value)
      );

      TIMERS[path.join(".")] = setTimeout(update, 1000);
    }
  }

  if (typeof store.get(path) === "undefined") {
    store.set(path, {
      break: false,
      punchedIn: false,

      clockedInTime: 0,

      timeOffset: {
        type: "add",
        value: 0
      },

      clockIn: [],
      clockOut: [],
    });
  }

  store.set(
    path.concat("punchedIn"),
    true
  );

  store.push(
    path.concat("clockIn"),
    new Date().getTime()
  );

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

  store.assign(path, {
    timeOffset: {
      type: store.get(path.concat("timeOffset", "type")),
      value: 0,
    },
    clockedInTime: 0,
    clockIn: [],
    clockOut: [],
    punchedIn: false
  });
});

store.on("OFFSET_TIME", ({ projectId, value, type }) => {
  const today = moment().format("YYYY_MM_DD");

  const path = [
    "projects",
    projectId,
    "timeTracker",
    today
  ];

  store.set(path.concat("timeOffset"), {
    type: type,
    value : value
  });
});
