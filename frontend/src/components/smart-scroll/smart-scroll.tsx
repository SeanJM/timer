import React from "react";

interface SmartScrollProps {
  className?: string;
}

interface SmartScrollState {
  showScrollBar: boolean;
}

export class SmartScroll extends React.Component<SmartScrollProps, SmartScrollState> {
  timer: any;
  contentNode: HTMLDivElement;
  scrollNode: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      showScrollBar: false,
    };
  }

  startScrollOverflowChecker() {
    const contentHeight = this.contentNode.getBoundingClientRect().height;
    const scrollHeight = this.scrollNode.getBoundingClientRect().height;
    const { showScrollBar } = this.state;

    if (contentHeight > scrollHeight && !showScrollBar) {
      this.setState({
        showScrollBar: true,
      });
    } else if (contentHeight < scrollHeight && showScrollBar) {
      this.setState({
        showScrollBar: false,
      });
    }

    this.timer = setTimeout(() => this.startScrollOverflowChecker(), 100);
  }

  stopScrollOverflowChecker() {
    clearTimeout(this.timer);
  }

  componentDidMount() {
    this.startScrollOverflowChecker();
  }

  componentWillUnmount() {
    this.stopScrollOverflowChecker();
  }

  render() {
    const { className } = this.props;
    const { showScrollBar } = this.state;
    const classList = [ "smart-scroll" ];

    if (className) {
      classList.push(className);
    }

    if (showScrollBar) {
      classList.push("smart-scroll--show-scrollbar");
    }

    return (
      <div
        ref={(node) => { this.scrollNode = node; }}
        className={classList.join(" ")}>
        <div
          ref={(node) => { this.contentNode = node; }}
          className="smart-scroll_content">{this.props.children}</div>
      </div>
    );
  }
}