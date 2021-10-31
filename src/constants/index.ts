export const HELP_COMMANDS = [
  'start - Начать',
  'list - Текущий список',
  'add_item - Перейти в режим добавления',
  'delete_item - Перейти в режим удаления',
  'toggle_item - Перейти в режим удаления',
  'exit_mode - Выйти из режима удаления/добавления',
  'delete_list - Очистить список',
  'help - Помощь',
];

export enum COMMANDS {
  list = 'list',
  addItem = 'add_item',
  deleteItem = 'delete_item',
  toggleItem = 'toggle_item',
  deleteList = 'delete_list',
  help = 'help',
  exitMode = 'exit_mode',
}
