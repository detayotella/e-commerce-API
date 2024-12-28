import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "@prisma/client";
import { prismaClient } from "..";
import { RequestWithUser } from "../types/RequestWithUser";
import { UnauthorizedException } from "../exceptions/unauthorizedException";

export const addItemToCart = async (req: RequestWithUser, res: Response) => {
    // Parse and validate the request data 
    const validatedData = CreateCartSchema.parse(req.body); 
    
    // Ensure the user is authenticated 
    if (!req.user?.id) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    } 

    // Fetch the product to ensure it exists 
    let product: Product; 

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    } catch(error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND); 
    }

    // Check if the same product alreadly exist in the user's cart 
    const existingCartItem = await prismaClient.cartItem.findFirstOrThrow({
        where: {
            userId: req.user?.id, 
            productId: product.id
        }
    }); 

    let cartItem: CartItem; 

    if (existingCartItem) {
        // If the product exists in the cart, update its quantity 
        cartItem = await prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id
            }, 
            data: {
                quantity: existingCartItem.quantity + validatedData.quantity, // Increment quantity
            }, 
        }); 
    } else {
        // If the product doesn't exists in the cart, create 
        // a new entry 
        cartItem = await prismaClient.cartItem.create({
            data: {
                userId: req.user?.id, 
                productId: product.id, 
                quantity: validatedData.quantity, 
            }
        })
    }
    res.json(cartItem); 
}

export const deleteItemFromCart = async (req: RequestWithUser, res: Response) => {
    // Extract the user ID from the request 
    const userId = req.user?.id; 

    // Validate that the user is authenticated 
    if (!userId) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND); 
    }

    // Fetch the cart item to validate ownership 
    const cartItem = await prismaClient.cartItem.findUniqueOrThrow({
        where: {
            id: +req.params.id 
        }
    }); 

    if (!cartItem) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }

    // Check if the cart item belongs to the logged-in user 
    if (cartItem.userId !== userId) {
        throw new UnauthorizedException("You are not allowed to delete this cart", ErrorCode.UNAUTHORIZED)
    }

    // Delete the cart item 
    await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id 
        }
    })
    res.json({ success: true })

}

export const changeQuantity = async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id; 

    if (!userId) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }

    const cartItem = await prismaClient.cartItem.findUniqueOrThrow({
        where: {
            id: +req.params.id 
        }
    })

    if (!cartItem) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND); 
    }

    if (cartItem.userId !== userId) {
        throw new UnauthorizedException("You are not allowed to increase the item", ErrorCode.UNAUTHORIZED); 
    }
    const validatedData = ChangeQuantitySchema.parse(req.body); 
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id, 

        }, 
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)

}

export const getCart = async (req: RequestWithUser, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user?.id 
        }, 
        // include here will include the product as well
        include: {
            product: true 
        }
    })
    res.json(cart); 
}