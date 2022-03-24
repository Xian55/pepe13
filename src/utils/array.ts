export {}

declare global {
    interface Array<T> {
        sample(): T;
    }
}

if (!Array.prototype.sample) {
    Array.prototype.sample = function<T>() {
        return this[Math.floor(Math.random() * this.length)] as T;
    };
}