import {
    AmbientLight,
    Scene as BaseScene,
    Color,
    DirectionalLight,
    Fog,
    HemisphereLight,
    type Light,
} from 'three';
import type { LightProps, SceneProps } from './settings';

export class Scene extends BaseScene {
    lights: Light[] = [];

    constructor(props: SceneProps) {
        super();

        const { bg, fog, lights } = props;
        this.name = 'root';

        if (bg) this.addBackground(bg);
        if (lights) this.addLights(lights);
        if (fog) this.addFog(fog);
    }

    addBackground(color: number | string) {
        this.background = new Color(color);
    }

    addFog(props: NonNullable<SceneProps['fog']>) {
        const { color = '#ffffff', near = 1, far = 100 } = props;
        this.fog = new Fog(color, near, far);
    }

    addLights(lightsSettings: LightProps[] = []) {
        for (const props of lightsSettings) {
            const { data } = props;
            const light = this.createLightInstance(props);

            if (data?.position) {
                light.position.copy(data.position);
            }

            this.add(light);
            this.lights.push(light);
        }
    }

    createLightInstance(p: LightProps) {
        switch (p.type) {
            case 'directional':
                return new DirectionalLight(p.color, p.intensity);
            case 'hemisphere':
                return new HemisphereLight(p.skyColor, p.groundColor, p.intensity);
            case 'ambient':
                return new AmbientLight(p.color, p.intensity);
            default:
                return new AmbientLight('#ff0000', 1);
        }
    }
}
