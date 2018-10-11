import React from "react";

import { CodeMirror, CodeMirrorInputEvent } from "@components/code-mirror";
import { DoubleClick } from "@components/double-click";
import { Empty } from "@components/empty";
import { Icon } from "@components/icon";
import { Markdown } from "@components/markdown";
import { SmartScroll } from "@components/smart-scroll";

import { InputValueEvent } from "types";
import { KEYNAME_BY_CODE } from "@constants";

interface MarkdownEditorProps {
  onInput?: (e: CodeMirrorInputEvent) => void;
  onValue?: (e: InputValueEvent) => void;
  defaultValue?: string;
  isEditing?: boolean;
  name?: string;
  view?: string;
}

interface MarkdownEditorState {
  isEditing?: boolean;
  value: string;
}

export class MarkdownEditor extends React.Component<MarkdownEditorProps, MarkdownEditorState> {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: this.props.isEditing || false,
      value: this.props.defaultValue,
    };
  }

  onInput(e: CodeMirrorInputEvent) {
    const { onInput } = this.props;

    this.onValue(e);
    if (onInput) {
      onInput(e);
    }
  }

  onValue(e: CodeMirrorInputEvent) {
    const { onValue, name } = this.props;

    if (onValue) {
      onValue({
        name,
        type: "string",
        value: e.value,
      });
    }
  }

  onKeyDown(e: React.KeyboardEvent) {
    if (KEYNAME_BY_CODE[e.which] === "ESC") {
      this.setState({
        isEditing: false
      });
    }
  }

  onDoubleClick() {
    this.setState({
      isEditing: true
    });
  }

  toggleEditor() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue,
      });
    }
  }

  render() {
    return (
      <div
        onKeyDown={(e) => this.onKeyDown(e)}
        className="markdown-editor"
      >
        {this.state.isEditing
          ? (
            <CodeMirror
              className="markdown-editor_editor"
              autofocus
              defaultValue={this.props.defaultValue}
              lineWrapping={true}
              mode="markdown"
              name="todoNotes"
              onInput={(e) => this.onInput(e)}
            />
          )

          : (
            <DoubleClick
              className="markdown-editor_result"
              onDoubleClick={() => this.onDoubleClick()}
            >
              {this.state.value
                 ? (
                   <SmartScroll>
                     <Markdown>{this.state.value}</Markdown>
                   </SmartScroll>
                 )
                 : <Empty icon={<Icon type="edit-document"/>} title="Double click to edit"/>
              }
            </DoubleClick>
          )}
      </div>
    );
  }
}