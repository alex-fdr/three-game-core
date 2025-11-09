import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: './dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'three-game-core',
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'three', 
                'cannon-es', 
                'three/addons/loaders/GLTFLoader',
                'three/addons/utils/SkeletonUtils',

            ]
        },
        reportCompressedSize: false,
    },
    plugins: [
        dts({ rollupTypes: true })
    ]
})