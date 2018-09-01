import * as React from "react";
import { Label } from "@frontend/components/label";
import { dispatch } from "@frontend/action";
import { InputOnValue } from "types";

interface InputLabelProps extends JSX.ElementChildrenAttribute {
  formID: string;
  name: string;
  required?: boolean;
}

interface InputGroupInputChildProps {
  formID: string,
  required: boolean;
  onValue: InputOnValue,
}

export function InputGroup(props: InputLabelProps) {
  const { formID, required } = props;
  const children = React.Children.toArray(props.children) as JSX.Element[];

  const className = [
    "input-group",
  ];

  return (
    <div className={className.join(" ")}>
      {
        children.map((child) => {
          if (child.type === Label) {
            React.cloneElement(child, {
              required,
            });
          } else {
            let inputGroupInputChildProps: InputGroupInputChildProps = {
              formID,
              required,
              onValue: (value: any, type: string) => {
                const { onValue, name } = child.props;
                if (props.formID) {
                  dispatch("FORM_VALUE", {
                    type,
                    value,
                    name,
                    formID,
                  });
                }
                onValue && onValue(value, name);
              }
            };
            React.cloneElement(child, inputGroupInputChildProps);
          }
        })
      }
    </div>
  );
}