// tslint:disable:no-default-export

/**
 * Will return an array of matching indexes in a string
 * @param {string} string String to match against
 * @param {string} match
 */

export interface IndexesOfWordsElement {
  word: string;
  indexOf: number;
  endOf: number;
}

export default function indexesOfWords(string: string = "", match: string = "") {
  const stringLC = string.toLowerCase();
  const matchLC = match.toLowerCase();
  const words = matchLC.split(" ").filter((a) => a.length);
  const indexes: IndexesOfWordsElement[] = [];
  let index = 0;
  let i = 0;

  while (index > -1) {
    index = stringLC.indexOf(words[i], index);

    if (index > -1) {
      indexes.push({
        word: string.substring(index, index + words[i].length),
        indexOf: index,
        endOf: index + words[i].length,
      });

      index = index + words[i].length;
      i = (i + 1) % words.length;
    }
  }

  while (indexes.length % words.length > 0) {
    indexes.pop();
  }

  return indexes.length ? indexes : -1;
}
