export function getScreenSize(base = 1024) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isLandscape = aspectRatio > 1;

    if (isLandscape) {
        return {
            width: base,
            height: Math.round(base / aspectRatio)
        };
    }

    return {
        width: Math.round(base * aspectRatio),
        height: base,
    };
}