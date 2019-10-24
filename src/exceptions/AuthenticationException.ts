class AuthenticationException extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AuthenticationException.prototype);
    }
}

export {AuthenticationException};
