import React, { Component } from "react";
import { DropdownItemProps } from "./dropdown-item";
import { KEYNAME_BY_CODE } from "@constants";
import anime from "animejs";

export interface DropdownChangeEvent extends Pick<DropdownItemProps, "id"> {}

interface DropdownProps {
  children: JSX.Element[];
  selectedIndex?: number;
  onBlur?: () => void;
  onInput?: (e: DropdownChangeEvent) => void;
  left?: number;
  right?: number;
  show?: boolean;
  top?: number;
  width?: number;
}

interface DropdownState {
  selectedIndex: number;
  isEmpty: boolean;
  isScrolling: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  dropdownNode: HTMLDivElement;
  dropdownItems: HTMLDivElement;
  parentContext: HTMLBaseElement;
  pollPositionSubscriber: { remove: () => void };
  maxHeight: number;

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isEmpty: true,
      isScrolling: false,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const nextChildren = React.Children.toArray(this.props.children);
    const prevChildren = React.Children.toArray(prevProps.children);
    if (nextChildren.length !== prevChildren.length) {
      this.setState({
        selectedIndex: 0
      });
      this.checkLengthOfChildren();
      this.resize();
    }
  }

  increaseIndex() {
    const children = React.Children.toArray(this.props.children);
    return {
      selectedIndex: Math.min(this.state.selectedIndex + 1, children.length)
    };
  }

  decreaseIndex() {
    return {
      selectedIndex: Math.max(this.state.selectedIndex - 1, 0)
    };
  }

  checkLengthOfChildren() {
    const children = React.Children.toArray(this.props.children);
    if (children.length) {
      this.dropdownNode.style.display = "";
    } else {
      this.dropdownNode.style.display = "none";
    }
  }

  onClick(e: MouseEvent) {
    const { onBlur } = this.props;
    const target = e.target as HTMLBaseElement;
    if (!this.parentContext.contains(target) && onBlur) {
      setTimeout(() => onBlur(), 50);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    const {
      children,
      onBlur,
      onInput,
    } = this.props;

    const {
      selectedIndex
    } = this.state;

    switch (KEYNAME_BY_CODE[e.which]) {
      case "ESC": {
        if (onBlur) {
          onBlur();
        }
        break;
      }

      case "UP": {
        this.setState(this.decreaseIndex);
        break;
      }

      case "DOWN": {
        this.setState(this.increaseIndex);
        break;
      }

      case "ENTER": {
        if (onInput && children[selectedIndex]) {
          onInput({
            id: children[selectedIndex].props.id
          });
        }
      }
    }
  }

  resize() {
    const height =
      this.dropdownItems.getBoundingClientRect().height;
    this.setState({
      height: Math.min(this.maxHeight, height),
      isScrolling: height > this.maxHeight,
    });
  }

  handleEvent(e: MouseEvent | KeyboardEvent) {
    switch (e.type) {
      case "click": {
        this.onClick(e as MouseEvent);
        break;
      }

      case "keydown": {
        this.onKeyDown(e as KeyboardEvent);
      }
    }
  }

  pollPosition() {
    let isActive = true;
    let timer;

    const checker = () => {
      const parentNodeClientRect = this.parentContext.getBoundingClientRect();
      const dropdownNodeClientRect = this.dropdownNode.getBoundingClientRect();
      let parentNodeClientBottom = parentNodeClientRect.top + parentNodeClientRect.height;

      if (parentNodeClientBottom !== dropdownNodeClientRect.top) {
        this.dropdownNode.style.top = parentNodeClientBottom + "px";
      }

      if (isActive) {
        timer = setTimeout(checker, 10);
      }
    };

    checker();

    return {
      remove: () => {
        isActive = false;
        clearTimeout(timer);
      }
    };
  }

  componentWillUnmount() {
    document.body.removeChild(this.dropdownNode);
    document.body.removeEventListener("click", this);
    document.body.removeEventListener("keydown", this);
    this.pollPositionSubscriber.remove();
  }

  componentDidMount() {
    this.parentContext = this.dropdownNode.parentNode.parentNode as HTMLBaseElement;
    this.pollPositionSubscriber = this.pollPosition();

    setTimeout(() => {
      const parentClientRect = this.parentContext.getBoundingClientRect();
      let top = (parentClientRect.top + parentClientRect.height);
      document.body.appendChild(this.dropdownNode);
      this.maxHeight = (window.innerHeight * 0.4);

      if (top + this.maxHeight > window.innerHeight) {
        top = window.innerHeight - (this.maxHeight * 1.1);
      }

      this.setState({
        left: parentClientRect.left,
        width: parentClientRect.width,
        top,
      }, () => {

        anime({
          targets: [ this.dropdownNode ],
          opacity: [ 0, 1 ],
          duration: 200,
          easing: "easeInOutQuad"
        });

        this.dropdownNode.style.display = "";
        this.checkLengthOfChildren();
      });
    }, 0);

    setTimeout(() => this.resize(), 10);
    document.body.addEventListener("click", this);
    document.body.addEventListener("keydown", this);
  }

  render() {
    const { onInput } = this.props;
    const classList = ["dropdown"];

    const children =
      React.Children.toArray(this.props.children) as React.ReactElement<DropdownItemProps>[];

    if (this.state.isScrolling) {
      classList.push("dropdown--is-scrolling");
    }

    return (
      <div className="dropdown-dummy-node">
        <div
          ref={(node) => { this.dropdownNode = node; }}
          className={classList.join(" ")}
          style={{
            display: "none",
            left: this.state.left,
            width: this.state.width,
            top: this.state.top,
            height: this.state.height,
          }}
        >
          <div className="dropdown_inner">
            <div ref={(node) => { this.dropdownItems = node; }} className="dropdown_items">
              {children.map((child, index) => {
                return React.cloneElement(child, {
                  selected: this.state.selectedIndex === index,

                  onMouseEnter: () => this.setState({
                    selectedIndex: index
                  }),

                  onClick: () => onInput({ id: child.props.id }),
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}