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
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
  dropdownNode: HTMLDivElement;
  parentContext: HTMLBaseElement;
  pollPositionSubscriber: { remove: () => void };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isEmpty: true,
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
        if (onInput) {
          onInput({
            id: children[selectedIndex].props.id
          });
        }
      }
    }
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
      document.body.appendChild(this.dropdownNode);
      this.dropdownNode.style.left = parentClientRect.left + "px";
      this.dropdownNode.style.width = parentClientRect.width + "px";
      this.dropdownNode.style.top = (parentClientRect.top + parentClientRect.height) + "px";

      anime({
        targets: [ this.dropdownNode ],
        opacity: [ 0, 1 ],
        duration: 200,
        easing: "easeInOutQuad"
      });

      this.dropdownNode.style.display = "";
      this.checkLengthOfChildren();
    }, 0);

    document.body.addEventListener("click", this);
    document.body.addEventListener("keydown", this);
  }

  render() {
    const { onInput } = this.props;
    const children =
      React.Children.toArray(this.props.children) as React.ReactElement<DropdownItemProps>[];

    return (
      <div className="dropdown-dummy-node">
        <div
          ref={(node) => { this.dropdownNode = node; }}
          className="dropdown"
          style={{
            display: "none",
          }}
        >
          <div className="dropdown_items">
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
    );
  }
}