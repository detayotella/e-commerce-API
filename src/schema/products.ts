import { z } from "zod"; 

// Validating schema 
export const ProductsSchema = z.object({
    name: z.string(), 
    description: z.string(), 
    // Can use z.number() 
    price: z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = parseFloat(val); 
            return isNaN(parsed) ? undefined : parsed 
        }
        return val;
    }, z.number()), 
    tags: z.array(z.string())
})