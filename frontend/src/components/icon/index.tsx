import React from "react";

export type IconType =
  | "add"
  | "book"
  | "check"
  | "close"
  | "filter"
  | "folder-add"
  | "folder"
  | "history-back"
  | "tag";

interface IconProps {
  className?: string;
  type: IconType;
}

export default function (props: IconProps) {
  return (
    <svg className="icon">
      <use href={"#icon-" + props.type}></use>
    </svg>
  );
}