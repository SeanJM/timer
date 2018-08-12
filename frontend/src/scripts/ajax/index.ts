interface Params {
  headers?: { [key: string]: any };
  data: { [key: string]: any };
}

interface SubscriberResponseEvent {
  status: number;
  response: any;
}

interface Subscriber {
  event: string | number;
  callback: (response: SubscriberResponseEvent) => void;
}

const subscribers: Subscriber[] = [];

const ajax = {
  on(event: string | number, callback) {
    subscribers.push({
      event,
      callback
    });
  },

  get(url: string, params?: Params) {
    if (process.env.NODE_ENV === "development") {
      log("GET", url, params && params.data);
    }
    return new Promise(function (resolve, reject) {
      const req = new XMLHttpRequest();
      wrapXMLRequest(url, req, resolve, reject);
      req.open("GET", getURL(url, params && params.data));
      req.send();
    });
  },

  post(url: string, params?: Params) {
    if (process.env.NODE_ENV === "development") {
      log("POST", url, params.data);
    }
    return new Promise(function (resolve, reject) {
      const req = new XMLHttpRequest();
      wrapXMLRequest(url, req, resolve, reject);
      // Send the proper header information along with the request
      req.open("POST", getURL(url, params.data));
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send();
    });
  },

  delete(url: string, params?: Params) {
    if (process.env.NODE_ENV === "development") {
      log("DELETE", url, params.data);
    }
    return new Promise(function (resolve, reject) {
      const req = new XMLHttpRequest();
      wrapXMLRequest(url, req, resolve, reject);
      // Send the proper header information along with the request
      req.open("DELETE", getURL(url, params.data));
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send();
    });
  }
};

function maybeJSON(response: string) {
  try {
    return JSON.parse(response);
  } catch (__err) {
    return response;
  }
}

function style(obj) {
  const res = [];
  for (var k in obj) {
    res.push(k + ": " + obj[k]);
  }
  return res.join(";");
}

function log(event: "POST" | "GET" | "RESP" | "ERR" | "DELETE" | number, url: string, data: Params["data"]) {
  const styles = [
    style({
      background: event === "ERR"
        ? "#d62e74"
        : "#7028a7",
      color: "#fff"
    }),
    style({ background: "#3fa2ab", color: "#fff" }),
    style({ background: "none", "font-weight": "bold" }),
  ];
  console.log("%c AJAX %c " + event + " %c " + url, styles[0], styles[1], styles[2]);
  console.log(data);
}

function emitSubscribers(url: string, req: XMLHttpRequest) {
  let i = -1;
  const n = subscribers.length;
  while (++i < n) {
    if (subscribers[i].event === url || subscribers[i].event === req.status) {
      subscribers[i].callback({
        status: req.status,
        response: req.response
      });
    }
  }
}

function wrapXMLRequest(url: string, req: XMLHttpRequest, resolve: (any) => void, reject: (any) => void) {
  req.onreadystatechange = function () {
    if (this.readyState === 4) {
      let res = maybeJSON(this.response);
      emitSubscribers(url, req);
      if (Math.floor(this.status / 100) == 2) {
        resolve(res);
        log("RESP", url, res);
      } else {
        log(this.status, url, res);
        reject(res);
      }
    }
  }
}

function getURL(url: string, data?: Params["data"]) {
  const paramsString = [];
  for (var k in data) {
    paramsString.push(k + "=" + data[k]);
  }
  return url + encodeURI((paramsString.length ? "?" + paramsString.join("&") : ""));
}

export default ajax;