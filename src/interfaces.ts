import {Context} from 'telegraf';

import {StateManager} from './services/State';

export interface SessionData {
  state: StateManager;
}

export interface BotContext extends Context {
  session: SessionData;
}
