import React, { Component } from "react";
import { Button } from "@frontend/components/button";
import { IconType } from "@frontend/components/icon";
import { InputValueEvent } from "types";

interface InputAndInputProps {
  title: string;
  name?: string;
  defaultValue?: string;
  icon?: IconType;
  component: React.ComponentType<any>;
  onValue?: (value: InputValueEvent) => void;
  onSubmit?: (value: string) => void;
}

interface State {
  showInput: boolean;
  value: undefined | string;
}

export interface TitleAndInputPassedProps {
  autofocus: boolean;
  defaultValue: any;
  onKeyDown: (e: any) => void;
  onValue: (e: InputValueEvent) => void;
}

export class TitleAndInput extends Component<InputAndInputProps, State> {
  InputComponent: any;

  constructor(props) {
    super(props);
    this.InputComponent = this.props.component;
    this.state = {
      showInput: false,
      value: this.props.defaultValue,
    };
  }

  onValue(e: InputValueEvent) {
    const { onValue } = this.props;

    this.setState({
      value: e.value
    });

    if (onValue) {
      onValue(e);
    }
  }

  onEnterKey() {
    this.props.onSubmit(this.state.value);
    this.setState({
      showInput: false,
      value: undefined
    });
  }

  onEscKey() {
    this.setState({
      showInput: false,
    });
  }

  onKeyDown(e: React.KeyboardEvent) {
    switch (e.which) {
      case 13: {
        this.onEnterKey();
        break;
      }
      case 27: {
        this.onEscKey();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultValue !== prevProps.defaultValue && !this.state.showInput) {
      this.props.onValue({
        name: this.props.name,
        type: "string",
        value: this.props.defaultValue || "",
      });
    }
  }

  render() {
    const className = ["title-and-input"];
    const { InputComponent } = this;

    if (this.state.showInput) {
      className.push("title-and-input--show-input");
    }

    console.log(this.props.title);

    return (
      <div className={className.join(" ")}>
        <div className="title-and-input_title">
          <h6>{this.props.title}</h6>
        </div>
        {this.state.showInput
          ? (
            <InputComponent
              autofocus={true}
              name={this.props.name}
              defaultValue={this.props.defaultValue}
              onValue={(e: InputValueEvent) => this.onValue(e)}
              onKeyDown={(e: React.KeyboardEvent) => this.onKeyDown(e)}
            />
          )
          : null
        }
        {this.state.showInput
          ? (
            <Button
              icon="close"
              onClick={() => {
                this.setState({
                  showInput: false,
                });
              }}
            />
          )
          : (
            <Button
              icon={this.props.icon || "add"}
              onClick={() => {
                this.setState({
                  showInput: true,
                });
              }}
            />
          )
        }
      </div>
    );
  }
}