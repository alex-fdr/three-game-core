import { GameCore } from './core';

export { type AssetsData, assets } from './assets';
export { Signal } from './helpers/signal';
export type { InputHandler, InputStatus } from './input';
export type { GameSettings } from './settings';
export * as utils from './utils';

export const core = new GameCore();
