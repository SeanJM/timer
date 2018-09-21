import React from "react";

export type IconType =
  | "add"
  | "book"
  | "check"
  | "close"
  | "edit"
  | "filter"
  | "folder-add"
  | "folder"
  | "history-back"
  | "save"
  | "search"
  | "sort"
  | "tag-filter"
  | "tag"
  ;

interface IconProps {
  className?: string;
  fill?: string;
  type: IconType;
}

export function Icon(props: IconProps) {
  const className = ["icon"];
  if (props.className) {
    className.push(props.className);
  }
  return (
    <svg className={className.join(" ")} style={{fill: props.fill}}>
      <use href={"#icon-" + props.type}></use>
    </svg>
  );
}