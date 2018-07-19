import el from "@scripts/el";

el.create("Input.slider", {
  constructor(props) {
    if (typeof props.size === "undefined") {
      throw new Error("[Input] slider must have a \"size\" attribute.");
    }

    this.props = {
      ...props,
      value: props.value || 0
    };

    this.on("input", props.onInput);
  },

  update() {
    const value = Math.max(
      0,
      Math.min(
        this.props.value,
        this.props.size
      )
    );

    const width = this.document.offset().width - this.names.thumb.offset().width;
    const left = (value / this.props.size) * width;

    this.names.progress.style("width", left);
    this.names.thumb.style("left", left);
  },

  onMousedown(e) {
    const width = this.document.offset().width - this.names.thumb.offset().width;
    const value = Math.round(((e.pageX - this.document.offset().left) / width) * this.props.size);
    this.props.value = value;
    this.update();
  },

  onMouseup() {
    this.trigger("input", {
      value: this.props.value,
      size: this.props.size
    });
  },

  onDragmove(e) {
    const width = this.document.offset().width - this.names.thumb.offset().width;
    const value = Math.round(((e.detail.pageX - this.document.offset().left) / width) * this.props.size);
    this.props.value = value;
    this.update();
  },

  render(props) {
    const split = el("div", {
      class: "input-sider_marker-container"
    });

    const width = (100 / props.size) + "%";

    for (var i = 0, n = props.size; i < n; i++) {
      split.append([
        el("div", {
          style: { width: width },
          class: ["input-slider_marker"]
            .concat(i === n - 1
              ? "input-slider_marker--is-last"
              : "").join(" ")
        })
      ]);
    }

    return el("div", {
      name: props.name,
      onMount: () => this.onMount(),
      onMousedown: (e) => this.onMousedown(e),
      onDragmove: (e) => this.onDragmove(e),
      onMouseup: () => this.onMouseup(),
      class: "input-slider"
    }, [
      el("div", {
        name: "progress",
        class: "input-slider_progress"
      }),
      el("div", {
        class: "input-slider_track"
      }),
      el("div", {
        name: "thumb",
        class: "input-slider_thumb"
      })
    ].concat(split));
  }
});