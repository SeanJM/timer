import React from "react";

interface SwitchProps {
  check: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function Switch(props: SwitchProps) {
  const className = ["switch"];

  const {
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
  } = props;

  if (props.check) {
    className.push("switch-checked");
  } else {
    className.push("switch-unchecked");
  }

  return (
    <div
      tabIndex={0}
      onClick={(e) => onClick && onClick(e)}
      onFocus={(e) => onFocus && onFocus(e)}
      onBlur={(e) => onBlur && onBlur(e)}
      onKeyDown={(e) => onKeyDown && onKeyDown(e)}
      className={className.join(" ")}>
      <div className="switch_chrome" />
      <div className="switch_thumb" />
    </div>
  );
}