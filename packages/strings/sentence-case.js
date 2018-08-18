export default function sentenceCase(string) {
  let i = -1;
  return (string || "")
    .replace(/\w+/g, function (a) {
      return ++i === 0
        ? a[0].toUpperCase() + a.substring(1).toLowerCase()
        : a === "i"
          ? a.toUpperCase()
          : a.toLowerCase();
    });
}