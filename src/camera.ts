import { Object3D, PerspectiveCamera, Scene } from 'three';
import type { CameraProps } from './settings';

export class Camera extends PerspectiveCamera {
    wrapper: Object3D | null;

    constructor(props: CameraProps, scene: Scene) {
        const { fov, near, far, position, following } = props;

        super(fov.portrait, 1, near, far);

        this.position.copy(position);
        this.userData.fov = fov;
        this.wrapper = null;

        if (following) {
            this.addWrapper(scene, following);
        }
    }

    addWrapper(scene: Scene, props: NonNullable<CameraProps['following']>) {
        const { x = 0, y = 0, z = 0 } = props.position;
        this.wrapper = new Object3D();
        this.wrapper.position.set(x, y, z);
        this.wrapper.add(this);
        scene.add(this.wrapper);
        this.lookAt(x, y, z);
    }

    resize(width: number, height: number) {
        // const { fov } = gameSettings.camera;
        const { fov } = this.userData;
        this.aspect = width / height;
        this.fov = this.aspect > 1 ? fov.landscape : fov.portrait;
        this.updateProjectionMatrix();
    }
}
