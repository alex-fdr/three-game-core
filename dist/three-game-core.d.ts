import { AmbientLight } from 'three';
import { AnimationClip } from 'three';
import { Clock } from 'three';
import { DirectionalLight } from 'three';
import { GLTFLoader } from '../../node_modules/@types/three/examples/jsm/loaders/GLTFLoader';
import { HemisphereLight } from 'three';
import { Light } from 'three';
import { Object3D } from 'three';
import { PerspectiveCamera } from 'three';
import { Scene as Scene_2 } from 'three';
import { Texture } from 'three';
import { TextureLoader as TextureLoader_2 } from 'three';
import { Vector3 } from 'three';
import { Vector3Like } from 'three';
import { WebGLRenderer } from 'three';
import { WebGLRendererParameters } from 'three';
import { World } from 'cannon-es';

declare type AmbientLightProps = {
    type: 'ambient';
    color: number | string;
    intensity: number;
};

declare function applyTransform(target: Object3D, props?: TransformProps): void;

export declare const assets: AssetsSystem;

export declare type AssetsData = {
    models: ModelLoadData[];
    textures: TextureLoadData[];
};

declare class AssetsSystem {
    models: ModelLoader;
    textures: TextureLoader;
    constructor();
    load({ models, textures }: AssetsData): Promise<void>;
}

declare class Camera extends PerspectiveCamera {
    wrapper: Object3D | null;
    constructor(props: CameraProps, scene: Scene_2);
    addWrapper(scene: Scene_2, props: NonNullable<CameraProps['wrapper']>): void;
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
    wrapper?: {
        enabled: boolean;
        lerp: number;
        position: Vector3Like;
    };
};

export declare const core: GameCore;

declare function deepMerge(target: any, source: any): any;

declare type DirectionalLightProps = {
    type: 'directional';
    color: number | string;
    intensity: number;
    data: {
        position: Vector3Like;
    };
};

declare class GameCore {
    scene: Scene;
    camera: Camera;
    renderer: Renderer;
    physics?: Physics;
    input: InputSystem;
    clock: Clock;
    onUpdateCallbacks: UpdateCallback[];
    onResizeCallbacks: ResizeCallback[];
    init(width: number, height: number, gameSettings?: Partial<GameSettings>): void;
    onUpdate(callback: UpdateCallback): void;
    onResize(callback: ResizeCallback): void;
    resize(width: number, height: number): void;
    render(): void;
    update(time: number): void;
}

export declare type GameSettings = {
    scene: SceneProps;
    renderer: RendererProps;
    camera: CameraProps;
    physics: PhysicsProps;
};

declare function getObjectSize(target: Object3D): Vector3;

declare function getScreenSize(base?: number): {
    width: number;
    height: number;
};

declare type HemisphereLightProps = {
    type: 'hemisphere';
    skyColor: number | string;
    groundColor: number | string;
    intensity: number;
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

declare type LightProps = DirectionalLightProps | HemisphereLightProps | AmbientLightProps;

declare type ModelLoadData = {
    key: string;
    file: string;
};

declare class ModelLoader {
    baseUrl: string;
    storage: Record<string, StorageItem>;
    loader: GLTFLoader;
    constructor(baseUrl: string);
    loadAll(queue?: ModelLoadData[]): Promise<PromiseSettledResult<unknown>[]>;
    load({ key, file }: ModelLoadData): Promise<unknown>;
    get(key: string, name?: string): Object3D | never;
    getAnimation(key: string, index?: number): AnimationClip;
    getAnimations(key: string, commonNamePart?: string): AnimationClip[];
}

declare class Physics {
    timeStep: number;
    lastCallTime: number;
    maxSubSteps: number;
    world: World;
    constructor(config: PhysicsProps);
    update(time: number): void;
}

declare type PhysicsProps = {
    gravity?: Vector3Like;
};

declare class Renderer extends WebGLRenderer {
    needResetState: boolean;
    constructor(props: RendererProps);
    resize(width: number, height: number): void;
}

declare type RendererProps = WebGLRendererParameters & {
    width: number;
    height: number;
    parentId: string;
    color: number | string;
    opacity: number;
    needResetState?: boolean;
};

declare type ResizeCallback = (width: number, height: number) => void;

declare class Scene extends Scene_2 {
    lights: Light[];
    constructor(props: SceneProps);
    addBackground(color: number | string): void;
    addFog(props: NonNullable<SceneProps['fog']>): void;
    addLights(lightsSettings?: LightProps[]): void;
    createLightInstance(p: LightProps): DirectionalLight | HemisphereLight | AmbientLight;
}

declare type SceneProps = {
    bg?: number | string;
    fog?: {
        color: number | string;
        near: number;
        far: number;
    };
    lights?: LightProps[];
};

declare type StorageItem = {
    model: Object3D;
    animations: AnimationClip[];
};

declare type TextureLoadData = {
    key: string;
    file: string;
};

declare class TextureLoader {
    baseUrl: string;
    storage: Record<string, Texture>;
    loader: TextureLoader_2;
    constructor(baseUrl: string);
    loadAll(queue?: TextureLoadData[]): Promise<PromiseSettledResult<unknown>[]>;
    load({ key, file }: TextureLoadData): Promise<unknown>;
    get(key: string, props?: Partial<TextureProps>): Texture;
}

declare type TextureProps = {
    clone: boolean;
    flipY: boolean;
    repeatX: number;
    repeatY: number;
};

declare function throttleTrailing(callback: Function, limit: number): (...args: any[]) => void;

declare interface TransformProps {
    position?: Partial<Vector3Like>;
    rotation?: Partial<Vector3Like>;
    scale?: Partial<Vector3Like>;
    scaleFactor?: number;
}

declare type UpdateCallback = (time: number, deltaTime: number) => void;

export declare namespace utils {
    export {
        applyTransform,
        TransformProps,
        getObjectSize,
        getScreenSize,
        throttleTrailing,
        deepMerge
    }
}

export { }
