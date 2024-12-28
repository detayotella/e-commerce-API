"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const unauthorizedException_1 = require("../exceptions/unauthorizedException");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Parse and validate the request data 
    const validatedData = cart_1.CreateCartSchema.parse(req.body);
    // Ensure the user is authenticated 
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new notFound_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    // Fetch the product to ensure it exists 
    let product;
    try {
        product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    }
    catch (error) {
        throw new notFound_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    // Check if the same product alreadly exist in the user's cart 
    const existingCartItem = yield __1.prismaClient.cartItem.findFirstOrThrow({
        where: {
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            productId: product.id
        }
    });
    let cartItem;
    if (existingCartItem) {
        // If the product exists in the cart, update its quantity 
        cartItem = yield __1.prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + validatedData.quantity, // Increment quantity
            },
        });
    }
    else {
        // If the product doesn't exists in the cart, create 
        // a new entry 
        cartItem = yield __1.prismaClient.cartItem.create({
            data: {
                userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                productId: product.id,
                quantity: validatedData.quantity,
            }
        });
    }
    res.json(cartItem);
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Extract the user ID from the request 
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Validate that the user is authenticated 
    if (!userId) {
        throw new notFound_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    // Fetch the cart item to validate ownership 
    const cartItem = yield __1.prismaClient.cartItem.findUniqueOrThrow({
        where: {
            id: +req.params.id
        }
    });
    if (!cartItem) {
        throw new notFound_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    // Check if the cart item belongs to the logged-in user 
    if (cartItem.userId !== userId) {
        throw new unauthorizedException_1.UnauthorizedException("You are not allowed to delete this cart", root_1.ErrorCode.UNAUTHORIZED);
    }
    // Delete the cart item 
    yield __1.prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    });
    res.json({ success: true });
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new notFound_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    const cartItem = yield __1.prismaClient.cartItem.findUniqueOrThrow({
        where: {
            id: +req.params.id
        }
    });
    if (!cartItem) {
        throw new notFound_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    if (cartItem.userId !== userId) {
        throw new unauthorizedException_1.UnauthorizedException("You are not allowed to increase the item", root_1.ErrorCode.UNAUTHORIZED);
    }
    const validatedData = cart_1.ChangeQuantitySchema.parse(req.body);
    const updatedCart = yield __1.prismaClient.cartItem.update({
        where: {
            id: +req.params.id,
        },
        data: {
            quantity: validatedData.quantity
        }
    });
    res.json(updatedCart);
});
exports.changeQuantity = changeQuantity;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield __1.prismaClient.cartItem.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        },
        // include here will include the product as well
        include: {
            product: true
        }
    });
    res.json(cart);
});
exports.getCart = getCart;
