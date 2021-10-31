import {Telegraf} from 'telegraf';

import {COMMANDS, mapCommandToButton} from './constants';
import {
  onAddItemStart,
  onDeleteItemStart,
  onDeleteList,
  onGetList,
  onHelp,
  onStart,
  onText,
} from './handlers/list';
import {authMiddleware} from './middlewares';
import {GSPClient} from './services/GoogleSpreadsheets';

if (!process.env.BOT_TOKEN) {
  throw new Error('No BOT_TOKEN specified');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.use(authMiddleware);

bot.start(onStart);

bot.command(COMMANDS.help, onHelp);
bot.command(COMMANDS.list, onGetList);
bot.command(COMMANDS.addItem, onAddItemStart);
bot.command(COMMANDS.deleteItem, onDeleteItemStart);
bot.command(COMMANDS.deleteList, onDeleteList);

bot.hears(mapCommandToButton(COMMANDS.list), onGetList);
bot.hears(mapCommandToButton(COMMANDS.addItem), onAddItemStart);
bot.hears(mapCommandToButton(COMMANDS.deleteItem), onDeleteItemStart);
bot.hears(mapCommandToButton(COMMANDS.deleteList), onDeleteList);

bot.action(COMMANDS.list, onGetList);
bot.action(COMMANDS.addItem, onAddItemStart);
bot.action(COMMANDS.deleteItem, onDeleteItemStart);
bot.action(COMMANDS.deleteList, onDeleteList);

bot.on('text', onText);

GSPClient.init()
  .then(() => bot.launch())
  .then(() => console.log('Bot start'));
