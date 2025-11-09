import { GameCore } from './game-core';

export type { GameSettings } from './game-core';
export type { InputHandler, InputStatus } from './input/input-handler';
export { assets, type AssetsData } from './assets';

export const core = new GameCore();
