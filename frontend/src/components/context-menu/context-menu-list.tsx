export const CONTEXT_MENU_LIST = {};

export function contextMenuPush(a) {
  for (var k in a) {
    CONTEXT_MENU_LIST[k] = a[k];
  }
}