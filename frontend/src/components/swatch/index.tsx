import React, { Component } from "react";
import rand from "@rand";
import colors from "@components/swatch/colors";
import Swatch from "@components/swatch/swatch";
import Picker from "@components/swatch/picker";

interface State {
  showPicker: boolean;
  color: null | string;
}

interface SelectEvent {
  color: string;
  index: number;
}

interface SwatchPickerProps {
  onSelect: (e: SelectEvent) => void;
}

export default class SwatchPicker extends Component<SwatchPickerProps, State> {
  node: HTMLDivElement;

  onClick() {
    if (this.state.showPicker) {
      setTimeout(() => {
        this.setState({
          showPicker: false
        });
      }, 150);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      color: rand(colors),
    };
    this.onClick = this.onClick.bind(this);
  }

  onSelect(color: string) {
    const { onSelect } = this.props;
    this.setState({
      color,
    });
    onSelect && onSelect({
      color,
      index: colors.indexOf(color)
    });
  }

  componentDidMount() {
    const { onSelect } = this.props;
    document.body.addEventListener("click", this.onClick);
    onSelect && onSelect({
      color: this.state.color,
      index: colors.indexOf(this.state.color),
    });
  }
  
  componentWillUnmount() {
    document.body.removeEventListener("click", this.onClick);
  }

  render() {
    return (
      <div ref={(node) => { this.node = node; }} className="swatch-picker">
        <Swatch background={this.state.color} onClick={() => {
          this.setState({
            showPicker: true,
          })
        }}>
          {this.state.showPicker 
            ? (
              <Picker
                selectedColor={this.state.color}
                onSelect={(color) => this.onSelect(color)}
              />
            )
            : null}
        </Swatch>
      </div>
    );
  }
}