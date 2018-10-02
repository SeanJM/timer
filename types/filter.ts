import { DatabaseElement } from "@backend/class/element";
import "./verified";

export type FilterTypes =
  | "includes"
  | "excludes"
  | "any"
  ;

export interface FilterElementResponse {
  type: FilterTypes;
  IDList: string[];
}

export interface FilterResponse {
  name: string;
  id: string;
  created: number;
  filters: FilterElementResponse[];
}

export interface FilterTagElement extends DatabaseElement {
  tagName: "tag";
  attributes: {
    type: FilterTypes
  };
  children: string[];
}

export type FilterElement = DatabaseElement<{
  tagName: "filter";
  attributes: {
    id: string;
    name: string;
  };
  children: FilterTagElement[];
}>;