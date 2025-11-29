import { Box3, Vector3, type Object3D } from 'three';

export function getObjectSize(target: Object3D) {
    const box = new Box3().setFromObject(target);
    const size = new Vector3();
    box.getSize(size);
    return size;
}
