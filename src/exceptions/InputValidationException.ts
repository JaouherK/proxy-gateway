class InputValidationException extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InputValidationException.prototype);
    }
}

export {InputValidationException};
