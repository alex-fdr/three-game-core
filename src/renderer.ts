import { WebGLRenderer, type WebGLRendererParameters } from 'three';

export type RendererProps = WebGLRendererParameters & {
    width: number;
    height: number;
    parentId: string;
    color?: number | string;
    opacity?: number;
};

export class Renderer extends WebGLRenderer {
    constructor(props: RendererProps) {
        const {
            width,
            height,
            parentId,
            color = '#333333',
            opacity = 1,
        } = props;
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
