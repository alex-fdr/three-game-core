import type { CameraProps } from './camera';
import type { PhysicsProps } from './physics';
import type { RendererProps } from './renderer';
import type { SceneProps } from './scene';

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
