export default function destroy(obj) {
  for (var k in obj) {
    delete obj[k];
  }
}