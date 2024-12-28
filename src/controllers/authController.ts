import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { User } from "@prisma/client";
import { RequestWithUser } from "../types/RequestWithUser";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    
    // Validate the incoming request body using the SignupSchema.
    // The `parse` method ensures that the request body conforms to the expected schema,
    // throwing an error if validation fails. This helps enforce proper data structure
    // and sanitization before proceeding further.

    // Validate request body
    SignupSchema.parse(req.body)

    const { email, password, name } = req.body; 

    let user = await prismaClient.user.findFirst({
        where: {
            email
        }
    })

    if (!user) {
        new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXISTS)
    }; 

    user = await prismaClient.user.create({
        data: {
            name, 
            email, 
            password: hashSync(password, 10)
        }
    })
    const { password: _,...userWithoutPassword } = user; 
    res.status(201).json(userWithoutPassword); 
    
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body; 

    let user = await prismaClient.user.findFirst({
        where: {
            email
        }
    })

    if(!user) {
        throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET); 

    const { password: _, ...userWithoutPassword } = user; 
    res.json({ user: userWithoutPassword, token }); 
}

// /me -> return the logged in user 
export const me = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next (new BadRequestsException("User not authenticated", ErrorCode.UNAUTHORIZED))
        } 
        const { password: _, ...userWithoutPassword } = req.user; 
        res.json(userWithoutPassword); 
    } catch(error) {
        next(error); 
    }

}