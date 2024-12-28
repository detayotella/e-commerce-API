import { ErrorCode, HttpException } from "./root";

export class BadRequestsException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors?: any) {
        // messsage, errorCode, statusCode: 400, error: null
        super(message, errorCode, 400, errors); 
    }
}