import el from "@scripts/el";

el.create("ClockFace", {
  text(number) {
    this.node.html(number > 9 ? number : "0" + number);
  },

  render(props) {
    return el("div", { class: ["clock-face"].concat(props.class).join(" ") }, ["00"]);
  }
});

el.create("Timer", {
  constructor(props) {
    props.time = 0;
    this.on("start", props.onStart);
    this.on("stop", props.onStop);
  },

  update(time) {
    const s = time / 1000;
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor(s / 60) % 60;
    const seconds = Math.floor(s) % 60;
    this.refs.hours.text(hours);
    this.refs.minutes.text(minutes);
    this.refs.seconds.text(seconds);
    this.trigger("update", time);
  },

  stop() {
    clearTimeout(this.props.timer);
    this.trigger("stop");
    this.props.stopped = new Date();
  },

  start() {
    var self = this;

    this.props.start = (
      this.props.stopped
        ? new Date() - (this.props.stopped - this.props.start)
        : new Date()
    );

    this.props.stopped = false;

    this.trigger("start");

    function interval() {
      self.update(new Date() - self.props.start);
      self.props.timer = setTimeout(interval, 1000);
    }
    interval();
  },

  render(props) {
    return el("div", {
      class: "timer"
    }, [
        el("ClockFace", {
          class: "timer_hours",
          ref: "hours"
        }),
        el("div", { class: "timer_delimiter" }, [":"]),
        el("ClockFace", {
          class: "timer_minutes",
          ref: "minutes"
        }),
        el("div", { class: "timer_delimiter" }, [":"]),
        el("ClockFace", {
          class: "timer_seconds",
          ref: "seconds"
        }),
      ]);
  }
});

el.create("TimeTracker", {
  constructor(props) {
    props.started = false;
  },

  click() {
    if (!this.props.started) {
      this.refs.timer.start();
    } else {
      this.refs.timer.stop();
    }

    this.props.started = !this.props.started;
    this.update();
  },

  update() {
    if (this.props.started) {
      this.refs.button.text("Stop");
    } else {
      this.refs.button.text("Start");
    }
  },

  render() {
    var self = this;
    return el("div", { class: "time-tracker" }, [
      el("Button", {
        ref: "button",
        onClick: function () {
          self.click();
        }
      }, ["Start"]),
      el("Timer", {
        onStart: (e) => this.props.onStart && this.props.onStart(e),
        onStop: (e) => this.props.onStop && this.props.onStop(e),
        ref: "timer"
      })
    ]);
  }
});