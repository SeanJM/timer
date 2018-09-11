import React from "react";

export interface SlideSegmentProps {
  length: number;
  value: number;
}

interface SegmentProps {
  index: number;
  value: number;
  length: number;
}

function Segment(props: SegmentProps) {
  const { index, value, length } = props;
  let isActive = index < value;
  const className = ["slide-segment"];

  if (isActive) {
    className.push("slide-segment--active");
  }

  className.push("slide-segment-" + index + "-" + length);

  return (
    <div
      className={className.join(" ")}
      style={{ width: (100 / length) + "%" }}
    >
      <div className="slide-segment_inner"/>
    </div>
  );
}

export function SlideSegments(props: SlideSegmentProps) {
  const { length, value } = props;
  const children = [];
  let i = -1;

  while (++i < length) {
    children.push(
      <Segment key={i} index={i} value={value} length={length}/>
    );
  }

  return (
    <div className="slide-segments">{children}</div>
  );
}