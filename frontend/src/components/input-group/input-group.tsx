import * as React from "react";
import { Label } from "@frontend/components/label";
import { InputValueEvent } from "@types";

export interface InputGroupProps extends JSX.ElementChildrenAttribute {
  formid?: string;
  required?: boolean;
  onValue?: (e: InputValueEvent) => void;
}

export function InputGroup(props: InputGroupProps) {
  const { formid, required } = props;
  const children = React.Children.toArray(props.children) as JSX.Element[];
  const className = [
    "input-group",
  ];

  return (
    <div className={className.join(" ")}>
      {
        children.map((child) => {
          if (child.type === Label || child.type === "label") {
            return React.cloneElement(child, {
              required,
            });
          }
          return React.cloneElement(child, {
            formid,
            required,
            onValue: (e: InputValueEvent) => {
              const { onValue } = child.props;

              if (props.onValue) {
                props.onValue(e);
              }

              if (onValue) {
                onValue(e);
              }
            }
          });
        })
      }
    </div>
  );
}