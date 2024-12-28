import { Request, Response, NextFunction } from "express"; 
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internalException";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/badRequests";


// A higher-order function for centralized error handling in Express applications.
// This function wraps an asynchronous method and ensures any errors are caught
// and passed to the next middleware (typically an error-handling middleware).
// It improves code maintainability by avoiding repetitive try-catch blocks in route handlers.

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Execute the wrapped method, passing in the request, response, and next function.
            await method(req, res, next) // The method (e.g., signup) is executed here
        } catch(error: any) {
            let exception: HttpException; 
            if (error instanceof HttpException) {
                exception = error; 
            } else {
                if (error instanceof ZodError) {
                    exception = new BadRequestsException("Unprocessable entity", ErrorCode.UNPROCESSIBLE_ENTITY, error)
                } else {
                    exception = new InternalException("Something went wrong", error, ErrorCode.INTERNAL_EXCEPTION)
                }
            }
            next(exception); 
        }
    }
}