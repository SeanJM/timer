import Action from "@frontend/class/action";
import { category } from "@frontend/action/category";
import { contextMenu } from "@frontend/action/context-menu";
import color from "@frontend/action/color";
import { form } from "@frontend/action/form";
import keydown from "@frontend/action/keydown";
import modal from "@frontend/action/modal";
import todo from "@frontend/action/todo";
import { tags } from "@frontend/action/tags";
import { filters } from "@frontend/action/filters";

const action = new Action();
action.debug = process.env.NODE_ENV === "development";

export function dispatch(name: string, value?: any): void {
  action.dispatch(name, value);
}

export function subscribe(name, callback): void {
  action.subscribe(name, callback);
}

category(subscribe);
color(subscribe);
contextMenu(subscribe);
filters(subscribe);
form(subscribe);
keydown(subscribe);
modal(subscribe);
tags(subscribe);
todo(subscribe);
