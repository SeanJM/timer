var MIME_TYPES = {
  json: (
    "application/json; charset=utf-8"
  ),

  urlencoded: (
    "application/x-www-form-urlencoded; charset=utf-8"
  ),

  text: (
    "text/plain"
  )
};

export default function findDataType(data) {
  if (!data) {
    return false;
  } else if (data instanceof FormData) {
    return "multipart/form-data";
  } else if (typeof data === "object") {
    return MIME_TYPES.json;
  } else {
    return MIME_TYPES.text;
  }
}