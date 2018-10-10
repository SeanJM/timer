import { Omit } from "@types";

export interface InputOnValue {
  (value: any, name: string): void;
}

interface InputValueBaseEvent {
  name: string;
  type: string;
  value: any;
}

export type InputValueEvent<T = {}> = T & Omit<InputValueBaseEvent, keyof T>;