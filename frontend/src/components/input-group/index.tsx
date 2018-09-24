import * as React from "react";
import { Label } from "@frontend/components/label";
import { dispatch } from "@frontend/action";
import { InputValueEvent } from "@types";

export interface InputGroupProps extends JSX.ElementChildrenAttribute {
  formid?: string;
  name: string;
  required?: boolean;
}

interface InputGroupInputChildProps {
  formid: string;
  required: boolean;
  name: string;
  onValue: (e: InputValueEvent) => void;
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
              name,
              onValue: (e: InputValueEvent) => {
                const { onValue } = child.props;

                if (onValue) {
                  onValue(e);
                }

                if (props.formid) {
                  dispatch("FORM_VALUE", {
                    type: e.type,
                    value: e.value,
                    name: e.name,
                    id: formid,
                  });
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