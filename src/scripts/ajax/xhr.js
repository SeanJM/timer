import parseResponse from "./parseResponse";

const IS_UPLOAD = {
  post: true,
  put: true
};

function onprogress(e) {
  if (e.lengthComputable && this.__onProgress) {
    this.__onProgress({
      total: e.total,
      loaded: e.loaded,
      progress: Math.round((e.loaded / e.total) * 100) / 100
    });
  }
}

function Xhr() {
  var self = this;

  // Is IE 8> and the request is going cross domain
  if (typeof XDomainRequest === "function") {
    this.__request = new XDomainRequest();

    this.__request.onload = function () {
      this.__onSuccess(
        parseResponse(this.__request.responseText)
      );
    };

    this.__request.onerror = function () {
      self.__onError({
        response: this.response,
        status: this.status,
        statusText: this.statusText
      });
    };
  } else {
    this.__request = new XMLHttpRequest();

    this.__request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self.__onSuccess(
            parseResponse(this.responseText)
          );
        } else {
          self.__onError({
            response: this.response,
            status: this.status,
            statusText: this.statusText
          });
        }
      }
    };

    this.__request.onloadend = function () {
      if (self.__onComplete) {
        self.__onComplete();
      }
    };
  }
}

Xhr.prototype.onError = function (callback) {
  this.__onError = callback;
  return this;
};

Xhr.prototype.onSuccess = function (callback) {
  this.__onSuccess = callback;
  return this;
};

Xhr.prototype.onProgress = function (callback) {
  this.__onProgress = callback;
  return this;
};

Xhr.prototype.onComplete = function (callback) {
  this.__onComplete = callback;
  return this;
};

Xhr.prototype.setRequestHeader = function (key, value) {
  if (this.__request instanceof XMLHttpRequest) {
    this.__request.setRequestHeader(key, value);
  }

  return this;
};

Xhr.prototype.open = function (type, url, isAsync) {
  if (IS_UPLOAD[type]) {
    this.__request.upload.onprogress = e => {
      onprogress.call(this, e);
    };
  } else {
    this.__request.onprogress = e => {
      onprogress.call(this, e);
    };
  }

  this.__request
    .open(
      type.toUpperCase(),
      url,
      isAsync
    );

  return this;
};

Xhr.prototype.send = function (data) {
  this.__request.send(data);
  return this;
};

export default Xhr;