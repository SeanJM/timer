const lib = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const n = lib.length - 1;

function generateId(index = 7) {
  var id = [];

  while (index-- > 0) {
    id.push(
      lib[Math.round(Math.random() * n)]
    );
  }

  return id.join("");
}

module.exports = generateId;
