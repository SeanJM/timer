export default function parseResponse(message) {
  var wrapped;

  try {
    return JSON.parse(message);
  } catch (e) {
    try {
      // http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
      wrapped = "{\"" + message.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}";
      return JSON.parse(wrapped, function (key, value) {
        return (
          key === ""
            ? value
            : decodeURIComponent(value)
        );
      });
    } catch (e) {
      return message;
    }
  }
}