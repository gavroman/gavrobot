import {Context, Middleware} from 'telegraf';
import {SessionContext} from 'telegraf/typings/session';

import {SessionData} from '../interfaces';
import {StateManager, STATES} from '../services/State';

const allowedUserNames = ['gavroman', 'Katy_Vo'];

export const authMiddleware: Middleware<Context> = (ctx, next) => {
  if (ctx?.from?.username && allowedUserNames.includes(ctx.from.username)) {
    return next();
  }

  return ctx.reply('Не дружу с тобой');
};

export const addSessionMiddleware: Middleware<SessionContext<SessionData>> = (
  ctx,
  next,
) => {
  if (!ctx.session) {
    console.log('add session', ctx.from?.username);
    ctx.session = {
      state: new StateManager(STATES.none),
    };
  }

  return next();
};
