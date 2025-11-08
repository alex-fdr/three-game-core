import { AmbientLight } from 'three';
import { Clock } from 'three';
import { DirectionalLight } from 'three';
import { HemisphereLight } from 'three';
import { Light } from 'three';
import { Object3D } from 'three';
import { PerspectiveCamera } from 'three';
import { Scene as Scene_2 } from 'three';
import { Vector3Like } from 'three';
import { WebGLRenderer } from 'three';
import { World } from 'cannon-es';

export declare type AssetsData = {
    models: ModelLoadData[];
    textures: TextureLoadData[];
};

declare class Camera extends PerspectiveCamera {
    wrapper: Object3D | null;
    constructor(props: CameraProps, scene: Scene_2);
    addWrapper(scene: Scene_2, props: NonNullable<CameraProps['following']>): void;
    resize(width: number, height: number): void;
}

declare type CameraProps = {
    fov: {
        landscape: number;
        portrait: number;
    };
    near: number;
    far: number;
    position: Vector3Like;
    following?: {
        enabled: boolean;
        lerp: number;
        position: Vector3Like;
    };
};

export declare const core: GameCore;

declare class GameCore {
    scene: Scene;
    camera: Camera;
    renderer: Renderer;
    physics: Physics;
    input: InputSystem;
    clock: Clock;
    onUpdateCallbacks: UpdateCallback[];
    init(width: number | undefined, height: number | undefined, gameSettings: GameSettings): void;
    onUpdate(callback: UpdateCallback): void;
    resize(width: number, height: number): void;
    update(time: number): void;
}

export declare type GameSettings = {
    scene: SceneProps;
    renderer: RendererProps;
    camera: CameraProps;
    physics: PhysicsProps;
};

declare type InputCallback = (data: InputStatus) => void;

declare type InputHanderCallbacks = {
    down: InputCallback[];
    up: InputCallback[];
    move: InputCallback[];
};

export declare interface InputHandler {
    down(e: MouseEvent | Touch): void;
    move(e: MouseEvent | Touch): void;
    up(e: MouseEvent | Touch): void;
    pressed?: boolean;
    status: InputStatus;
}

export declare interface InputStatus {
    currX: number;
    currY: number;
    prevX: number;
    prevY: number;
    deltaX: number;
    deltaY: number;
}

declare class InputSystem {
    domElement: HTMLCanvasElement;
    enabled: boolean;
    handler: InputHandler | null;
    mouseEvents: readonly ["mousedown", "mousemove", "mouseup"];
    touchEvents: readonly ["touchstart", "touchmove", "touchend"];
    callbacks: InputHanderCallbacks;
    constructor(domElement: HTMLCanvasElement);
    init(): void;
    setHandler(handler: InputHandler): void;
    getEvent(e: TouchEvent | MouseEvent): Touch | MouseEvent;
    onDown(cb: InputCallback): void;
    onMove(cb: InputCallback): void;
    onUp(cb: InputCallback): void;
}

declare type LightProps = {
    type: 'directional';
    color: number | string;
    intensity: number;
    data: {
        position: Vector3Like;
    };
} | {
    type: 'hemisphere';
    skyColor: number | string;
    groundColor: number | string;
    intensity: number;
    data: {
        position: Vector3Like;
    };
} | {
    type: 'ambient';
    color: number | string;
    intensity: number;
    data: undefined;
};

declare type ModelLoadData = {
    key: string;
    file: string;
};

declare class Physics {
    timeStep: number;
    lastCallTime: number;
    maxSubSteps: number;
    world: World;
    constructor(config: PhysicsProps);
    update(time: number): void;
}

declare type PhysicsProps = {
    gravity: Vector3Like;
};

declare class Renderer extends WebGLRenderer {
    constructor(props: RendererProps);
    resize(width: number, height: number): void;
}

declare type RendererProps = {
    width: number;
    height: number;
    parentId: string;
    antialias: boolean;
    alpha: boolean;
    color: number | string;
    opacity: number;
};

declare class Scene extends Scene_2 {
    lights: Light[];
    constructor(props: SceneProps);
    addBackground(color: number | string): void;
    addFog(props: NonNullable<SceneProps['fog']>): void;
    addLights(lightsSettings?: LightProps[]): void;
    createLightInstance(p: LightProps): DirectionalLight | HemisphereLight | AmbientLight;
}

declare type SceneProps = {
    bg: number | string;
    fog?: {
        color: number | string;
        near: number;
        far: number;
    };
    lights: [];
};

declare type TextureLoadData = {
    key: string;
    file: string;
};

declare type UpdateCallback = (time: number, deltaTime: number) => void;

export { }
