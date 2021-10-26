import {Context, Middleware} from 'telegraf';

const allowedUserNames = ['gavroman', 'Katy_Vo'];

export const authMiddleware: Middleware<Context> = (ctx, next) => {
    if (ctx?.from?.username && allowedUserNames.includes(ctx.from.username)) {
        return next();
    }

    return ctx.reply('Не дружу с тобой');
};

export const keyboardMiddleware: Middleware<Context> = (ctx, next) => {

};
