import { Component, el } from "flatman-client";

Component.create("Scroll", {
  constructor() {
    window.addEventListener(
      "resize",
      () => this.scroll()
    );
  },

  clear() {
    this.names.content.html("");
  },

  append(children) {
    this.names.content.append(children);
    this.scroll();
  },

  thumbHeight() {
    const scrollOffset = this.document.offset();
    const contentOffset = this.names.content.offset();
    return (
      (scrollOffset.height / contentOffset.height) * scrollOffset.height
    );
  },

  scroll() {
    const docOffset = this.document.offset();
    const contentOffset = this.names.content.offset();
    const diff = contentOffset.height - docOffset.height;

    this.props.percent = Math.max(
      0,
      Math.min(
        1,
        this.props.percent
      )
    );

    if (docOffset.height < contentOffset.height) {
      this.names.thumb.style({
        height: this.thumbHeight(),
        opacity: 1,
        transform: {
          translateY: this.props.percent * (docOffset.height - this.thumbHeight())
        }
      });

      this.names.content.style({
        transform: {
          translateY: -(this.props.percent * diff)
        }
      });
    } else {
      this.names.thumb.style({
        opacity: 0
      });

      this.names.content.style({
        transform: {
          translateY: 0
        }
      });
    }
  },

  onDragstart() {
    this.names.thumb.addClass("scroll_thumb--is-active");
    document.body.style.userSelect = "none";
  },

  onDragend() {
    this.names.thumb.removeClass("scroll_thumb--is-active");
    document.body.style.userSelect = "";
  },

  onDragmove(e) {
    const total = this.document.offset().height - this.thumbHeight();

    this.props.percent = Math.max(
      e.detail.distanceY / total
    );

    this.scroll();
  },

  onMousedown(e) {
    const scrollOffset = this.document.offset();

    this.props.percent = (
      (e.pageY - scrollOffset.top) / scrollOffset.height
    );

    this.scroll();
  },

  render(props) {
    return el("div", {
      onMount: () => this.scroll(),
      className: ["scroll"].concat(props.className),
      name: props.name || "scroll"
    }, [
      el("div", {
        name: "bar",
        className: "scroll_bar",
        onMousedown: e => this.onMousedown(e)
      }, [
        el("div", {
          name: "thumb",
          className: "scroll_thumb",
          onDragstart: e => this.onDragstart(e),
          onDragmove: e => this.onDragmove(e),
          onDragend: e => this.onDragend(e),
        }, [
          el("div", {
            name: "thumb",
            className: "scroll_thumb_button"
          })
        ])
      ]),
      el("div", {
        name: "content",
        className: "scroll_content"
      })
    ]);
  }
});