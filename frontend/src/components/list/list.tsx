import React, { Component } from "react";
import { KEYNAME_BY_CODE } from "@constants";
import { ListItemProps } from "./list-item";
import ShortCut from "@shortcut";

type ListSelectedIndex = string[];

export interface ListSelectEvent {
  type: string;
  selected: string[];
  deselected: string[];
  target: string;
}

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {
  id?: string;
  multiselect?: boolean;
  onSelect?: (e: ListSelectEvent) => void;
  selectedIDList?: ListSelectedIndex;
  shortcuts?: { [ key: string ]: (e: ShortCut.Event) => void };
}

interface ListState {
  controlPressed: boolean;
  shiftPressed: boolean;
  selectedIDList: ListSelectedIndex;
}

type ListChild = React.ReactElement<ListItemProps>;

export class List extends Component<ListProps, ListState> {
  node: HTMLDivElement;
  shortcut: ShortCut;
  previousIndex: number;
  firstIndex: number;
  indexByID: string[];

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

    this.indexByID = [];
    this.previousIndex = -1;
    this.firstIndex = -1;
  }

  userDidSelect(prevSelectedIDList, nextSelectedIDList, index) {
    const { onSelect } = this.props;
    const children = [].concat(this.props.children) as ListChild[];
    const n = children.length;
    let selected = [];
    let deselected = [];
    let i = -1;

    if (onSelect) {
      while (++i < n) {
        let props = children[i].props;
        if (nextSelectedIDList.indexOf(props.id) !== -1) {
          selected.push(props.id);
        } else if (prevSelectedIDList.indexOf(props.id) !== -1) {
          deselected.push(props.id);
        }
      }

      onSelect({
        type: "listselect",
        selected,
        deselected,
        target: children[index].props.id,
      });
    }
  }

  selectIndex(index: number) {
    let selectedIDList = this.state.selectedIDList
      .slice()
      .sort((a, b) => {
        return this.indexByID.indexOf(a) - this.indexByID.indexOf(b);
      });

    const children = [].concat(this.props.children) as ListChild[];
    const childID = children[index].props.id;
    const { controlPressed, shiftPressed } = this.state;
    let nextSelectedIndex = selectedIDList.indexOf(childID);

    if (this.props.multiselect && (controlPressed || shiftPressed)) {
      if (controlPressed) {
        if (nextSelectedIndex === -1) {
          selectedIDList.push(childID);
        } else {
          selectedIDList.splice(nextSelectedIndex, 1);
        }
      }

      if (shiftPressed) {
        selectedIDList = [];
        if (index > this.firstIndex) {
          let i = this.firstIndex - 1;
          let n = index + 1;
          while (++i < n) {
            selectedIDList.push(this.indexByID[i]);
          }
        } else {
          let i = index - 1;
          let n = this.firstIndex + 1;
          while (++i < n) {
            selectedIDList.push(this.indexByID[i]);
          }
        }
      }
    } else {
      this.firstIndex = index;
      selectedIDList = [ children[index].props.id ];
    }

    this.userDidSelect(this.state.selectedIDList, selectedIDList, index);
    this.previousIndex = index;
    this.setState({ selectedIDList });
  }

  indexChildrenByID() {
    const children = [].concat(this.props.children) as ListChild[];
    let i = -1;
    const n = children.length;
    const indexByID = [];

    while (++i < n) {
      indexByID.push(children[i].props.id);
    }

    this.indexByID = indexByID;
  }

  onClick(e: React.MouseEvent, index: number) {
    const children = React.Children.toArray(this.props.children) as ListChild[];
    this.selectIndex(index);
    if (children[index].props.onClick) {
      children[index].props.onClick(e);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    const keyname = KEYNAME_BY_CODE[e.which];

    if (keyname === "CTRL") {
      this.setState({
        controlPressed: true
      });
    } else if (keyname === "SHIFT") {
      this.setState({
        shiftPressed: true
      });
    } else if (e.target === this.node && keyname === "ESC") {
      this.setState({
        selectedIDList: []
      });
    } else if (e.target === this.node) {
      if (keyname === "DOWN") {
        this.selectIndex(Math.min(this.previousIndex + 1, [].concat(this.props.children).length - 1));
      } else if (keyname === "UP") {
        this.selectIndex(Math.max(0, this.previousIndex - 1));
      }
    }
  }

  onKeyUp(e: KeyboardEvent) {
    const keyname = KEYNAME_BY_CODE[e.which];

    if (keyname === "CTRL") {
      this.setState({
        controlPressed: false
      });
    } else if (keyname === "SHIFT") {
      this.setState({
        shiftPressed: false
      });
    }
  }

  handleEvent(e: { type: string }) {
    if (e.type === "keydown") {
      this.onKeyDown(e as KeyboardEvent);
    } else if (e.type === "keyup") {
      this.onKeyUp(e as KeyboardEvent);
    }
  }

  componentDidMount() {
    if (this.props.shortcuts) {
      this.shortcut = new ShortCut(this.node, this.props.shortcuts);
    }

    this.indexChildrenByID();
    document.body.addEventListener("keydown", this);
    document.body.addEventListener("keyup", this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this);
    document.body.removeEventListener("keyup", this);
  }

  getID(indexList: number[], children: ListChild[]) {
    return indexList.map((index) => children[index] ? children[index].props.id : null);
  }

  componentDidUpdate(prevProps) {
    const prevChildren = [].concat(prevProps.children);
    const nextChildren = [].concat(this.props.children);

    const prevChildrenLen = prevChildren.length;
    const nextChildrenLen = nextChildren.length;
    const prevMidIndex = Math.floor(prevChildren[prevChildrenLen / 2]);
    const nextMidIndex = Math.floor(nextChildren[nextChildrenLen / 2]);

    const prevIDList = this.getID([ 0, prevMidIndex, prevChildrenLen - 1 ], prevChildren);
    const nextIDList = this.getID([ 0, nextMidIndex, nextChildrenLen - 1 ], nextChildren);

    if (prevChildrenLen !== nextChildrenLen || prevIDList[0] !== nextIDList[0] || prevIDList[1] !== nextIDList[1] || prevIDList[2] !== nextIDList[2]) {
      this.indexChildrenByID();
    }
  }

  render() {
    const children =
      React.Children.toArray(this.props.children) as ListChild[];

    return (
      <div
        className="list"
        id={this.props.id}
        ref={(node) => { this.node = node; }}
        tabIndex={0}
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