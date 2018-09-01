import React, { Component } from "react";
import { Button } from "@frontend/components/button";
import { InputText } from "@frontend/components/input";

interface Props {
  title: string;
  onValue: (value: string) => void;
}

interface State {
  showAdd: boolean;
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
          : <InputText
            onRef={(node: HTMLInputElement) => { this.node = node; }}
            autofocus
            onKeyDown={(e: any) => {
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
            }}/>
        }
        {this.state.showAdd
          ? (
            <Button
              icon="add"
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