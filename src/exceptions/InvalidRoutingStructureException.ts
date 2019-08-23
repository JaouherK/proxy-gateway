class InvalidRoutingStructureException extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidRoutingStructureException.prototype);
    }
}

export {InvalidRoutingStructureException};
