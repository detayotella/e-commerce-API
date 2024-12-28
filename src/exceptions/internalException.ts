import { HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message: string, errors: any, errorCode: number) {
        // Error code for internal exception is 500
        super(message, errorCode, 500, errors)
    }
}