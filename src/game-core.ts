import { Clock } from 'three';
import { deepMerge } from '@alexfdr/three-game-utils';
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
    onUpdateCallbacks: UpdateCallback[] = [];
    onResizeCallbacks: ResizeCallback[] = [];

    init(width: number, height: number, gameSettings: Partial<GameSettings> = {}) {
        const settings = deepMerge(defaultSettings, gameSettings);
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
            this.onUpdate(() => this.render());
        }
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

    render() {
        if (this.renderer.needResetState) {
            this.renderer.resetState();
        }

        this.renderer.render(this.scene, this.camera);
    }

    update(time: number) {
        this.physics?.update(time);

        for (const fn of this.onUpdateCallbacks) {
            fn(time, this.clock.getDelta());
        }
    }
}
