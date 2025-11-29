import { TextureLoader as BaseTextureLoader, RepeatWrapping, type Texture } from 'three';

export type TextureLoadData = {
    key: string;
    file: string;
};

type TextureProps = {
    clone: boolean;
    flipY: boolean;
    repeatX: number;
    repeatY: number;
};

export class TextureLoader {
    baseUrl: string;
    storage: Record<string, Texture>;
    loader: BaseTextureLoader;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.storage = {};
        this.loader = new BaseTextureLoader();
    }

    loadAll(queue: TextureLoadData[] = []) {
        return Promise.allSettled(queue.map(this.load, this));
    }

    load({ key, file }: TextureLoadData) {
        return new Promise((resolve) => {
            this.loader.load(file, (data) => {
                resolve(data);
                this.storage[key] = data;
            });
        });
    }

    get(key: string, props: Partial<TextureProps> = {}): Texture {
        const { clone = false, flipY = false, repeatX = 0, repeatY = repeatX } = props;

        let texture = this.storage[key];
        texture = clone ? texture.clone() : texture;
        texture.flipY = flipY;

        if (repeatX) {
            texture.repeat.set(repeatX, repeatY);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
        }

        return texture;
    }
}
