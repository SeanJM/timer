import React, { Component } from "react";
import codeMirror from "codemirror";
import { InputValueEvent } from "@types";

export interface CodeMirrorInputEvent {
  value: string;
}

interface CodeMirrorProps {
  onInput?: (e?: CodeMirrorInputEvent) => void;
  onValue?: (e?: InputValueEvent) => void;
  defaultValue?: string;
  mode?: "markdown";
  lineWrapping?: boolean;
  name?: string;
}

export class CodeMirror extends Component<CodeMirrorProps> {
  node: HTMLDivElement;
  codeMirror: codeMirror.Editor;

  onValue() {
    const { onValue } = this.props;
    if (onValue) {
      onValue({
        type: "string",
        value: this.codeMirror.getValue(),
      });
    }
  }

  componentDidMount() {
    this.codeMirror = codeMirror(this.node, {
      lineNumbers: true,
      mode: this.props.mode,
      lineWrapping: this.props.lineWrapping,
      tabindex: 0,
      tabSize: 2,
      viewportMargin: Infinity,
    });

    this.codeMirror.setValue(this.props.defaultValue || "");

    this.codeMirror.on("change", (e) => {
      if (this.props.onInput) {
        this.props.onInput({
          value: e.getValue()
        });
      }

      this.onValue();
    });
  }

  componentDidUpdate(prevProps: CodeMirrorProps) {
    const { defaultValue } = this.props;
    const value = this.codeMirror.getValue();
    if (prevProps.defaultValue !== defaultValue && defaultValue !== value) {
      this.codeMirror.setValue(defaultValue || "");
    }
  }

  render() {
    return (
      <div className="code-mirror" ref={(node) => { this.node = node; }}>
      </div>
    );
  }
}