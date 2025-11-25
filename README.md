A basic template to speed up the initial development phase in three.js based project. It contains useful stuff like scene, camera, renderer, asset loaders and an optional module for cannon-es physics. 

# How to install
```bash
npm install @alexfdr/three-game-core --save
```

# How to use

## Initialization
```typescript
import { core, type GameSettings } from '@alexfdr/three-game-core';

const width = 1024;
const height = 1024;
const settings: GameSettings = {};

core.init(width, height, settings);

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