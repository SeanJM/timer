import Ajax from "./Ajax";

const VERSION = "1.1.2";

function dotProperty(method, props) {
  props = typeof props === "string"
    ? { url: props }
    : props;
  return Object.assign({ type: method }, props);
}

function ajax(props) {
  return new Ajax(props);
}

ajax.get = function (props) {
  return new Ajax(
    dotProperty("get", props)
  );
};

ajax.post = function (props) {
  return new Ajax(
    dotProperty("post", props)
  );
};

ajax.patch = function (props) {
  return new Ajax(
    dotProperty("patch", props)
  );
};

ajax.delete = function (props) {
  return new Ajax(
    dotProperty("delete", props)
  );
};

ajax.put = function (props) {
  return new Ajax(
    dotProperty("put", props)
  );
};

ajax.version = VERSION;
export default ajax;
