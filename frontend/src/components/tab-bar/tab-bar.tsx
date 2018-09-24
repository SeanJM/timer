import React, { Children } from "react";

interface TabBarProps {
  children: JSX.Element[];
  className?: string;
}

interface TabProps extends JSX.ElementChildrenAttribute {
  index?: number;
  length?: number;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function Tab(props: TabProps) {
  const className = ["tab"];
  className.push("tab-" + props.index + "-" + props.length);
  if (props.isActive) {
    className.push("tab--active");
  }
  return (
    <div onClick={props.onClick} className={className.join(" ")}>
      <div className="tab_text">
        {props.children}
      </div>
    </div>
  );
}

export function TabBar(props: TabBarProps) {
  const className = ["tab-bar"];
  const children =
    Children.toArray(props.children) as React.ReactElement<TabProps>[];

  if (props.className) {
    className.push(props.className);
  }

  return (
    <div className={className.join(" ")}>
      {children.map((child, index) => {
        return React.cloneElement(child, {
          index: index + 1,
          length: children.length,
        });
      })}
    </div>
  );
}