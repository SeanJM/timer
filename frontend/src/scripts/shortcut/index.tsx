// tslint:disable:no-default-export

import { KEYNAME_BY_CODE } from "@constants";
import _ from "lodash";

class ShortCut {
  pressed: string[];
  groups: ShortCutGroup[];
  target: HTMLElement;

  subscribers: {
    name: string;
    callback: ShortCut.EventListenerFunction;
  }[];

  constructor(target: HTMLElement) {
    this.groups = [];
    this.pressed = [];
    this.target = target;
    this.target.addEventListener("keydown", this);
    this.target.addEventListener("keyup", this);
  }

  addEventListener(name: string, callback: ShortCut.EventListener) {
    this.groups.push({
      queue: name.replace(/\s+/g, "").split(",").map((a) => a.split("+")),
      callback,
      index: 0,
      name,
      timer: null,
    });

    return this;
  }

  removeEventListener(name: string, listener: ShortCut.EventListener) {
    this.groups = this.groups.filter((a) => a.callback !== listener);
    return this;
  }

  destroy() {
    this.target.removeEventListener("keydown", this);
    this.target.removeEventListener("keyup", this);
  }

  shortcutsDidChange() {
    let i = -1;
    const n = this.groups.length;

    while (++i < n) {
      let group = this.groups[i];
      let member = group.queue[group.index];

      if (_.difference(member, this.pressed).length === 0) {
        group.index += 1;
        if (group.index === group.queue.length) {
          let evt = {
            type: "shortcut",
            name: group.name,
          };

          if (typeof group.callback === "function") {
            group.callback(evt);
          } else {
            group.callback.handleEvent(evt);
          }
        } else {
          clearTimeout(group.timer);
          group.timer = setTimeout(() => group.index = 0, 1000);
        }
      }
    }
  }

  onKeyUp(keyname: string) {
    this.pressed = this.pressed.filter((a) => a !== keyname);
  }

  onKeyDown(keyname: string) {
    this.pressed.push(keyname);
  }

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
}

namespace ShortCut {
  export type EventListenerFunction =
    (e: Event) => void;

  export type EventListenerObject =
    { handleEvent: EventListenerFunction };

  export type EventListener =
    EventListenerFunction | EventListenerObject;

  export interface Event {
    type: string;
    name: string;
  }
}

interface ShortCutGroup {
  callback: ShortCut.EventListener;
  index: number;
  name: string;
  queue: string[][];
  timer: any;
}

export default ShortCut;