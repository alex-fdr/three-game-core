import { Box3, type Object3D, Vector3 } from 'three';

export function getObjectSize(target: Object3D): Vector3 {
    const box = new Box3().setFromObject(target);
    const size = new Vector3();
    box.getSize(size);
    return size;
}
