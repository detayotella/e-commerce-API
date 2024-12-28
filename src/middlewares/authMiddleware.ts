import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import jwt, { JwtPayload} from "jsonwebtoken"; 
import { JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import { RequestWithUser } from "../types/RequestWithUser";


// Define the JWT payload type 
interface CustomJWTPayload extends JwtPayload {
    userId: number; 
}

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // 1. extract the token from header 
    const authHeaders = req.headers.authorization 
    const token = authHeaders?.startsWith("Bearer ")
        ? authHeaders.substring(7)
        : authHeaders; 

    // 2. If token is not present, throw an error of unauthorized 
    if (!token) {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }

    // Type assertion since we've checked for undefined 
    //const verifiedToken = token as string; 

    try {
        // 3. If the token is present, verify that token and extract the payload 
        const decodedToken = jwt.verify(token, JWT_SECRET) 
        
        // Type guard to enusre the payload has userId 
        if (!decodedToken || typeof decodedToken !== "object" || !("userId" in decodedToken)) {
            return next(new UnauthorizedException("Invalid token payload", ErrorCode.UNAUTHORIZED)); 
        }

        //const payload = decodedToken as CustomJWTPayload; 

        // 4. To get the user from the payload 
        const user = await prismaClient.user.findFirst({
            where: {
                id: decodedToken.userId
            }
        })
        if (!user) {
            return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
        }
        // 5. To attach the user to the current request object
        // Type assertion to satisfy Typescript that user is not null
        req.user = user; 
        next(); 
    } catch(error) {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }
}

export default authMiddleware;