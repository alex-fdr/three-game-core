export function deepMerge(target: any, source: any): any {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    const output = { ...target };

    for (const key in source) {
        if (isObject(source[key])) {
            if (!(key in target)) {
                output[key] = source[key];
            } else {
                output[key] = deepMerge(target[key], source[key]);
            }
        } else {
            output[key] = source[key];
        }
    }

    return output;
}

function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
