import React, { Component } from "react";
import { withStore } from "@frontend/store";
import { StoreState } from "@frontend/store";
import { TagEditorConnect } from "./tag-editor";
import { TagListConnect } from "./tag-list";
import { WithRouterProps } from "@frontend/components/router";
import { PanelGroup, Panel } from "@frontend/components/panel-group";
import { dispatch } from "@frontend/action";
import { path, PathParams } from "@path";

type TagPathParams = PathParams<{
  categoryID: string;
  tagID: string;
}>;

interface TagOutProps extends WithRouterProps {
  params: TagPathParams;
  tagEditorDefaultWidth: number;
}

function mapStateToProps(state: StoreState, props: WithRouterProps): TagOutProps {
  const params = path.params(props.location.pathname, state.routes.schema);
  return {
    ...props,
    params: {
      categoryID: params.categoryID,
      tagID: params.elementID,
    },
    tagEditorDefaultWidth: state.layout.tagEditorDefaultWidth,
  };
}

export class Tag extends Component<TagOutProps, {}> {
  render() {
    const { tagID } = this.props.params;
    return (
      <PanelGroup>
        <Panel>
          <TagListConnect {...this.props}/>
        </Panel>
        { tagID
          ? (
            <Panel
              defaultWidth={this.props.tagEditorDefaultWidth}
              onWidthChanged={(e) => {
                dispatch("LAYOUT", {
                  type: "SET_WIDTH",
                  value: {
                    target: "tagEditorDefaultWidth",
                    defaultWidth: e.width,
                  }
                });
              }}
            >
              <TagEditorConnect {...this.props}/>
            </Panel>
          )
          : null}
      </PanelGroup>
    );
  }
}

export const TagConnect = withStore(Tag, mapStateToProps)();