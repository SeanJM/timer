import React from "react";

export type IconType =
  | "add"
  | "check"
  | "close"
  | "filter"
  | "folder-add"
  | "folder";

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