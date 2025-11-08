import { ModelLoader, type ModelLoadData } from './loaders/model-loader';
import { TextureLoader, type TextureLoadData } from './loaders/texture-loader';

export type AssetsData = {
    models: ModelLoadData[],
    textures: TextureLoadData[],
};

class AssetsSystem {
    models: ModelLoader;
    textures: TextureLoader;

    constructor() {
        this.models = new ModelLoader('./src/assets/models/');
        this.textures = new TextureLoader('./src/assets/textures/');
    }

    async load({ models, textures }: AssetsData) {
        await Promise.allSettled([
            this.models.loadAll(models),
            this.textures.loadAll(textures),
        ]);

        console.log('MODELS:', this.models.storage);
        console.log('TEXTURES:', this.textures.storage);
    }
}

export const assets = new AssetsSystem();
