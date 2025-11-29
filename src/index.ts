import { GameCore } from './game-core';

export { type AssetsData, assets } from './assets';
export type { GameSettings } from './game-core';
export type { InputHandler, InputStatus } from './input/input-handler';

export const core = new GameCore();
