import React from "react";
import anime from "animejs";
import { Titlebar } from "@components/titlebar";
import { KEYNAME_BY_CODE } from "@constants";

interface AlertProps {
  title: string;
  content: JSX.Element;
  control: JSX.Element;
  onEsc?: () => void;
}

export class Alert extends React.Component<AlertProps> {
  node: HTMLDivElement;

  handleEvent(e: KeyboardEvent) {
    if (KEYNAME_BY_CODE[e.which] === "ESC" && this.props.onEsc) {
      this.props.onEsc();
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this);

    anime({
      targets: [this.node],

      scale: {
        value: [ 0.8, 1 ],
        duration: 600,
        elasticity: 300,
      },

      opacity: {
        value: [ 0, 1 ],
        easing: "easeOutQuad",
        duration: 300,
      },
    });
  }

  render() {
    return (
      <div
        className="alert"
        ref={(node) => { this.node = node; }}
      >
        <Titlebar>
          <h6>{this.props.title}</h6>
        </Titlebar>
        <div className="alert_content">{this.props.content}</div>
        <div className="alert_footer">
          {this.props.control}
        </div>
      </div>
    );
  }
}