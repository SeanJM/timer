const types = {
  json: function (data) {
    return JSON.stringify(data);
  },

  urlencoded: function (data) {
    // http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
    var str = [];

    for (var p in data) {
      if (data.hasOwnProperty(p)) {
        str.push(
          encodeURIComponent(p) + "=" + encodeURIComponent(data[p])
        );
      }
    }

    return str.join("&");
  }
};

export default function processData(type, data) {
  if (/application\/json/.test(type)) {
    return types.json(data);
  } else if (/urlencoded/.test(type)) {
    return types.urlencoded(data);
  }
  return data;
}