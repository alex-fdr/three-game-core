import { Clock } from 'three';
import { throttleTrailing } from 'three-game-utils';
import { Camera } from './camera';
import { InputSystem } from './input/input';
import { Physics } from './physics';
import { Renderer } from './renderer';
import { Scene } from './scene';
import type { GameSettings } from './settings';

export type UpdateCallback = (time: number, deltaTime: number) => void;

export class GameCore {
    scene!: Scene;
    camera!: Camera;
    renderer!: Renderer;
    physics!: Physics;
    input!: InputSystem;
    clock = new Clock();
    onUpdateCallbacks: UpdateCallback[] = [];

    init(width = 960, height = 960, gameSettings: GameSettings) {
        const { scene, camera, renderer, physics } = gameSettings;

        this.scene = new Scene(scene);
        this.camera = new Camera(camera, this.scene);
        this.renderer = new Renderer({ ...renderer, width, height });
        this.physics = new Physics(physics);
        this.input = new InputSystem(this.renderer.domElement);

        this.renderer.setAnimationLoop(this.update.bind(this));
        this.resize(width, height);
        this.input.init();

        const throttledResizeHandler = throttleTrailing(() => {
            this.resize(window.innerWidth, window.innerHeight);
        }, 1000);

        window.addEventListener('resize', throttledResizeHandler);
    }

    onUpdate(callback: UpdateCallback) {
        this.onUpdateCallbacks.push(callback);
    }

    resize(width: number, height: number) {
        this.camera.resize(width, height);
        this.renderer.resize(width, height);
    }

    update(time: number) {
        this.physics.update(time);
        this.renderer.render(this.scene, this.camera);

        for (const fn of this.onUpdateCallbacks) {
            fn(time, this.clock.getDelta());
        }
    }
}
