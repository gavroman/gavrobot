import {Markup} from 'telegraf';

import {COMMANDS} from '../constants';

export const BUTTONS: {[key in COMMANDS]: string} = {
  [COMMANDS.list]: '🗒Показать список',
  [COMMANDS.addItem]: '➕Режим добавления',
  [COMMANDS.deleteItem]: '❌Режим удаления',
  [COMMANDS.deleteList]: '🥡Очистить список',
  [COMMANDS.exitMode]: '⛔Остановиться',

  [COMMANDS.help]: '/help',
};

export const mapCommandToButton = (command: COMMANDS) => BUTTONS[command];

export const mainKeyboard = Markup.keyboard([
  [
    mapCommandToButton(COMMANDS.addItem),
    mapCommandToButton(COMMANDS.deleteItem),
  ],
  [mapCommandToButton(COMMANDS.list), mapCommandToButton(COMMANDS.deleteList)],
])
  .oneTime()
  .resize();

export const exitFromModeKeyboard = Markup.keyboard([
  [mapCommandToButton(COMMANDS.list), mapCommandToButton(COMMANDS.exitMode)],
])
  .oneTime()
  .resize();
