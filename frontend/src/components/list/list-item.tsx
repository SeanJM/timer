import React, { Component } from "react";
import { Link } from "@frontend/components/router";
import { ListItemAltAction } from "./list-item_alt-action";
import anime from "animejs";

export interface ListItemProps extends Partial<JSX.ElementChildrenAttribute> {
  altAction?: JSX.Element;
  body?: JSX.Element;
  id?: string;
  active?: boolean;
  selected?: boolean;
  passive?: boolean;
  primaryAction?: JSX.Element;
  secondaryAction?: JSX.Element;
  showAlt?: boolean;
  timestamp?: JSX.Element;
  title?: string | number | JSX.Element;
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export class ListItem extends Component<ListItemProps> {
  secondaryNode: HTMLDivElement;
  primaryNode: HTMLDivElement;
  listItemNode: HTMLDivElement;
  controlBoundsNode: HTMLDivElement;

  altActionDidReceiveBoundingBox(e: ClientRect) {
    setTimeout(() => {
      anime({
        targets: [ this.listItemNode ],
        paddingLeft: [ 0, e.width ],
        easing: "easeOutQuad",
        duration: 200,
      });
    });
  }

  componentDidUpdate(prevProps: ListItemProps) {
    if (prevProps.showAlt && !this.props.showAlt) {
      setTimeout(() => {
        anime({
          targets: [ this.listItemNode ],
          paddingLeft: 0,
          easing: "easeOutQuad",
          duration: 100,
        });
      }, 10);
    }
  }

  render() {
    const {
      active,
      altAction,
      body,
      onClick,
      passive,
      primaryAction,
      secondaryAction,
      selected,
      showAlt,
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

    if (active) {
      className.push("list-item--active");
    }

    if (selected) {
      className.push("list-item--selected");
    }

    return (
      <div
        ref={(node) => {this.listItemNode = node;}}
        id={this.props.id}
        className={className.join(" ")}>
        {altAction && showAlt
          ? <ListItemAltAction onBoundingBox={(e) => this.altActionDidReceiveBoundingBox(e)}>{altAction}</ListItemAltAction>
          : null}

        <div className="list-item-active"/>
        <div className="list-item-select"/>

        <div
          ref={(node) => { this.controlBoundsNode = node; }}
          className="list-item_control-bounds"
        >
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
            {to
              ? <Link className="list-item_link" to={to} />
              : onClick
                ? <div className="list-item_link" onClick={onClick} />
                : null}
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}