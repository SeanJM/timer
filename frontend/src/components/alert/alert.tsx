import React from "react";
import { Titlebar } from "@components/titlebar";

interface AlertProps {
  title: string;
  content: JSX.Element;
  control: JSX.Element;
}

export class Alert extends React.Component<AlertProps> {
  render() {
    return (
      <div className="alert">
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