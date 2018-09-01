import React from "react";
import { ChipAny, ChipAnyProps } from "./chip-any";

export type ChipProps =
  Pick<ChipAnyProps,
    | "id"
    | "label"
    | "color"
    | "type"
    | "onClick"
    | "check"
  >;

export function ChipSelect(props: ChipProps) {
  return (
    <ChipAny {...props} isSelect/>
  );
}