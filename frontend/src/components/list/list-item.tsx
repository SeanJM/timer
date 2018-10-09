import React, { Component } from "react";
import { Link } from "@frontend/components/router";

interface ListItemProps extends Partial<JSX.ElementChildrenAttribute> {
  primaryAction?: JSX.Element;
  secondaryAction?: JSX.Element;
  timestamp?: JSX.Element;
  body?: JSX.Element;
  footer?: JSX.Element;
  to?: string;
  title?: string | number | JSX.Element;
  passive?: boolean;
  isActive?: boolean;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export class ListItem extends Component<ListItemProps> {
  secondaryNode: HTMLDivElement;
  primaryNode: HTMLDivElement;
  listItemNode: HTMLDivElement;

  componentDidMount() {
    if (this.secondaryNode) {
      let secondaryOffset = this.secondaryNode.getBoundingClientRect();
      this.listItemNode.style.paddingRight = secondaryOffset.width + "px";
    }
    if (this.primaryNode) {
      let primaryOffset = this.primaryNode.getBoundingClientRect();
      this.listItemNode.style.paddingLeft = primaryOffset.width + "px";
    }
  }

  render() {
    const {
      body,
      footer,
      isActive,
      onClick,
      passive,
      primaryAction,
      secondaryAction,
      timestamp,
      title,
      to,
    } = this.props;
    const className = ["list-item"];

    if (primaryAction) {
      className.push("list-item-primary-action");
    }

    if (secondaryAction) {
      className.push("list-item-secondary-action");
    }

    if (timestamp) {
      className.push("list-item-timestamp");
    }

    if (passive) {
      className.push("list-item-passive");
    }

    if (isActive) {
      className.push("list-item--active");
    }

    return (
      <div
        ref={(node) => {this.listItemNode = node;}}
        id={this.props.id}
        className={className.join(" ")}>
        {secondaryAction
          ? <div
            ref={(node) => {this.secondaryNode = node;}}
            className="list-item_secondary-action">{secondaryAction}</div>
          : null}
        {primaryAction
          ? <div
            ref={(node) => {this.primaryNode = node;}}
            className="list-item_primary-action">{primaryAction}</div>
          : null}
        <div className="list-item_content">
          {title
            ? (
              <div className="list-item_title">
                {typeof title === "function" ? title : <h6>{title}</h6>}
              </div>
            )
            : null}
          {timestamp
            ? <div className="list-item_timestamp">{timestamp}</div>
            : null}
          {body
            ? <div className="list-item_body">{body}</div>
            : null}
          {footer
            ? <div className="list-item_feet">{footer}</div>
            : null}
          {to
            ? <Link className="list-item_link" to={to} />
            : onClick
              ? <div className="list-item_link" onClick={onClick} />
              : null}
          {this.props.children}
        </div>
      </div>
    );
  }
}