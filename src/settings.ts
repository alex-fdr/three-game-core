import type { Vector3Like } from 'three';

export type GameSettings = {
    scene: SceneProps;
    renderer: RendererProps;
    camera: CameraProps;
    physics: PhysicsProps;
};

export type SceneProps = {
    bg: number | string;
    fog?: {
        color: number | string;
        near: number;
        far: number;
    };
    lights: [];
};

export type LightProps = {
    type: 'directional';
    color: number | string;
    intensity: number;
    data: { position: Vector3Like; };
} | {
    type: 'hemisphere';
    skyColor: number | string;
    groundColor: number | string;
    intensity: number;
    data: { position: Vector3Like; };
} | {
    type: 'ambient';
    color: number | string;
    intensity: number;
    data: undefined;
};

export type CameraProps = {
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

export type RendererProps = {
    width: number;
    height: number;
    parentId: string;
    antialias: boolean;
    alpha: boolean;
    color: number | string;
    opacity: number;
};

export type PhysicsProps = {
    gravity: Vector3Like;
};