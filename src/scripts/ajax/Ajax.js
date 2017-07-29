import processData from "./processData";
import Xhr from "./xhr";

export default function Ajax(props) {
  var self = this;

  this.data = processData(this.contentType, props.data);
  this.type = props.type;
  this.url = props.url;

  this.request = new Promise(function (resolve, reject) {
    var xhr = new Xhr();

    xhr.onSuccess(resolve);
    xhr.onError(reject);
    xhr.onProgress(props.onProgress);
    xhr.onComplete(props.onComplete);

    try {
      xhr.open(
        self.type,
        self.url,
        true
      );

      xhr.send(
        self.data
      );
    } catch (err) {
      // Delay is added because on IE 9, the error will throw before
      // the prototypes get a chance to fill the 'this.method'
      setTimeout(function () {
        reject(err);
      }, 0);
    }
  });
}

Ajax.prototype.then = function (resolve, reject) {
  this.request.then(resolve, reject);
  return this;
};

Ajax.prototype.catch = function (callback) {
  this.request.catch(callback);
  return this;
};