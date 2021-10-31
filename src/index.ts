import {session, Telegraf} from 'telegraf';

import {COMMANDS} from './constants';
import {
  onDeleteList,
  onExitMode,
  onGetList,
  onHelp,
  onStart,
  onStartAdding,
  onStartDeleting,
  onStartToggling,
  onText,
} from './handlers/list';
import {BotContext, SessionData} from './interfaces';
import {mapCommandToButton} from './keyboards/listKeyboards';
import {addSessionMiddleware, authMiddleware} from './middlewares';
import {GSPClient} from './services/GoogleSpreadsheets';

if (!process.env.BOT_TOKEN) {
  throw new Error('No BOT_TOKEN specified');
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.use(authMiddleware);
bot.use(session<SessionData>());
bot.use(addSessionMiddleware);

bot.start(onStart);

bot.command(COMMANDS.help, onHelp);
bot.command(COMMANDS.list, onGetList);
bot.command(COMMANDS.addItem, onStartAdding);
bot.command(COMMANDS.deleteItem, onStartDeleting);
bot.command(COMMANDS.exitMode, onExitMode);
bot.command(COMMANDS.deleteList, onDeleteList);
bot.command(COMMANDS.toggleItem, onStartToggling);

bot.hears(mapCommandToButton(COMMANDS.list), onGetList);
bot.hears(mapCommandToButton(COMMANDS.addItem), onStartAdding);
bot.hears(mapCommandToButton(COMMANDS.deleteItem), onStartDeleting);
bot.hears(mapCommandToButton(COMMANDS.exitMode), onExitMode);
bot.hears(mapCommandToButton(COMMANDS.deleteList), onDeleteList);
bot.hears(mapCommandToButton(COMMANDS.toggleItem), onStartToggling);

bot.on('text', onText);

GSPClient.init()
  .then(() => bot.launch())
  .then(() => console.log('Bot start'));
