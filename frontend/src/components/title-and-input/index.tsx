import React, { Component } from "react";
import { Button } from "@frontend/components/button";
import { IconType } from "@frontend/components/icon";

interface Props {
  title: string;
  defaultValue?: string;
  icon?: IconType;
  component: React.ComponentType<any>;
  onValue: (value: string) => void;
}

interface State {
  showAdd: boolean;
}

export interface TitleAndInputPassedProps {
  onRef: (node: HTMLInputElement) => void,
  autofocus: boolean,
  defaultValue: any,
  onKeyDown: (e: any) => void
}

export class TitleAndInput extends Component<Props, State> {
  node: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      showAdd: true,
    };
  }

  render() {
    const className = ["title-and-input"];

    if (!this.state.showAdd) {
      className.push("title-and-input--show-input");
    }

    return (
      <div className={className.join(" ")}>
        <h6>{this.props.title}</h6>
        {this.state.showAdd
          ? null
          : React.createElement(this.props.component, {
            onRef: (node: HTMLInputElement) => { this.node = node; },
            autofocus: true,
            defaultValue: this.props.defaultValue,
            onKeyDown: (e: any) => {
              if (e.which === 13) {
                this.setState({
                  showAdd: true,
                });
                this.props.onValue(this.node.value)
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
                })
              }}
            />
          )
          : (
          <Button
            icon="close"
            onClick={() => {
              this.setState({
                showAdd: true,
              })
            }}
          />
          )
        }
      </div>
    );
  }
}