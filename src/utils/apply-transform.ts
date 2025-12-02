import type { Object3D, Vector3Like } from 'three';

export interface TransformProps {
    position?: Partial<Vector3Like>;
    rotation?: Partial<Vector3Like>;
    scale?: Partial<Vector3Like>;
    scaleFactor?: number;
}

export function applyTransform(target: Object3D, props: TransformProps = {}): void {
    const { position, rotation, scale, scaleFactor } = props;

    if (position) {
        const { x = 0, y = 0, z = 0 } = position;
        target.position.set(x, y, z);
    }

    if (rotation) {
        const { x = 0, y = 0, z = 0 } = rotation;
        target.rotation.set(x, y, z);
    }

    if (scale) {
        const { x = 1, y = 1, z = 1 } = scale;
        target.scale.set(x, y, z);
    }

    if (scaleFactor) {
        target.scale.multiplyScalar(scaleFactor);
    }
}
