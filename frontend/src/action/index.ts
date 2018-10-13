import Action from "@frontend/class/action";
import color from "@frontend/action/color";
import modal from "@frontend/action/modal";
import { alert } from "@frontend/action/alert";
import { category } from "@frontend/action/category";
import { contextMenu } from "@frontend/action/context-menu";
import { filters } from "@frontend/action/filters";
import { form } from "@frontend/action/form";
import { layout } from "@frontend/action/layout";
import { tags } from "@frontend/action/tags";
import { todo } from "@frontend/action/todo";

const action = new Action();
action.debug = process.env.NODE_ENV === "development";

export function dispatch(name: string, value?: any): void {
  action.dispatch(name, value);
}

export function subscribe(name, callback): void {
  action.subscribe(name, callback);
}

alert(subscribe);
category(subscribe);
color(subscribe);
contextMenu(subscribe);
filters(subscribe);
form(subscribe);
layout(subscribe);
modal(subscribe);
tags(subscribe);
todo(subscribe);