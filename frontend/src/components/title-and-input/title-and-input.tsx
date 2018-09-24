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
  showAdd: boolean;
  value: undefined | string;
}

export interface TitleAndInputPassedProps {
  autofocus: boolean;
  defaultValue: any;
  onKeyDown: (e: any) => void;
  onValue: (e: InputValueEvent) => void;
}

export class TitleAndInput extends Component<InputAndInputProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: true,
      value: this.props.defaultValue,
    };
  }

  onValue(e: InputValueEvent) {
    console.log(e);
    const { onValue } = this.props;

    this.setState({
      value: e.value
    });

    if (onValue) {
      onValue(e);
    }
  }

  onEnterKey() {
    this.setState({
      showAdd: true,
    });

    this.props.onSubmit(this.state.value);

    this.setState({
      value: undefined
    });
  }

  onEscKey() {
    this.setState({
      showAdd: true,
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

  render() {
    console.log(this.props.defaultValue);
    const className = ["title-and-input"];

    if (!this.state.showAdd) {
      className.push("title-and-input--show-input");
    }

    return (
      <div className={className.join(" ")}>
        <div className="title-and-input_title">
          <h6>{this.props.title}</h6>
        </div>
        {React.createElement(this.props.component, {
          autofocus: true,
          name: this.props.name,
          defaultValue: this.props.defaultValue,
          style: { display: this.state.showAdd ? "none" : "" },
          onValue: (e: InputValueEvent) => this.onValue(e),
          onKeyDown: (e: React.KeyboardEvent) => this.onKeyDown(e)
        } as TitleAndInputPassedProps)}
        {this.state.showAdd
          ? (
            <Button
              icon={this.props.icon || "add"}
              onClick={() => {
                this.setState({
                  showAdd: false,
                });
              }}
            />
          )
          : (
            <Button
              icon="close"
              onClick={() => {
                this.setState({
                  showAdd: true,
                });
              }}
            />
          )
        }
      </div>
    );
  }
}