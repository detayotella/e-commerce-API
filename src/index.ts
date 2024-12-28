import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes/index";
import { PrismaClient } from "@prisma/client"; 
import { errorMiddleware } from "./middlewares/errors";
import { AddressSchema, SignupSchema } from "./schema/users";

const app: Express = express(); 

app.use(express.json()); 
 
app.use("/api", rootRouter); 


// Initialize a new Prisma Client instance
export const prismaClient = new PrismaClient({
    log: ["query"], 
    // Enables logging of all executed queries in the console for debugging and monitoring purposes.
})

// Extend Prisma Client with additional computed fields
.$extends({
    result: {
        address: { 
            // Define extensions for the "address" model
            formattedAddress: { 
                // Add a computed field called "formattedAddress" to the "address" model
                needs: { 
                    // Specify which fields are required to compute this formattedAddress
                    lineOne: true, 
                    lineTwo: true, 
                    city: true, 
                    country: true, 
                    pincode: true 
                }, 
                compute: (addr) => { 
                    // Define the logic to compute the formatted address
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                    // Combines the lineOne, lineTwo, city, country, and pincode fields into a single string
                    // Example Output: "123 Main St, Apt 4B, New York, USA-10001"
                }
            }
        }
    }
})


app.use(errorMiddleware); 

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${3000}`); 
});