import React, { Component } from "react";
import codeMirror from "codemirror";
import { InputValueEvent } from "@types";

console.log(require("codemirror/keymap/sublime.js"));

interface CodeMirrorInputEvent {
  value: string;
}

interface CodeMirrorProps {
  onInput?: (e?: CodeMirrorInputEvent) => void;
  onValue?: (e?: InputValueEvent) => void;
  defaultValue?: string;
  mode?: "markdown";
  name?: string;
}

export class CodeMirror extends Component<CodeMirrorProps> {
  node: HTMLDivElement;
  codeMirror: codeMirror.Editor;

  onValue() {
    const { onValue, name } = this.props;
    if (onValue) {
      onValue({
        type: "string",
        value: this.codeMirror.getValue(),
        name,
      });
    }
  }

  componentDidMount() {
    this.codeMirror = codeMirror(this.node, {
      lineNumbers: true,
      mode: this.props.mode,
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
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.codeMirror.setValue(this.props.defaultValue || "");
    }
  }

  render() {
    return (
      <div className="code-mirror" ref={(node) => { this.node = node; }}>
      </div>
    );
  }
}