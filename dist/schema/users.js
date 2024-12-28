"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUserRoleSchema = exports.UpdateUserSchema = exports.AddressSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Validating schema 
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string(),
    lineTwo: zod_1.z.string().nullable(),
    pincode: zod_1.z.string().length(6),
    country: zod_1.z.string(),
    city: zod_1.z.string()
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    defaultShippingAddress: zod_1.z.number().optional(),
    defaultBillingAddress: zod_1.z.number().optional()
});
exports.ChangeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum([client_1.Role.ADMIN, client_1.Role.USER])
});
