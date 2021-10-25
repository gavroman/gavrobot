export interface IListStorage {
    add: (items: string[]) => Promise<void>;
    delete: (index: number) => Promise<void>;
    deleteAll: () => Promise<void>;
    getAll: () => Promise<string[]>;
}
