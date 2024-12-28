import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { ErrorCode } from "../exceptions/root";

export const adminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
        // Handle the case where the user is undefined 
        return next(new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED))
    }
    
    if (user.role === "ADMIN") {
        next(); 
    } else {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    };  
}

export default adminMiddleware; 