import React from "react";

interface SlideShadowProps {
  length: number;
  positionX: number;
}

export function SlideShadow(props: SlideShadowProps) {
  let { length, positionX } = props;
  let i = -1;

  const shadows = [];
  const ceil = Math.ceil(positionX * length);
  const floor = Math.floor(positionX * length);

  while (++i < ceil) {
    shadows.push(
      <div
        key={i}
        className="slide-shadow_element"
        style={{
          width: (i < floor
            ? (100 / length)
            : (positionX - (i / length)) * 100) + "%"
        }}
      >
        <div className="slide-shadow_element_inner"/>
      </div>
    );
  }

  return <div className="slide-shadow">{shadows}</div>;
}