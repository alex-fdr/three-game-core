import { Clock } from 'three';
import { Camera } from './camera';
import { Signal } from './helpers/signal';
import { InputSystem } from './input';
import { Renderer } from './renderer';
import { Scene } from './scene';
import { defaultSettings, type GameSettings } from './settings';
import * as utils from './utils';

export class GameCore {
    scene!: Scene;
    camera!: Camera;
    renderer!: Renderer;
    input!: InputSystem;
    clock = new Clock();
    onUpdate: Signal<[number, number]> = new Signal();
    onResize: Signal<[number, number]> = new Signal();

    init(width: number, height: number, gameSettings: Partial<GameSettings> = {}): void {
        const settings = utils.deepMerge(defaultSettings, gameSettings);

        this.scene = new Scene(settings.scene);
        this.camera = new Camera(settings.camera, this.scene);
        this.renderer = new Renderer({ ...settings.renderer, width, height });
        this.input = new InputSystem(this.renderer.domElement);

        this.renderer.setAnimationLoop(this.update.bind(this));
        this.resize(width, height);
        this.input.init();

        if (!settings.renderer?.needResetState) {
            this.onUpdate.add(this.render, this);
        }

        window.addEventListener('resize', () => {
            const { width, height } = utils.getScreenSize();
            this.resize(width, height);
        });
    }

    resize(width: number, height: number): void {
        this.camera.resize(width, height);
        this.renderer.resize(width, height);

        this.onResize.dispatch(width, height);
    }

    render(): void {
        if (this.renderer.needResetState) {
            this.renderer.resetState();
        }

        this.renderer.render(this.scene, this.camera);
    }

    update(time: number): void {
        this.onUpdate.dispatch(time, this.clock.getDelta());
    }
}
