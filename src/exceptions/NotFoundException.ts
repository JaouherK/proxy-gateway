class NotFoundException extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}

export {NotFoundException};
