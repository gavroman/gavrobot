import {Telegraf} from 'telegraf';
import {COMMANDS, keyboard, mapCommandToButton} from './constants';
import {State, STATES} from './utils/State';
import {handlers} from './handlers/lists';
import {client} from './utils/GoogleSpreadsheets';
import {authMiddleware} from './middlewares';

if (!process.env.BOT_TOKEN) {
  throw new Error('No BOT_TOKEN');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const getDefaultMessage = (name: string) => name + ', ничего не понятно, жми /help';

bot.start((ctx) => ctx.reply('Started bot!'));

bot.use(authMiddleware);

bot.command(COMMANDS.help, handlers.help);
bot.command(COMMANDS.list, handlers.getList);
bot.command(COMMANDS.addItem, handlers.addItemStart);
bot.command(COMMANDS.deleteItem, handlers.deleteItemStart);
bot.command(COMMANDS.deleteList, handlers.deleteList);

bot.hears(mapCommandToButton(COMMANDS.list), handlers.getList);
bot.hears(mapCommandToButton(COMMANDS.addItem), handlers.addItemStart);
bot.hears(mapCommandToButton(COMMANDS.deleteItem), handlers.deleteItemStart);
bot.hears(mapCommandToButton(COMMANDS.deleteList), handlers.deleteList);

bot.action(COMMANDS.list, handlers.getList);
bot.action(COMMANDS.addItem, handlers.addItemStart);
bot.action(COMMANDS.deleteItem, handlers.deleteItemStart);
bot.action(COMMANDS.deleteList, handlers.deleteList);

bot.on('text', (ctx) => {
  const {text, from: {first_name: firstName}} = ctx.message;

  switch (State.current) {
    case STATES.addingItem:
      handlers.addItem(ctx, text);
      break;

    case STATES.deletingItem:
      handlers.deleteItem(ctx, text);
      break;

    case STATES.none:
    default:
      ctx.reply(getDefaultMessage(firstName), keyboard);
  }
});

client.init()
  .then(() => bot.launch())
  .then(() => console.log('Bot start'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


