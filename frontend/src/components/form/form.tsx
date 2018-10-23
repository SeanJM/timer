import * as React from "react";
import { InputValueEvent } from "@types";

class Form extends React.Component<Form.Props> {
  value: Form.Value;

  constructor(props) {
    super(props);
    this.value = {};
  }

  onValue(e: InputValueEvent) {
    const {
      onChange,
    } = this.props;

    this.value[e.name] = e.value;
    if (onChange) {
      let evt = {
        type: "formchange",
        value: this.value
      };

      if (typeof onChange === "function") {
        onChange(evt);
      } else {
        onChange.handleEvent(evt);
      }
    }
  }

  render() {
    const classList = [];

    const {
      onSubmit,
      showValidation,
      type,
    } = this.props;

    if (showValidation) {
      classList.push("form--show-validation");
    }

    if (type) {
      classList.push("form--" + type);
    }

    return (
      <form
        className={classList.join(" ")}
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit(e);
          }
        }}
      >
        {React.Children.toArray(this.props.children).map((child: JSX.Element) => {
          if (typeof child.type === "function") {
            return React.cloneElement(child, {
              onValue: (e: InputValueEvent) => this.onValue(e),
            });
          }
          return child;
        })}
      </form>
    );
  }
}

namespace Form {
  export interface Props extends JSX.ElementChildrenAttribute {
    id?: string;
    type?: "borderless";
    showValidation?: boolean;
    onSubmit?: (e: React.FormEvent) => void;
    onChange?: Form.OnChangeFunction | { handleEvent: Form.OnChangeFunction };
    [key: string]: any;
  }

  export type Value<T = {}> = Partial<T> & {
    [key: string]: InputValueEvent["value"];
  };

  export interface ChangeEvent {
    type: string;
    value: Form.Value;
  }

  export interface OnChangeFunction {
    (e: Form.ChangeEvent): void;
  }
}

export { Form };