export enum STATES {
  none = 'NONE',
  creatingList = 'CREATING_LIST',
  addingItem = 'ADDING_ITEM',
  deletingItem = 'DELETING_ITEM',
}

export class StateManager<T = STATES> {
  constructor(public current: T) {}

  public set(state: T) {
    this.current = state;
  }
}
