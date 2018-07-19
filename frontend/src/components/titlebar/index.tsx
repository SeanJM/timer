import * as React from "react";

interface TitlebarProps {
  title: string;
}

export function Titlebar(props: TitlebarProps) {
  return (
    <div className="titlebar">
      <div className="titlebar_title">{props.title}</div>
    </div>
  );
}