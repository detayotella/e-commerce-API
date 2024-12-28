import { Request, Response } from "express"; 
import { prismaClient } from "..";
import { RequestWithUser } from "../types/RequestWithUser";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: RequestWithUser, res: Response) => {
    // 1. To create a transaction
    return await prismaClient.$transaction(async (tx) => {
        // 2. To list all the cart items and proceed if the cart
        // is not empty 
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id 
            }, 
            include: {
                product: true 
            }
        })

        if (cartItems.length === 0) {
            return res.json({ message: "Cart is empty"})
        }
        // 3. Calculate the total amount 
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0); 

        // if (!req.user?.id) {
        //     throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND); 
        // }
        // 4. Fetch address of user
        if (!req.user?.defaultShippingAddress) {
            throw new NotFoundException("Shipping address not found", ErrorCode.ADDRESS_NOT_FOUND); 
        }

        const address = await tx.address.findFirst({
            where: {
                id: req.user?.defaultShippingAddress
            }
        })
        // 5. To define computed field for formatted address
        // on address module: code in index.src($extends)
 
        // 6. We will create a order and order products productsorder products
        if (!address?.formattedAddress) {
            throw new NotFoundException("Address is missing or invalid", ErrorCode.ADDRESS_NOT_FOUND); 
        }

        const order = await tx.order.create({
            data: {
                userId: req.user?.id, 
                netAmount: price, 
                address: address?.formattedAddress, 
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId, 
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
    // 7. Create event  
    const orderEvent = await tx.orderEvent.create({
        data: {
            orderId: order.id
        }
    })
    // 8. To empty the cart 
    await tx.cartItem.deleteMany({
        where: {
            userId: req.user?.id 
        }
    })
    return res.json(order); 
    }, { timeout: 10000 });  // Set the timeout to 10 secs 
}

export const listOrders = async (req: RequestWithUser, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user?.id 
        }
    })
    res.json(orders)
}

export const cancelOrder = async (req: Request, res: Response) => {

    // 1. wrap it inside transaction 
    // 2. Check if the user is cancelling its own order 
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id 
            }, 
            data: {
                status: "CANCELLED"
            }
        })

        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id, 
                status: "CANCELLED"
            }
        })
    } catch(error) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND); 

    }

}


export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id 
            }, 
            include: {
                products: true, 
                events: true 
            }
        })
        res.json(order)
    } catch(err) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND); 
    }
}

export const listAllOrders = async (req: Request, res: Response) => {
    let whereClause = {}; 
    const status = req.params.status; 
    if (status) {
        whereClause = {
            status
        }
    }

    const skip = req.query.skip ? +req.query.skip : 0; 
    const orders = await prismaClient.order.findMany({
        where: whereClause, 
        skip: skip, 
        take: 5 
    })
    res.json(orders)

}

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id 
            }, 
            data: {
               status: req.body.status  
            }
        })

        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id, 
                status: req.body.status
            }
        })
        res.json(order)
    } catch(err) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND); 
    }

}

export const listUserOrders = async (req: Request, res: Response) => {
    let whereClause: any = {
        userId: +req.params.id 
    }; 

    const status = req.params.status; 

    if (status) {
        whereClause = {
            ...whereClause, 
            status 
        }
    }

    const skip = req.query.skip ? +req.query.skip : 0; 
    const orders = await prismaClient.order.findMany({
        where: whereClause, 
        skip: skip, 
        take: 5 
    })
    res.json(orders)
    
}
