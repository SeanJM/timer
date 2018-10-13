import React, { Component } from "react";
import { ListItemProps } from "./list-item";
import { KEYNAME_BY_CODE } from "@constants";

type ListSelectedIndex = number[];

export interface ListSelectEvent<T = {}> {
  type: string;
  targetProps: T;
}

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {
  id?: string;
  multiselect?: boolean;
  selectedIndex?: ListSelectedIndex;
  onSelect?: (e: ListSelectEvent) => void;
  onDeselect?: (e: ListSelectEvent) => void;
}

interface ListState {
  canSelectMulti: boolean;
  selectedIndex: ListSelectedIndex;
}

type ListChild = React.ReactElement<ListItemProps>;

export class List extends Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      selectedIndex: this.props.selectedIndex || [],
      canSelectMulti: false,
    };
  }

  childDidClick(e: React.MouseEvent, child: ListChild, index: number) {
    let selectedIndex = this.state.selectedIndex.slice();
    const indexOf = selectedIndex.indexOf(index);

    if (this.props.multiselect && this.state.canSelectMulti) {
      if (indexOf === -1) {
        selectedIndex.push(index);
      } else {
        selectedIndex.splice(indexOf, 1);
      }
    } else {
      selectedIndex = [index];
    }

    this.setState({ selectedIndex });

    if (this.props.onSelect && indexOf === -1) {
      this.props.onSelect({
        type: "listselect",
        targetProps: child.props,
      });
    } else if (this.props.onDeselect && indexOf !== -1) {
      this.props.onDeselect({
        type: "listselect",
        targetProps: child.props,
      });
    }

    if (child.props.onClick) {
      child.props.onClick(e);
    }
  }

  handleEvent(e: KeyboardEvent) {
    const isControl = KEYNAME_BY_CODE[e.which] === "CTRL";
    if (e.type === "keydown" && isControl) {
      this.setState({
        canSelectMulti: true
      });
    } else if (e.type === "keyup" && isControl) {
      this.setState({
        canSelectMulti: false
      });
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this);
    document.body.addEventListener("keyup", this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this);
    document.body.removeEventListener("keyup", this);
  }

  render() {
    const children =
      React.Children.toArray(this.props.children) as ListChild[];

    return (
      <div
        id={this.props.id}
        className="list"
      >
        {children.map((child, index) => {
          return React.cloneElement(child, {
            onClick: (e) => this.childDidClick(e, child, index),
            selected: this.state.selectedIndex.indexOf(index) !== -1,
          } as Partial<ListItemProps>);
        })}
      </div>
    );
  }
}