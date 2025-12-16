A starter template to speed up the initial development phase of a three.js based project. It contains some useful components such as: a scene, a camera, a renderer and asset loaders for textures and glb models. 

[![npm version](https://img.shields.io/npm/v/@alexfdr/three-game-core)](https://www.npmjs.com/package/@alexfdr/three-game-core)

## How to install
```bash
npm install --save @alexfdr/three-game-core 
```

## How to use

```typescript
import { core } from '@alexfdr/three-game-core';

core.init(window.innerWidth, window.innerHeight);
```

Init method receives an optional config object.
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