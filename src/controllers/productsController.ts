import { Request, Response } from "express"; 
import { prismaClient } from "..";
import { ProductsSchema } from "../schema/products";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
    // tags: ["toodles", "nigeria"] -> "noodles, nigeria"

    // Create a validator to for this request 
    ProductsSchema.parse(req.body); 

    const products = await prismaClient.product.create({
        data: {
            ...req.body, 
            tags: req.body.tags.join(",")
        }
    })
    res.json(products)
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body; 

        if (product.tags) {
            product.tags = product.tags.join(",")
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                // The unary plus (+) is used to convert the string `req.params.id` into a number.
                // Since URL parameters are always returned as strings, this operator is a shorthand
                // way to ensure `id` is treated as a number for further processing (e.g., querying the database).
                // If the value of `req.params.id` cannot be converted to a number, the result will be NaN.
                id: +req.params.id 
            }, 
            data: product 
        })
        res.json(updatedProduct)

    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND); 
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: +req.params.id 
            }
        })
        res.json(deletedProduct); 

    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const listProducts = async (req: Request, res: Response) => {
    // count needed for pagination
    const count = await prismaClient.product.count(); 

    // Safely handle the `skip` parameter 
    const skip = +req.params.query || 0; 

    const products = await prismaClient.product.findMany({
        skip: skip, 
        take: 5, 
    }); 
    res.json({
        count, 
        data: products
    }); 
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const products = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id 
            }
        })
        res.json(products)

    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND); 
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const products = await prismaClient.product.findMany({
        where: {
            name: {
                search: req.query.q?.toString() 
            }, 
            description: {
                search:req.query.q?.toString()
            }, 
            tags: {
                search: req.query.q?.toString()
            }
        }
    })
    res.json(products)
    
}