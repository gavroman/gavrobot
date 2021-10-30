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

export const BUTTONS: Record<Partial<COMMANDS>, string> = {
  [COMMANDS.list]: '🗒Показать список',
  [COMMANDS.addItem]: '➕Добавить',
  [COMMANDS.deleteItem]: '❌Удалить',
  [COMMANDS.deleteList]: '🥡Очистить список',
  [COMMANDS.help]: '/help',
};

export const mapCommandToButton = (command: COMMANDS): string => BUTTONS[command];

export const keyboard = Markup
  .keyboard([
    [mapCommandToButton(COMMANDS.addItem), mapCommandToButton(COMMANDS.deleteItem)],
    [mapCommandToButton(COMMANDS.list), mapCommandToButton(COMMANDS.deleteList)],
  ])
  .oneTime()
  .resize();
