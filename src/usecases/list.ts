import {GSPListStorage} from '../repositories/GSPList';

const List = new GSPListStorage();

export const alignNumber = (length: number, index: number): string => {
  const maxIndexStringLength = length.toString().length;

  return ' '.repeat(maxIndexStringLength - index.toString().length) + index;
};

const getList = (): Promise<string> =>
  List.getAll().then((list) =>
    list
      ?.map((item, index) => {
        return `<code>${alignNumber(list.length, index + 1)})</code> ${item}`;
      })
      .join('\n'),
  );

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

export const listUsecase = {
  getList,
  addItem,
  deleteItem,
  deleteAll,
};
