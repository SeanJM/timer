import Store from "./Store";

const s = new Store();

s .trigger("login")
  .then("launch")
  .catch("authorize");

s .on("login", function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("login", true);
    }, 100);
  });
});

s .on("launch", function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("launch", true);
    }, 100);
  });
});

s .on("authorize", function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("authorize", true);
    }, 100);
  });
});

s.onSet("login", function (e) {
  console.log("value of login is:" + e.value);
});

s.onSet("launch", function (e) {
  console.log("value of launch is:" + e.value);
});

s.onSet("authorize", function (e) {
  console.log("value of authorize is:" + e.value);
});