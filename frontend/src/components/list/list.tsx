import React, { Component } from "react";
import ShortCut from "@shortcut";
import { KEYNAME_BY_CODE } from "@constants";
import { ListItem } from "./list-item";

export const ListContext = React.createContext<List.ContextValue>({} as List.ContextValue);

type ListChild = React.ReactElement<ListItem.Props>;

class List extends Component<List.Props, List.State> {
  node: HTMLDivElement;
  shortcut: ShortCut;
  previousIndex: number;
  firstIndex: number;
  indexByID: string[];

  constructor(props: List.Props) {
    super(props);

    this.state = {
      controlPressed: false,
      selectedIDList: [].concat(this.props.selectedIDList) || [],
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

  selectByIndex(index: number) {
    let selectedIDList = this.state.selectedIDList
      .slice()
      .sort((a, b) => {
        return this.indexByID.indexOf(a) - this.indexByID.indexOf(b);
      });

    const children = [].concat(this.props.children) as ListChild[];
    const id = children[index].props.id;
    const { controlPressed, shiftPressed } = this.state;
    let nextSelectedIndex = selectedIDList.indexOf(id);

    if (this.props.multiselect && (controlPressed || shiftPressed)) {
      if (controlPressed) {
        if (nextSelectedIndex === -1) {
          selectedIDList.push(id);
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

  dispatchClick = (e: React.MouseEvent, id: string) => {
    this.selectByIndex(this.indexByID.indexOf(id));
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
        const length = [].concat(this.props.children).length - 1;
        this.selectByIndex(Math.min(this.previousIndex + 1, length));
      } else if (keyname === "UP") {
        this.selectByIndex(Math.max(0, this.previousIndex - 1));
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
    this.indexChildrenByID();
  }

  render() {
    const classList = ["list"];
    const { className } = this.props;

    if (className) {
      classList.push(className);
    }

    return (
      <ListContext.Provider value={{
        selectedIDList: this.state.selectedIDList,
        dispatchClick: this.dispatchClick,
      }}>
        <div
          className={classList.join(" ")}
          id={this.props.id}
          ref={(node) => { this.node = node; }}
          tabIndex={0}
        >
          {this.props.children}
        </div>
      </ListContext.Provider>
    );
  }
}

namespace List {
  export interface SelectEvent {
    type: string;
    selected: string[];
    deselected: string[];
    target: string;
  }

  export interface ContextValue {
    selectedIDList: string[];
    dispatchClick: (e: React.MouseEvent, id: string) => void;
  }

  export interface Props extends Partial<JSX.ElementChildrenAttribute> {
    className?: string;
    id?: string;
    multiselect?: boolean;
    onSelect?: (e: List.SelectEvent) => void;
    selectedIDList?: string[] | string;
    shortcuts?: { [ key: string ]: (e: ShortCut.Event) => void };
  }

  export interface State {
    controlPressed: boolean;
    shiftPressed: boolean;
    selectedIDList: string[];
  }
}

export { List };