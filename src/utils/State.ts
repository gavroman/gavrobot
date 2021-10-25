export enum STATES {
    none= 'NONE',
    creatingList = 'CREATING_LIST',
    addingItem = 'ADDING_ITEM',
    deletingItem = 'DELETING_ITEM',
}

class StateManager<T> {
    constructor(public current: T) {
    }

    public set(state: T) {
        this.current = state;
    }
}

export const State = new StateManager<STATES>(STATES.none);
