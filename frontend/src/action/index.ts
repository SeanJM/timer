import Action from "@class/action";
import modal from "@action/modal";
import form from "@action/form";
import slideOut from "@action/slide-out";
import todo from "@action/todo";
import keydown from "@action/keydown";

const action = new Action();
action.debug = process.env.NODE_ENV === "development";

export function dispatch(name: string, value?: any): void {
  action.dispatch(name, value);
}

export const subscribe = (name, callback) => action.subscribe(name, callback);

modal(subscribe);
form(subscribe);
todo(subscribe);
slideOut(subscribe);
keydown(subscribe);
