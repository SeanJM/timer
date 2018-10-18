import React, { Component } from "react";
import { withStore } from "@frontend/store";
import { StoreState } from "@frontend/store";
import { TagEditorConnect } from "./tag-editor";
import { TagListConnect } from "./tag-list";
import { TagNotFound } from "./tag-not-found";
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
  tagExists: boolean;
}

function mapStateToProps(state: StoreState, props: WithRouterProps): TagOutProps {
  const params = path.params(props.location.pathname, state.routes.schema);
  const { categoryID, elementID } = params;
  const categoryElement = state.todo.categories.find((a) => a.id === categoryID);
  const tagExists = !!categoryElement.tags.find((tag) => tag.id === elementID);
  return {
    ...props,
    params: {
      categoryID,
      tagID: elementID,
    },
    tagEditorDefaultWidth: state.layout.tagEditorDefaultWidth,
    tagExists,
  };
}

export class Tag extends Component<TagOutProps, {}> {
  render() {
    const { tagID } = this.props.params;
    const { tagExists } = this.props;
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
              { tagExists
                ? <TagEditorConnect {...this.props}/>
                : <TagNotFound/>
              }
            </Panel>
          )
          : null}
      </PanelGroup>
    );
  }
}

export const TagConnect = withStore(Tag, mapStateToProps)();