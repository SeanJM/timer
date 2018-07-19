import { Component } from "@scripts/el";

el.create("Sound", {
  constructor() {
    this.props = {
      chimes: new Audio("sound/chimes.mp3"),
      glass: new Audio("sound/glass.mp3")
    };
  },

  update() {
    const state = this.props.state;

    const time = (
      new Date() - this.time - this.pause.duration
    );

    if (state.get("timerOn")) {
      this.value(time);
      setTimeout(() => {
        this.update();
      }, 1000);
    }
  },

  play(file) {
    this.props[file].play();
  }
});