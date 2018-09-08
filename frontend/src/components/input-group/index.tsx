import * as React from "react";
import { Label } from "@frontend/components/label";
import { dispatch } from "@frontend/action";
import { InputOnValue } from "types";

export interface InputGroupProps extends JSX.ElementChildrenAttribute {
  formid: string;
  name: string;
  required?: boolean;
}

interface InputGroupInputChildProps {
  formid: string;
  required: boolean;
  onValue: InputOnValue;
}

export function InputGroup(props: InputGroupProps) {
  const { formid, required, name } = props;
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
          } else {
            let inputGroupInputChildProps: InputGroupInputChildProps = {
              formid,
              required,
              onValue: (value: any, type: string) => {
                const { onValue } = child.props;
                if (props.formid) {
                  dispatch("FORM_VALUE", {
                    type,
                    value,
                    name,
                    id: formid,
                  });
                }

                if (onValue) {
                  onValue(value, name);
                }
              }
            };
            return React.cloneElement(child, inputGroupInputChildProps);
          }
        })
      }
    </div>
  );
}