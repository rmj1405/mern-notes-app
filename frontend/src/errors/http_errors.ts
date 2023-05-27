class HttpError extends Error {
    constructor(message?:string) {
        super(message)
        this.name = this.constructor.name
    }
}

/**
 * Status code: 401
 */
export class UnauthorisedError extends Error {}

/**
 * Status code: 409
 */
export class ConflictError extends Error {}

//add more error classes if needed