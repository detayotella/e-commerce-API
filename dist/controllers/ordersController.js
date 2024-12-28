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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.getOrderById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const __1 = require("..");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. To create a transaction
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        // 2. To list all the cart items and proceed if the cart
        // is not empty 
        const cartItems = yield tx.cartItem.findMany({
            where: {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            },
            include: {
                product: true
            }
        });
        if (cartItems.length === 0) {
            return res.json({ message: "Cart is empty" });
        }
        // 3. Calculate the total amount 
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price);
        }, 0);
        // if (!req.user?.id) {
        //     throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND); 
        // }
        // 4. Fetch address of user
        if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.defaultShippingAddress)) {
            throw new notFound_1.NotFoundException("Shipping address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        const address = yield tx.address.findFirst({
            where: {
                id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.defaultShippingAddress
            }
        });
        // 5. To define computed field for formatted address
        // on address module: code in index.src($extends)
        // 6. We will create a order and order products productsorder products
        if (!(address === null || address === void 0 ? void 0 : address.formattedAddress)) {
            throw new notFound_1.NotFoundException("Address is missing or invalid", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        const order = yield tx.order.create({
            data: {
                userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
                netAmount: price,
                address: address === null || address === void 0 ? void 0 : address.formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        };
                    })
                }
            }
        });
        // 7. Create event  
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        });
        // 8. To empty the cart 
        yield tx.cartItem.deleteMany({
            where: {
                userId: (_e = req.user) === null || _e === void 0 ? void 0 : _e.id
            }
        });
        return res.json(order);
    }), { timeout: 10000 }); // Set the timeout to 10 secs 
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orders = yield __1.prismaClient.order.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.json(orders);
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. wrap it inside transaction 
    // 2. Check if the user is cancelling its own order 
    try {
        const order = yield __1.prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: "CANCELLED"
            }
        });
        yield __1.prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: "CANCELLED"
            }
        });
    }
    catch (error) {
        throw new notFound_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        });
        res.json(order);
    }
    catch (err) {
        throw new notFound_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.getOrderById = getOrderById;
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {};
    const status = req.params.status;
    if (status) {
        whereClause = {
            status
        };
    }
    const skip = req.query.skip ? +req.query.skip : 0;
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip: skip,
        take: 5
    });
    res.json(orders);
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        });
        yield __1.prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        });
        res.json(order);
    }
    catch (err) {
        throw new notFound_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {
        userId: +req.params.id
    };
    const status = req.params.status;
    if (status) {
        whereClause = Object.assign(Object.assign({}, whereClause), { status });
    }
    const skip = req.query.skip ? +req.query.skip : 0;
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip: skip,
        take: 5
    });
    res.json(orders);
});
exports.listUserOrders = listUserOrders;
