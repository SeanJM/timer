import * as React from "react";
import { withStore } from "@store";

function mapStateToProps(state, props) {
  return {
    ...state.form[props.id],
    ...props,
  }
}

interface FormProps extends JSX.ElementChildrenAttribute {
  id?: string;
  showValidation: boolean;
}

export function Form(props: FormProps) {
  const className = [];
  if (props.showValidation) {
    className.push("form--show-validation");
  }
  return (
    <form className={className.join(" ")}>{props.children}</form>
  );
}

export const FormConnect = withStore(Form, mapStateToProps)();