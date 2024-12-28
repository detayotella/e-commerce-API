"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsSchema = void 0;
const zod_1 = require("zod");
// Validating schema 
exports.ProductsSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    // Can use z.number() 
    price: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? undefined : parsed;
        }
        return val;
    }, zod_1.z.number()),
    tags: zod_1.z.array(zod_1.z.string())
});
