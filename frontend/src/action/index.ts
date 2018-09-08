import Action from "@frontend/class/action";
import category from "@frontend/action/category";
import color from "@frontend/action/color";
import { form } from "@frontend/action/form";
import keydown from "@frontend/action/keydown";
import modal from "@frontend/action/modal";
import slideOut from "@frontend/action/slide-out";
import todo from "@frontend/action/todo";
import todoTags from "@frontend/action/todo-tags";

const action = new Action();
action.debug = process.env.NODE_ENV === "development";

export function dispatch(name: string, value?: any): void {
  action.dispatch(name, value);
}

export const subscribe = (name, callback) => action.subscribe(name, callback);

category(subscribe);
color(subscribe);
form(subscribe);
keydown(subscribe);
modal(subscribe);
slideOut(subscribe);
todo(subscribe);
todoTags(subscribe);
