"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const index_1 = __importDefault(require("./routes/index"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", index_1.default);
// Initialize a new Prisma Client instance
exports.prismaClient = new client_1.PrismaClient({
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
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`;
                    // Combines the lineOne, lineTwo, city, country, and pincode fields into a single string
                    // Example Output: "123 Main St, Apt 4B, New York, USA-10001"
                }
            }
        }
    }
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, () => {
    console.log(`Server is running at PORT: ${3000}`);
});
