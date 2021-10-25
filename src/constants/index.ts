import {Markup} from 'telegraf';

export const HELP_COMMANDS = [
    'start - Начать',
    'list - Текущий список',
    'add_item - Добавить в текущий список',
    'delete_item - Удалить из текущего списка',
    'delete_list - Очистить список',
    'help - Помощь',
];

export enum COMMANDS {
    list = 'list',
    addItem = 'add_item',
    deleteItem = 'delete_item',
    deleteList = 'delete_list',
    help = 'help',
}

export const mainMenuKeyboard = Markup.inlineKeyboard([
    [
        {text: 'Добавить', callback_data: COMMANDS.addItem},
        {text: 'Удалить', callback_data: COMMANDS.deleteItem},
    ], [
        {text: 'Показать список', callback_data: COMMANDS.list},
        {text: 'Очистить список', callback_data: COMMANDS.deleteList},
    ],
]);
