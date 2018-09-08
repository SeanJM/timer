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
  | "tag"
  ;

interface IconProps {
  className?: string;
  fill?: string;
  type: IconType;
}

export function Icon(props: IconProps) {
  return (
    <svg className="icon" style={{fill: props.fill}}>
      <use href={"#icon-" + props.type}></use>
    </svg>
  );
}