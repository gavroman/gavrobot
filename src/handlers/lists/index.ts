import {Context} from 'telegraf';
import {State, STATES} from '../../utils/State';
import {HELP_COMMANDS, mainMenuKeyboard} from '../../constants';
import {GSPListStorage} from '../../services/GSPList';

// export const List = new InMemoryListStorage();
export const List = new GSPListStorage();

const addItemStart = (ctx: Context) => {
    ctx.reply('Что добавить?')
        .then(() => State.set(STATES.addingItem));
};

const addItem = (ctx: Context, text?: string) => {
    if (text) {
        List.add(text.split('\n')).then(() => {
            State.set(STATES.none);
            handlers.getList(ctx);
        });
    }
};

const deleteItemStart = (ctx: Context) => {
    ctx.reply('Укажите номер пункта, который нужно удалить')
        .then(() => State.set(STATES.deletingItem));
};

const deleteItem = (ctx: Context, text: string) => {
    const index = parseInt(text);
    if (Number.isInteger(index)) {
        List.delete(index).then(() => {
            State.set(STATES.none);
            handlers.getList(ctx);
        });
    } else {
        ctx.reply(`Не могу найти элемент с номером "${text}"`, mainMenuKeyboard);
    }
};

const deleteList = (ctx: Context) => {
    List.deleteAll()
        .then(() => ctx.reply('Все снесено', mainMenuKeyboard));
};

const getList = (ctx: Context) => {
    List.getAll().then((list) => {
        const text =
            list
                ?.map((item, index) => `${index + 1}) ${item}`)
                .join('\n') || 'Тут пусто';
        return ctx.reply(text, mainMenuKeyboard);
    });
};

const help = (ctx: Context) => {
    ctx.reply(HELP_COMMANDS.map((str) => `/${str}`).join('\n'));
};

export const handlers = {
    addItemStart,
    deleteItemStart,
    deleteList,
    getList,
    help,
    addItem,
    deleteItem,
};

