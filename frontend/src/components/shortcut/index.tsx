import { KEYNAME_BY_CODE } from "@constants";
import { store } from "@frontend/store";
const modifiers: string[] = [];
const keys: string[] = [];

const MODIFIER = {
  "CTRL": "MODIFIER",
  "ALT": "MODIFIER",
  "META": "MODIFIER",
};

const MODIFIER_INDEX = {
  "META": 0,
  "CTRL": 1,
  "ALT": 2,
};

const service = {
  modifiers,
  keys,

  shortcutsDidChange() {
    const list = [];

    if (this.modifiers.length) {
      list.push(this.modifiers.join("+"));
    }

    if (this.keys.length) {
      list.push(this.keys.join("+"));
    }

    store.set({
      shortcut: list.length ? list.join("+") : null,
    });
  },

  onKeyUp(keyname: string) {
    switch (MODIFIER[keyname]) {
      case "MODIFIER": {
        this.modifiers = this.modifiers.filter((a) => a !== keyname);
      }
    }
  },

  onKeyDown(keyname: string) {
    switch (MODIFIER[keyname]) {
      case "MODIFIER": {
        this.modifiers.push(keyname);
        this.modifiers.sort((a, b) => MODIFIER_INDEX[a] - MODIFIER_INDEX[b]);
      }
    }
  },

  handleEvent(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    const targetIsInput = /input|textarea/i.test(target.tagName);
    if (!targetIsInput) {
      if (e.type === "keydown") {
        this.onKeyDown(KEYNAME_BY_CODE[e.which]);
      } else {
        this.onKeyUp(KEYNAME_BY_CODE[e.which]);
      }
      this.shortcutsDidChange();
    }
  }
};

export function ShortCutService() {
  document.addEventListener("keydown", service);
  document.addEventListener("keyup", service);
  return null;
}