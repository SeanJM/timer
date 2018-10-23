import { IconType } from "@frontend/components/icon";

export interface ChipData {
  id: string;
  label: string;
  color?: string;
  icon?: IconType;
}

export interface ChipSubmitEvent {
  clearValue: () => void;
  type: "submit";
  value: string;
}