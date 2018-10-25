import React from "react";
import { SmartScroll } from "@components/smart-scroll";
import { List } from "@components/list/list";

class ListScroll extends React.Component<ListScroll.Props> {
  render() {
    return (
      <SmartScroll footer={this.props.footer}>
        <List {...this.props}>
          {this.props.children}
        </List>
      </SmartScroll>
    );
  }
}

namespace ListScroll {
  export interface Props extends
    Partial<JSX.ElementChildrenAttribute>,
    List.Props {
      footer: JSX.Element;
  }
}

export { ListScroll };