import {GSPListStorage, ListItem} from '../repositories/GSPList';

const List = new GSPListStorage();

export const alignNumber = (length: number, index: number): string => {
  const maxIndexStringLength = length.toString().length;

  return ' '.repeat(maxIndexStringLength - index.toString().length) + index;
};

const formatList = (list: ListItem[]): string => {
  console.log('list', list);

  return list
    .map(({value, done}, index) => {
      const checkbox = done ? '🟢' : '🔴';
      const item = done ? `<del>${value}</del>` : value;

      return `<code>${alignNumber(
        list.length,
        index + 1,
      )})</code>${checkbox} ${item}`;
    })
    .join('\n');
};

const getList = (): Promise<string> => List.getAll().then(formatList);

const addItem = (text: string): Promise<any> => {
  const itemsToAdd = text
    .split('\n')
    .filter(Boolean)
    .map((str) => str.trim())
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1));

  return List.add(itemsToAdd);
};

const deleteItem = (text: string): Promise<any> => {
  const index = parseInt(text);
  if (Number.isInteger(index)) {
    return List.delete(index);
  }

  return Promise.reject();
};

const deleteAll = (): Promise<any> => {
  return List.deleteAll();
};

const toggleItem = (text: string): Promise<any> => {
  const index = parseInt(text);
  if (Number.isInteger(index)) {
    return List.toggle(index);
  }

  return Promise.reject();
};

export const listUsecase = {
  getList,
  addItem,
  deleteItem,
  deleteAll,
  toggleItem,
};
