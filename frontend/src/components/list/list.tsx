import React, { Component } from "react";
import { KEYNAME_BY_CODE } from "@constants";
import { ListItemProps } from "./list-item";

type ListSelectedIndex = string[];

export interface ListSelectEvent<T = {}> {
  type: string;
  selected: T[];
  deselected: T[];
  target: T;
}

export interface ListKeyboardEvent<T = {}> {
  keyname: string;
  which: number;
  selected: T[];
  type: string;
}

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {
  id?: string;
  multiselect?: boolean;
  selectedIDList?: ListSelectedIndex;
  onSelect?: (e: ListSelectEvent) => void;
  onKeyDown?: (e: ListKeyboardEvent) => void;
}

interface ListState {
  controlPressed: boolean;
  shiftPressed: boolean;
  selectedIDList: ListSelectedIndex;
}

type ListChild = React.ReactElement<ListItemProps>;

export class List extends Component<ListProps, ListState> {
  constructor(props: ListProps) {
    const children = React.Children.toArray(props.children) as ListChild[];
    let i = -1;
    const n = children.length;

    while (++i < n) {
      if (!children[i].props.id) {
        throw new Error("List children require an id");
      }
    }

    super(props);
    this.state = {
      controlPressed: false,
      selectedIDList: this.props.selectedIDList || [],
      shiftPressed: false,
    };
  }

  onClick(e: React.MouseEvent, index: number) {
    let prevSelectedIndex = this.state.selectedIDList;
    let selectedIDList = this.state.selectedIDList.slice();

    const children = React.Children.toArray(this.props.children) as ListChild[];
    const childID = children[index].props.id;
    const indexOf = selectedIDList.findIndex((id) => id === childID);
    const { controlPressed, shiftPressed } = this.state;

    if (this.props.multiselect && (controlPressed || shiftPressed)) {
      if (controlPressed) {
        if (indexOf === -1) {
          selectedIDList.push(childID);
        } else {
          selectedIDList.splice(indexOf, 1);
        }
      }

      if (shiftPressed) {
        let lastID = selectedIDList.slice(-1)[0];
        let i = children.findIndex((child) => child.props.id === lastID);

        if (i < index) {
          const n = index + 1;
          while (++i < n) {
            selectedIDList.push(children[i].props.id);
          }
        } else {
          while (i > index) {
            selectedIDList.push(children[i].props.id);
            i--;
          }
        }
      }
    } else {
      selectedIDList = [ children[index].props.id ];
    }

    this.setState({ selectedIDList });

    if (this.props.onSelect) {
      let selected = [];
      let deselected = [];
      let i = -1;
      const n = children.length;

      while (++i < n) {
        let props = children[i].props;
        if (selectedIDList.indexOf(props.id) !== -1) {
          selected.push(props);
        } else if (prevSelectedIndex.indexOf(props.id) !== -1) {
          deselected.push(props);
        }
      }

      this.props.onSelect({
        type: "listselect",
        selected,
        deselected,
        target: children[index].props,
      });
    }

    if (children[index].props.onClick) {
      children[index].props.onClick(e);
    }
  }

  onKeyDown(e: React.KeyboardEvent) {
    const children = React.Children.toArray(this.props.children) as ListChild[];
    const { onKeyDown } = this.props;
    const { selectedIDList } = this.state;

    if (onKeyDown) {
      const selected = [];
      let i = -1;
      const n = children.length;

      while (++i < n) {
        if (selectedIDList.indexOf(children[i].props.id) !== -1) {
          selected.push(children[i].props.id);
        }
      }

      onKeyDown({
        keyname: KEYNAME_BY_CODE[e.which],
        selected,
        type: "listkeydown",
        which: e.which,
      });
    }
  }

  handleEvent(e: KeyboardEvent) {
    const isControl = KEYNAME_BY_CODE[e.which] === "CTRL";
    const isShift = KEYNAME_BY_CODE[e.which] === "SHIFT";

    if (e.type === "keydown") {
      if (isControl) {
        this.setState({
          controlPressed: true
        });
      } else if (isShift) {
        this.setState({
          shiftPressed: true
        });
      }
    } else {
      if (isControl) {
        this.setState({
          controlPressed: false
        });
      } else if (isShift) {
        this.setState({
          shiftPressed: false
        });
      }
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
        className="list"
        id={this.props.id}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => { this.onKeyDown(e); }}
      >
        {children.map((child, index) => {
          return React.cloneElement(child, {
            onClick: (e) => this.onClick(e, index),
            selected: this.state.selectedIDList.indexOf(child.props.id) !== -1,
          } as Partial<ListItemProps>);
        })}
      </div>
    );
  }
}