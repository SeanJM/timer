import React from "react";
import indexesOfWords, { IndexesOfWordsElement } from "@strings/indexes-of-words";

export interface TodoTitleProps {
  children: string;
  search: string;
}

function pushSearchChildren(str: string, children: any[], indexes: IndexesOfWordsElement[]) {
  let i = -1;
  const n = indexes.length;

  while (++i < n) {
    if (i === 0) {
      children.push(
        str.substring(0, indexes[i].indexOf)
      );
    } else {
      children.push(
        str.substring(indexes[i - 1].endOf, indexes[i].indexOf)
      );
    }

    children.push(
      <div
        key={i}
        className="todo-title-search">
        {indexes[i].word}
      </div>
    );
  }

  children.push(str.substring(indexes[i - 1].endOf));
}

export function TodoTitle(props: TodoTitleProps) {
  const str = props.children;
  const indexes = indexesOfWords(str, props.search);
  const children = [];

  if (indexes !== -1) {
    pushSearchChildren(str, children, indexes);
  } else {
    children.push(str);
  }

  return (
    <div className={`todo-title`}>
      {children}
    </div>
  );
}