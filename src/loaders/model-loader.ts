import type { AnimationClip, Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils';

type StorageItem = {
    model: Object3D;
    animations: AnimationClip[];
};

export type ModelLoadData = {
    key: string;
    file: string;
};

export class ModelLoader {
    public baseUrl: string;
    public storage: Record<string, StorageItem>;
    public loader: GLTFLoader;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.storage = {};
        this.loader = new GLTFLoader();
    }

    loadAll(queue: ModelLoadData[] = []) {
        return Promise.allSettled(queue.map(this.load, this));
    }

    load({ key, file }: ModelLoadData) {
        return new Promise((resolve) => {
            this.loader.load(file, (data) => {
                resolve(data);
                this.storage[key] = {
                    model: data.scene,
                    animations: data.animations,
                };
            });
        });
    }

    get(key: string, name?: string): Object3D | never {
        const { model } = this.storage[key];
        const mesh = name ? model.getObjectByName(name) : model;

        if (!mesh) {
            throw new Error(`no mesh named ${key} found`);
        }

        if (model.getObjectByProperty('type', 'SkinnedMesh')) {
            return SkeletonUtils.clone(mesh);
        }

        return mesh.clone();
    }

    getAnimation(key: string, index = 0): AnimationClip {
        return this.storage[key].animations[index];
    }

    getAnimations(key: string, commonNamePart?: string): AnimationClip[] {
        const list = this.storage[key].animations;
        // biome-ignore format : keep it as it is
        return commonNamePart 
            ? list.filter((anim) => anim.name.includes(commonNamePart)) 
            : list;
    }
}
