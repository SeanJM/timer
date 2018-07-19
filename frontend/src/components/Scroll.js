import el from "@scripts/el";

el.create("Scroll", {
  constructor() {
    window.addEventListener(
      "resize",
      () => this.scroll()
    );
  },

  clear() {
    this.refs.content.html("");
  },

  append(children) {
    this.refs.content.append(children);
    this.scroll();
  },

  thumbHeight() {
    const scrollOffset = this.node.offset();
    const contentOffset = this.refs.content.offset();
    return (
      (scrollOffset.height / contentOffset.height) * scrollOffset.height
    );
  },

  scroll() {
    const docOffset = this.node.offset();
    const contentOffset = this.refs.content.offset();
    const diff = contentOffset.height - docOffset.height;

    this.props.percent = Math.max(
      0,
      Math.min(
        1,
        this.props.percent
      )
    );

    if (docOffset.height < contentOffset.height) {
      this.refs.thumb.style({
        height: this.thumbHeight(),
        opacity: 1,
        transform: {
          translateY: this.props.percent * (docOffset.height - this.thumbHeight())
        }
      });

      this.refs.content.style({
        transform: {
          translateY: -(this.props.percent * diff)
        }
      });
    } else {
      this.refs.thumb.style({
        opacity: 0
      });

      this.refs.content.style({
        transform: {
          translateY: 0
        }
      });
    }
  },

  onDragstart() {
    this.refs.thumb.addClass("scroll_thumb--is-active");
    document.body.style.userSelect = "none";
  },

  onDragend() {
    this.refs.thumb.removeClass("scroll_thumb--is-active");
    document.body.style.userSelect = "";
  },

  onDragmove(e) {
    const total = this.node.offset().height - this.thumbHeight();

    this.props.percent = Math.max(
      e.detail.distanceY / total
    );

    this.scroll();
  },

  onMousedown(e) {
    const scrollOffset = this.node.offset();

    this.props.percent = (
      (e.pageY - scrollOffset.top) / scrollOffset.height
    );

    this.scroll();
  },

  render(props) {
    return el("div", {
      onMount: () => this.scroll(),
      class: ["scroll"].concat(props.class).join(" "),
      ref: props.ref || "scroll"
    }, [
        el("div", {
          ref: "bar",
          class: "scroll_bar",
          onMousedown: e => this.onMousedown(e)
        }, [
            el("div", {
              ref: "thumb",
              class: "scroll_thumb",
              onDragstart: e => this.onDragstart(e),
              onDragmove: e => this.onDragmove(e),
              onDragend: e => this.onDragend(e),
            }, [
                el("div", {
                  ref: "thumb",
                  class: "scroll_thumb_button"
                })
              ])
          ]),
        el("div", {
          ref: "content",
          class: "scroll_content"
        })
      ]);
  }
});