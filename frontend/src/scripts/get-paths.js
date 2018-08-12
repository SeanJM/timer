function getKeyValues(paths, path, value) {
  const keys = [];
  if (!Array.isArray(value) && typeof value === "object") {
    for (var k in value) {
      if (value.hasOwnProperty(k)) {
        getKeyValues(paths, path.concat(k), value[k]);
        keys.push(k);
      }
    }
    if (!keys.length) {
      path.push(value);
      paths.push(path);
    }
  } else {
    path.push(value);
    paths.push(path);
  }
}

export default function getPaths(object) {
  const paths = [];
  getKeyValues(paths, [], object);
  return paths;
}