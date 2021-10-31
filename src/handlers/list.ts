import {HELP_COMMANDS} from '../constants';
import {BotContext} from '../interfaces';
import {exitFromModeKeyboard, mainKeyboard} from '../keyboards/listKeyboards';
import {StateManager, STATES} from '../services/State';
import {listUsecase} from '../usecases/list';

const getDefaultMessage = (name: string) =>
  name +
  ', тут что-то невнятное, выбери режим добавления/удаления или жми /help';

export const onStart = (ctx: BotContext) => {
  if (!ctx.session?.state) {
    ctx.session = {
      state: new StateManager(STATES.none),
    };
  }

  return ctx.reply('Стартуем!!!', mainKeyboard);
};

export const onStartAdding = (ctx: BotContext) => {
  ctx
    .reply('Что добавить?', exitFromModeKeyboard)
    .then(() => ctx.session?.state.set(STATES.addingItem));
};

export const onGetList = (ctx: BotContext) => {
  const {current: state} = ctx.session.state;

  return listUsecase.getList().then((list) => {
    const text = list || 'Тут пусто';
    const buttons = state === STATES.none ? mainKeyboard : exitFromModeKeyboard;

    return ctx.replyWithHTML(text, buttons);
  });
};

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
        .then(listUsecase.getList)
        .then((list) =>
          ctx.replyWithHTML(
            `Готово:\n\n${list}\n\nЧто еще добавим?`,
            exitFromModeKeyboard,
          ),
        );

    case STATES.deletingItem:
      return listUsecase
        .deleteItem(text)
        .catch(() => {
          ctx.reply(`Не могу найти элемент с номером "${text}"`, mainKeyboard);
          return Promise.reject();
        })
        .then(listUsecase.getList)
        .then((list) => {
          if (!list) {
            state.set(STATES.none);
            return ctx.reply('Все удалено', mainKeyboard);
          }

          return ctx.replyWithHTML(
            `Готово:\n\n${list}\n\nЧто еще удалим?`,
            exitFromModeKeyboard,
          );
        });

    case STATES.none:
    default:
      return ctx.reply(getDefaultMessage(firstName), mainKeyboard);
  }
};

export const onStartDeleting = (ctx: BotContext) => {
  return ctx
    .reply('Начинаем удалять, какой номер?', exitFromModeKeyboard)
    .then(() => ctx.session?.state.set(STATES.deletingItem));
};

export const onDeleteList = (ctx: BotContext) => {
  return listUsecase
    .deleteAll()
    .then(() => ctx.reply('Все снесено', mainKeyboard));
};

export const onExitMode = (ctx: BotContext) => {
  ctx.session.state.set(STATES.none);
  return ctx.reply('Готово').then(() => onGetList(ctx));
};

export const onHelp = (ctx: BotContext) =>
  ctx.reply(HELP_COMMANDS.map((str) => `/${str}`).join('\n'));
