import * as React from "react";
import { withStore } from "@frontend/store";
import { dispatch } from "@frontend/action";

function mapStateToProps(state, props) {
  return {
    ...state.form[props.id],
    ...props,
  };
}

interface FormProps extends JSX.ElementChildrenAttribute {
  id?: string;
  type?: "borderless";
  showValidation?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

export function Form(props: FormProps) {
  const className = [];
  const { onSubmit } = props;

  if (props.showValidation) {
    className.push("form--show-validation");
  }

  if (props.type) {
    className.push("form--" + props.type);
  }

  return (
    <form
      className={className.join(" ")}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit(e);
        }
      }}
    >
      {React.Children.toArray(props.children).map((child: JSX.Element) => {
        if (typeof child.type === "function") {
          return React.cloneElement(child, {
            formid: props.id,
            onValue: (e) => {
              if (props.id) {
                dispatch("FORM_VALUE", {
                  type: e.type,
                  value: e.value,
                  name: e.name,
                  id: props.id,
                });
              }
            }
          });
        }
        return child;
      })}
    </form>
  );
}

export const FormConnect = withStore<FormProps>(Form, mapStateToProps)();