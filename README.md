A starter template to speed up the initial development phase of a three.js based project. It contains some useful components such as: scene, camera, renderer and assets loaders. 

[![npm version](https://img.shields.io/npm/v/@alexfdr/three-game-core)](https://www.npmjs.com/package/@alexfdr/three-game-core)

# How to install
```bash
npm install @alexfdr/three-game-core --save
```

# How to use

## Initialization
```typescript
import { core } from '@alexfdr/three-game-core';

core.init(window.innerWidth, window.innerHeight);
```
It is possible to define some extra settings for a camera, a renderer and a scene, etc.
```typescript
import { core, type GameSettings } from '@alexfdr/three-game-core';

const settings: GameSettings = {
    camera: {
        near: 1,
        far: 100,
        position: { x: 1, y: 2, z: 3 },
    },
    renderer: {
        color: '#ff00ff',
    },
};

core.init(window.innerWidth, window.innerHeight, settings);
```

## Loading assets
```typescript
import { assets } from '@alexfdr/three-game-core';
import someModelFile from './model.glb';
import someTextureFile from './texture.png';

await assets.load({
    models: [
        { key: 'some-model', file: someModelFile },
    ],
    textures: [
        { key: 'some-texture', file: someTextureFile },
    ],
});

const model = assets.models.get('some-model');
const texture = assets.textures.get('some-texture');

```