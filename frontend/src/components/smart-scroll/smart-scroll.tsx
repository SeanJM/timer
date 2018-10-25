import React from "react";

interface SmartScrollProps {
  className?: string;
  footer?: JSX.Element;
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

  scrollNodeRef = (node) => { this.scrollNode = node; }
  contentNodeRef = (node) => { this.contentNode = node; }

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
    const { className, footer } = this.props;
    const { showScrollBar } = this.state;
    const classList = [ "smart-scroll" ];

    if (className) {
      classList.push(className);
    }

    if (footer) {
      classList.push("smart-scroll--footer");
    }

    if (showScrollBar) {
      classList.push("smart-scroll--show-scrollbar");
    }

    return (
      <div
        className={classList.join(" ")}>
        <div
          ref={this.scrollNodeRef}
          className="smart-scroll-scrollable"
        >
          <div
            ref={this.contentNodeRef}
            className="smart-scroll_content">{this.props.children}</div>
        </div>
        {footer ? <div className="smart-scroll_footer">{footer}</div> : null}
      </div>
    );
  }
}