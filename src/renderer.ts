import { WebGLRenderer, type WebGLRendererParameters } from 'three';

export type RendererProps = WebGLRendererParameters & {
    width: number;
    height: number;
    parentId: string;
    color: number | string;
    opacity: number;
    needResetState?: boolean;
};

export class Renderer extends WebGLRenderer {
    needResetState: boolean;

    constructor(props: RendererProps) {
        const { width, height, parentId, color, opacity, needResetState } = props;

        super(props);

        this.needResetState = needResetState ?? false;

        this.setSize(width, height);
        this.setClearColor(color, opacity);

        if (parentId) {
            const el = document.getElementById(parentId);
            el?.append(this.domElement);
        } else {
            document.body.append(this.domElement);
        }
    }

    resize(width: number, height: number) {
        this.setSize(width, height, false);
    }
}
