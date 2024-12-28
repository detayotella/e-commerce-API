import { Request, Response } from "express";
import { AddressSchema, ChangeUserRoleSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { RequestWithUser } from "../types/RequestWithUser";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/badRequests";

export const addAddress = async (req: RequestWithUser, res: Response) => {
    AddressSchema.parse(req.body); 

    const address = await prismaClient.address.create({
        data: {
            ...req.body, 
            userId: req.user?.id
        }
    })
    res.json(address);  
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id 
            }
        })
        res.json({ success: true })
    } catch(err) {
        throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND); 
    }

}

export const listAddress = async (req: RequestWithUser, res: Response) => {
    const addresses =  await prismaClient.address.findMany({
        where: {
            userId: req.user?.id 
        }
    })
    res.json(addresses); 

}

export const updateUser = async (req: RequestWithUser, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body); 
    let shippingAddress: Address; 
    let billingAddress: Address; 

    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })
        } catch(error) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND); 
        }

        
        if (shippingAddress.userId !== req.user?.id ) {
            throw new BadRequestsException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }

    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })
        } catch(error) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND); 
        }

        if (billingAddress.userId !== req.user?.id) {
            throw new BadRequestsException("Addresss does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG); 
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user?.id 
        }, 
        data: {
            ...req.body
        }
    })

    res.json(updateUser)
}

export const listUsers = async (req: Request, res: Response) => {
    // Validate 'skip' query parameter 
    const skip = req.query.skip ? +req.query.skip : 0; 

    if (isNaN(skip) || skip < 0) {
        return res.status(400).json({ 
            message: "Invalid `skip` value. It should be non-negative number"
        })
    }
    const users = await prismaClient.user.findMany({
        skip: skip, 
        take: 5 
    })
    res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            }, 
            include: {
                address: true 
            }
        })
        res.json(user); 
    } catch (error) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND); 
    }

}

export const changeUserRole = async (req: Request, res: Response) => {
    ChangeUserRoleSchema.parse(req.body); 
    try {
        const user = await prismaClient.user.update({
            where: {
                id: +req.params.id 
            }, 
            data: {
                role: req.body.role
            }
        })
        res.json(user);
    } catch {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND); 
    }

}
