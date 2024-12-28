import { HttpException } from "./root";

// This is the error we will be throwing when a user is not authorized
export class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: number, errors?: any) {
        super(message, errorCode, 401, errors)
    }
}