import {Context} from 'telegraf';

import {HELP_COMMANDS, keyboard} from '../constants';
import {State, STATES} from '../services/State';
import {listUsecase} from '../usecases/list';

const getDefaultMessage = (name: string) =>
  name + ', ничего не понятно, жми /help';

export const onStart = (ctx: Context) => ctx.reply('Стартуем!!!', keyboard);

export const onAddItemStart = (ctx: Context) => {
  ctx.reply('Что добавить?').then(() => State.set(STATES.addingItem));
};

export const onGetList = (ctx: Context) =>
  listUsecase.getList().then((list) => {
    const text = list || 'Тут пусто';

    return ctx.reply(text, {...keyboard, parse_mode: 'HTML'});
  });

export const onText = (ctx: Context) => {
  if (!ctx?.message || !('text' in ctx?.message)) {
    return;
  }

  const {
    text,
    from: {first_name: firstName},
  } = ctx.message;

  switch (State.current) {
    case STATES.addingItem:
      return listUsecase
        .addItem(text)
        .then(() => State.set(STATES.none))
        .then(() => onGetList(ctx));

    case STATES.deletingItem:
      return listUsecase
        .deleteItem(text)
        .then(() => State.set(STATES.none))
        .catch(() => {
          ctx.reply(`Не могу найти элемент с номером "${text}"`, keyboard);
          return Promise.reject();
        })
        .then(() => onGetList(ctx));

    case STATES.none:
    default:
      return ctx.reply(getDefaultMessage(firstName), keyboard);
  }
};

export const onDeleteItemStart = (ctx: Context) =>
  ctx
    .reply('Укажите номер пункта, который нужно удалить')
    .then(() => State.set(STATES.deletingItem));

export const onDeleteList = (ctx: Context) =>
  listUsecase.deleteAll().then(() => ctx.reply('Все снесено', keyboard));

export const onHelp = (ctx: Context) =>
  ctx.reply(HELP_COMMANDS.map((str) => `/${str}`).join('\n'));
