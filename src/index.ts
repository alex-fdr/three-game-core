import { GameCore } from './core';

export { type AssetsData, assets } from './assets';
export type { GameSettings } from './core';
export type { InputHandler, InputStatus } from './input';
export * as utils from './utils';

export const core = new GameCore();
