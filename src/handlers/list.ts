import {HELP_COMMANDS, keyboard} from '../constants';
import {BotContext} from '../interfaces';
import {StateManager, STATES} from '../services/State';
import {listUsecase} from '../usecases/list';

const getDefaultMessage = (name: string) =>
  name + ', ничего не понятно, жми /help';

export const onStart = (ctx: BotContext) => {
  if (!ctx.session?.state) {
    ctx.session = {
      state: new StateManager(STATES.none),
    };
  }

  return ctx.reply('Стартуем!!!', keyboard);
};

export const onAddItemStart = (ctx: BotContext) => {
  ctx
    .reply('Что добавить?')
    .then(() => ctx.session?.state.set(STATES.addingItem));
};

export const onGetList = (ctx: BotContext) =>
  listUsecase.getList().then((list) => {
    const text = list || 'Тут пусто';

    return ctx.reply(text, {...keyboard, parse_mode: 'HTML'});
  });

export const onText = (ctx: BotContext) => {
  if (!ctx?.message || !('text' in ctx?.message) || !ctx.session) {
    return;
  }

  const {
    message: {
      text,
      from: {first_name: firstName},
    },
    session: {state},
  } = ctx;

  switch (state.current) {
    case STATES.addingItem:
      return listUsecase
        .addItem(text)
        .then(() => state.set(STATES.none))
        .then(() => onGetList(ctx));

    case STATES.deletingItem:
      return listUsecase
        .deleteItem(text)
        .then(() => state.set(STATES.none))
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

export const onDeleteItemStart = (ctx: BotContext) =>
  ctx
    .reply('Укажите номер пункта, который нужно удалить')
    .then(() => ctx.session?.state.set(STATES.deletingItem));

export const onDeleteList = (ctx: BotContext) =>
  listUsecase.deleteAll().then(() => ctx.reply('Все снесено', keyboard));

export const onHelp = (ctx: BotContext) =>
  ctx.reply(HELP_COMMANDS.map((str) => `/${str}`).join('\n'));
