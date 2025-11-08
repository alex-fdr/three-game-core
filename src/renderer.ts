import { WebGLRenderer } from 'three';
import type { RendererProps } from './settings';

export class Renderer extends WebGLRenderer {
    constructor(props: RendererProps) {
        const { width, height, color, opacity, parentId } = props;
        super(props);

        this.setSize(width, height);
        this.setClearColor(color, opacity);

        const el = document.getElementById(parentId);
        el?.append(this.domElement);
    }

    resize(width: number, height: number) {
        this.setSize(width, height);
    }
}
