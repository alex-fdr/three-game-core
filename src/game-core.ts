import { Clock } from 'three';
import { throttleTrailing } from '@alexfdr/three-game-utils';
import { Camera, type CameraProps } from './camera';
import { InputSystem } from './input/input';
import { Physics, type PhysicsProps } from './physics';
import { Renderer, type RendererProps } from './renderer';
import { Scene, type SceneProps } from './scene';

export type GameSettings = {
    scene: SceneProps;
    renderer: RendererProps;
    camera: CameraProps;
    physics: PhysicsProps;
};

export type UpdateCallback = (time: number, deltaTime: number) => void;
export type ResizeCallback = (width: number, height: number) => void;

export class GameCore {
    scene!: Scene;
    camera!: Camera;
    renderer!: Renderer;
    physics!: Physics;
    input!: InputSystem;
    clock = new Clock();
    onUpdateCallbacks: UpdateCallback[] = [];
    onResizeCallbacks: ResizeCallback[] = [];

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

    onResize(callback: ResizeCallback) {
        this.onResizeCallbacks.push(callback);
    }

    resize(width: number, height: number) {
        this.camera.resize(width, height);
        this.renderer.resize(width, height);

        for (const fn of this.onResizeCallbacks) {
            fn(width, height);
        }
    }

    update(time: number) {
        for (const fn of this.onUpdateCallbacks) {
            fn(time, this.clock.getDelta());
        }
    }
}
