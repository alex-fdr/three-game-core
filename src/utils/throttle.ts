export function throttleTrailing(callback: Function, limit: number) {
    let lastFunc: number;
    let lastRan: number;

    return (...args: any[]) => {
        if (!lastRan) {
            // Run immediately on first call
            callback(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            // Schedule to run after 'limit' ms from the last attempt
            lastFunc = setTimeout(
                () => {
                    if (Date.now() - lastRan >= limit) {
                        callback(...args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan),
            );
        }
    };
}
