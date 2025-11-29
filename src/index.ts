import { GameCore } from './core';

export { assets, type AssetsData } from './assets';
export type { GameSettings } from './core';
export type { InputHandler, InputStatus } from './input/input-handler';
export * as utils from './utils';

export const core = new GameCore();
