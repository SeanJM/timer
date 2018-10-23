import React, { Component } from "react";
import { Link } from "@frontend/components/router";
import { ListContext, List } from "@components/list";

class ListItem extends Component<ListItem.Props> {
  secondaryNode: HTMLDivElement;
  primaryNode: HTMLDivElement;
  listItemNode: HTMLDivElement;
  dispatchClick: List.ContextValue["dispatchClick"];

  onClick = (e: React.MouseEvent) => {
    this.dispatchClick(e, this.props.id);
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  componentDidMount() {
    if (this.secondaryNode) {
      this.listItemNode.style.paddingLeft =
        this.secondaryNode.getBoundingClientRect().width + "px";
    }

    if (this.primaryNode) {
      this.listItemNode.style.paddingLeft =
        this.primaryNode.getBoundingClientRect().width + "px";
    }
  }

  render() {
    return (
      <ListContext.Consumer>
        {({ dispatchClick, selectedIDList }) => {
          const {
            active,
            body,
            id,
            passive,
            className,
            primaryAction,
            secondaryAction,
            timestamp,
            title,
            to,
          } = this.props;

          const classList = ["list-item"];

          if (primaryAction) {
            classList.push("list-item-primary-action");
          }

          if (secondaryAction) {
            classList.push("list-item-secondary-action");
          }

          if (timestamp) {
            classList.push("list-item-timestamp");
          }

          if (passive) {
            classList.push("list-item-passive");
          }

          if (active) {
            classList.push("list-item--active");
          }

          if (selectedIDList.indexOf(id) !== -1) {
            classList.push("list-item--selected");
          }

          if (className) {
            classList.push(className);
          }

          this.dispatchClick = dispatchClick;

          return (
            <div
              ref={(node) => {this.listItemNode = node;}}
              id={id}
              className={classList.join(" ")}>
              <div className="list-item-active"/>
              <div className="list-item-select"/>
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
                  : <div className="list-item_link" onClick={this.onClick}/>}
                {this.props.children}
              </div>
            </div>
          );
        }}
      </ListContext.Consumer>
    );
  }
}

namespace ListItem {
  export interface Props extends Partial<JSX.ElementChildrenAttribute> {
    active?: boolean;
    body?: JSX.Element;
    className?: string;
    id: string;
    onClick?: (e: React.MouseEvent) => void;
    passive?: boolean;
    primaryAction?: JSX.Element;
    secondaryAction?: JSX.Element;
    selected?: boolean;
    timestamp?: JSX.Element;
    title?: string | number | JSX.Element;
    to?: string;
  }
}

export { ListItem };