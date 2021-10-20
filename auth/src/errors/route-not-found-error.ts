import { CustomError} from './custom-error';

export class RouteNotFoundError extends CustomError {
    statusCode = 400;

    constructor() {
        super('Route not found');

        //Only because we are extending a built in class
        Object.setPrototypeOf(this, RouteNotFoundError.prototype);
    }

    serializeErrors() {
        return [{message: 'Route not Found'}]
    }
}
