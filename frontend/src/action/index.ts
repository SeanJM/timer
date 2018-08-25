import Action from "@class/action";
import color from "@action/color";
import form from "@action/form";
import keydown from "@action/keydown";
import modal from "@action/modal";
import slideOut from "@action/slide-out";
import todo from "@action/todo";
import todoTags from "@action/todo-tags";

const action = new Action();
action.debug = process.env.NODE_ENV === "development";

export function dispatch(name: string, value?: any): void {
  action.dispatch(name, value);
}

export const subscribe = (name, callback) => action.subscribe(name, callback);

color(subscribe);
form(subscribe);
keydown(subscribe);
modal(subscribe);
slideOut(subscribe);
todo(subscribe);
todoTags(subscribe);
