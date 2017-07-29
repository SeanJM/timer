import _ from "lodash";

export default function getClockedInTime(today) {
  const clockIn = today.clockIn;
  const clockOut = today.clockOut;

  let times = [];

  for (var i = 0, n = clockOut.length; i < n; i++) {
    times.push(clockOut[i] - clockIn[i]);
  }

  if (clockIn.length > 1 && clockIn.length > clockOut.length) {
    times.push(new Date() - clockIn.slice(-1)[0]);
  }

  if (times.length) {
    return _.sum(times);
  }

  return new Date() - clockIn[0];
}
