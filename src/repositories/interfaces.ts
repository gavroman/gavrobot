export interface IListStorage {
  add: (items: string[]) => Promise<any>;
  delete: (index: number) => Promise<any>;
  deleteAll: () => Promise<any>;
  getAll: () => Promise<string[]>;
}
