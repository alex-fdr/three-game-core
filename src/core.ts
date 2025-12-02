import { Clock } from 'three';
import { Camera, type CameraProps } from './camera';
import { Signal } from './helpers/signal';
import { InputSystem } from './input';
import { Physics, type PhysicsProps } from './physics';
import { Renderer, type RendererProps } from './renderer';
import { Scene, type SceneProps } from './scene';
import * as utils from './utils';

export type GameSettings = {
    scene: SceneProps;
    renderer: RendererProps;
    camera: CameraProps;
    physics: PhysicsProps;
};

export const defaultSettings: GameSettings = {
    scene: {
        lights: [
            {
                type: 'ambient',
                color: '#ffffff',
                intensity: 1,
            },
        ],
    },
    camera: {
        near: 1,
        far: 1000,
        fov: { portrait: 45, landscape: 45 },
        position: { x: 0, y: 0, z: 5 },
    },
    renderer: {
        width: 1024,
        height: 1024,
        color: '#333333',
        opacity: 1,
        parentId: '',
        needResetState: false,
    },
    physics: {},
};

export class GameCore {
    scene!: Scene;
    camera!: Camera;
    renderer!: Renderer;
    physics?: Physics;
    input!: InputSystem;
    clock = new Clock();
    onUpdate: Signal<[number, number]> = new Signal();
    onResize: Signal<[number, number]> = new Signal();

    init(width: number, height: number, gameSettings: Partial<GameSettings> = {}): void {
        const settings = utils.deepMerge(defaultSettings, gameSettings);
        const { scene, camera, renderer, physics } = settings;

        this.scene = new Scene(scene);
        this.camera = new Camera(camera, this.scene);
        this.renderer = new Renderer({ ...renderer, width, height });
        this.input = new InputSystem(this.renderer.domElement);

        if (physics) {
            this.physics = new Physics(physics);
        }

        this.renderer.setAnimationLoop(this.update.bind(this));
        this.resize(width, height);
        this.input.init();

        if (!renderer?.needResetState) {
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
        this.physics?.update(time);

        this.onUpdate.dispatch(time, this.clock.getDelta());
    }
}
