import * as React from "react";
import { InputValueEvent } from "@types";

export type FormValue<T = {}> = Partial<T> & {
  [key: string]: InputValueEvent["value"];
};

interface FormChangeEvent {
  type: string;
  value: FormValue;
}

interface FormOnChangeFunction {
  (e: FormChangeEvent): void;
}

interface FormProps extends JSX.ElementChildrenAttribute {
  id?: string;
  type?: "borderless";
  showValidation?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  onChange?: FormOnChangeFunction | { handleEvent: FormOnChangeFunction };
  [key: string]: any;
}

export class FormConnect extends React.Component<FormProps> {
  value: FormValue;

  constructor(props) {
    super(props);
    this.value = {};
  }

  onValue(e: InputValueEvent) {
    const {
      onChange,
    } = this.props;

    console.log(e);

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
      id,
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
              formid: id,
              onValue: (e: InputValueEvent) => this.onValue(e),
            });
          }
          return child;
        })}
      </form>
    );
  }
}