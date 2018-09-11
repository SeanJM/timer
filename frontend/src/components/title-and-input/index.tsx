import React, { Component } from "react";
import { Button } from "@frontend/components/button";
import { IconType } from "@frontend/components/icon";

interface Props {
  title: string;
  defaultValue?: string;
  icon?: IconType;
  component: React.ComponentType<any>;
  onSubmit: (value: string) => void;
}

interface State {
  showAdd: boolean;
  value: undefined | string;
}

export interface TitleAndInputPassedProps {
  autofocus: boolean;
  defaultValue: any;
  onKeyDown: (e: any) => void;
  onValue: (e: any) => void;
}

export class TitleAndInput extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: true,
      value: this.props.defaultValue,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      });
    }
  }

  render() {
    const className = ["title-and-input"];

    if (!this.state.showAdd) {
      className.push("title-and-input--show-input");
    }

    return (
      <div className={className.join(" ")}>
        <div className="title-and-input_title">
          <h6>{this.props.title}</h6>
        </div>
        {this.state.showAdd
          ? null
          : React.createElement(this.props.component, {
            autofocus: true,
            defaultValue: this.state.value || this.props.defaultValue,
            onValue: (value: any) => {
              this.setState({
                value
              });
            },
            onKeyDown: (e: any) => {
              if (e.which === 13) {
                this.setState({
                  showAdd: true,
                });
                this.props.onSubmit(this.state.value);
                this.setState({
                  value: undefined
                });
              } else if (e.which === 27) {
                this.setState({
                  showAdd: true,
                });
              }
            }
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