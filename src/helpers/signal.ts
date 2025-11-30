type ListenerFunc<T extends any[]> = (...args: T) => void;

export class Signal<T extends any[]> {
    listeners: ListenerFunc<T>[] = [];

    add(listener: ListenerFunc<T>, context?: unknown): void {
        this.listeners.push(context ? listener.bind(context) : listener);
    }

    addOnce(listener: ListenerFunc<T>, context?: unknown): void {
        const id = this.listeners.length;

        const onceCallback = (...data: T) => {
            if (context) {
                listener.call(context, ...data);
            } else {
                listener(...data);
            }
            
            this.listeners.splice(id, 1);
        };

        this.listeners.push(onceCallback);
    }

    remove(): void {
        this.listeners = [];
    }

    dispatch(...data: T): void {
        for (const listener of this.listeners) {
            listener(...data);
        }
    }
}
