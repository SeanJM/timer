export function replaceById<T extends {id: string}>(elements: T[], nextElement: T, prevElement: T): T[] {
  const indexOf = elements.findIndex((a) => a.id === prevElement.id);
  if (indexOf > -1) {
    elements.splice(indexOf, 1, nextElement);
  } else {
    elements.push(nextElement);
  }
  return elements;
}