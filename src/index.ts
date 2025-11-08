import { GameCore } from './game-core';

export type { InputHandler, InputStatus } from './input/input-handler';
export type { AssetsData } from './assets';
export type { GameSettings } from './settings';

export const core = new GameCore();
