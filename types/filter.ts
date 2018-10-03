import { DatabaseElement } from "@backend/class/element";
import "./verified";

export type FilterTagTypes =
  | "includes"
  | "excludes"
  | "any"
  ;

export interface FilterResponse {
  name: string;
  id: string;
  created: number;
  tagFilters: { [key in FilterTagTypes]: string[] };
}

export interface FilterTagElement extends DatabaseElement {
  tagName: "filter-tag";
  attributes: {
    type: FilterTagTypes
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