import * as React from "react";
import { withStore } from "@frontend/store";

function mapStateToProps(state, props) {
  return {
    ...state.form[props.id],
    ...props,
  }
}

interface FormProps extends JSX.ElementChildrenAttribute {
  id?: string;
  showValidation?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

export function Form(props: FormProps) {
  const className = [];
  const { onSubmit } = props;

  if (props.showValidation) {
    className.push("form--show-validation");
  }

  return (
    <form
      className={className.join(" ")}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
    >
      {props.children}
    </form>
  );
}

export const FormConnect = withStore<FormProps>(Form, mapStateToProps)();