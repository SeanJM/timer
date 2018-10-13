import { KEYNAME_BY_CODE } from "@constants";
import _ from "lodash";

type EventListenerFunction = (e: ShortCutEvent) => void;
type EventListenerObject = { handleEvent: EventListenerFunction };
type EventListener = EventListenerFunction | EventListenerObject;

interface ShortCutProps {
  [key: string]: EventListenerFunction;
}

export interface ShortCutEvent {
  type: string;
  name: string;
}

interface ShortCutGroup {
  queue: string[][];
  name: string;
  callback: EventListenerFunction;
  index: number;
  timer: any;
}

export class ShortCut {
  pressed: string[];
  groups: ShortCutGroup[];

  subscribers: {
    name: string;
    callback: EventListenerFunction;
  }[];

  constructor(props: ShortCutProps) {
    this.groups = [];

    for (var name in props) {
      this.groups.push({
        queue: name.replace(/\s+/g, "").split(",").map((a) => a.split("+")),
        callback: props[name],
        index: 0,
        name,
        timer: null,
      });
    }

    document.addEventListener("keydown", this);
    document.addEventListener("keyup", this);
  }

  addEventListener(name: string, listener: EventListener) {
    this.subscribers.push({
      name,
      callback: typeof listener === "function"
        ? listener
        : listener.handleEvent,
    });
  }

  destroy() {
    document.removeEventListener("keydown", this);
    document.removeEventListener("keyup", this);
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
          group.callback({
            type: "shortcut",
            name: group.name,
          });
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

export function shortCut(props: ShortCutProps) {
  return new ShortCut(props);
}