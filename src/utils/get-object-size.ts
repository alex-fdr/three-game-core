import { Box3, Object3D, Vector3 } from 'three';

export function getObjectSize(target: Object3D) {
    const box = new Box3().setFromObject(target);
    const size = new Vector3();
    box.getSize(size);
    return size;
}
