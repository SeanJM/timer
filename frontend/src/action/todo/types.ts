export interface Subscribe {
  (name: "TODO", callback: (e: { type: string, value: any }) => void): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "ADD", value: { name: string, tags: string[], categoryID: string } }): void;
}

export interface TodoEditValue {
  categoryID: string;
  editList: Array<{
    name?: string;
    notes?: string;
    priority?: number;
    state?: "incomplete" | "complete";
    tags?: string[];
    todoID: string;
  }>;
}

export interface TodoDispatch {
  (name: "TODO", e: {
    type: "EDIT",
    value: TodoEditValue
  }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "DELETE", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "DESELECT", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "SELECT", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "INCOMPLETE", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "COMPLETE", value: { categoryID: string, idList: string[] } }): void;
}