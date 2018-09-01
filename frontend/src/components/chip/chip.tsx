import React from "react";
import { ChipAny, ChipAnyProps } from "./chip-any";

export type ChipProps = Pick<ChipAnyProps,
  | "id"
  | "label"
  | "color"
  | "type"
>;

export function Chip(props: ChipProps) {
  return (
    <ChipAny {...props}/>
  );
}