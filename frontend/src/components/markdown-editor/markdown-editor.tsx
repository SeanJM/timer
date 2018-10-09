import React from "react";
import { CodeMirror, CodeMirrorInputEvent } from "@components/code-mirror";
import { Markdown } from "@components/markdown";
import { DoubleClick } from "@components/double-click";
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

    if (onInput) {
      onInput(e);
    }

    this.onValue(e);
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
            <div className="markdown-editor_editor">
              <CodeMirror
                autofocus
                defaultValue={this.props.defaultValue}
                lineWrapping={true}
                mode="markdown"
                name="todoNotes"
                onInput={(e) => this.onInput(e)}
              />
            </div>
          )

          : (
            <DoubleClick
              className="markdown-editor_result"
              onDoubleClick={() => this.onDoubleClick()}
            >
              <Markdown>{this.state.value}</Markdown>
            </DoubleClick>
          )}
      </div>
    );
  }
}