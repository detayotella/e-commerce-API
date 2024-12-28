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
exports.changeUserRole = exports.getUserById = exports.listUsers = exports.updateUser = exports.listAddress = exports.deleteAddress = exports.addAddress = void 0;
const users_1 = require("../schema/users");
const __1 = require("..");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const badRequests_1 = require("../exceptions/badRequests");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    users_1.AddressSchema.parse(req.body);
    const address = yield __1.prismaClient.address.create({
        data: Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
    });
    res.json(address);
});
exports.addAddress = addAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        throw new notFound_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
});
exports.deleteAddress = deleteAddress;
const listAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const addresses = yield __1.prismaClient.address.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.json(addresses);
});
exports.listAddress = listAddress;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const validatedData = users_1.UpdateUserSchema.parse(req.body);
    let shippingAddress;
    let billingAddress;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            });
        }
        catch (error) {
            throw new notFound_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (shippingAddress.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new badRequests_1.BadRequestsException("Address does not belong to user", root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });
        }
        catch (error) {
            throw new notFound_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new badRequests_1.BadRequestsException("Addresss does not belong to user", root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    const updateUser = yield __1.prismaClient.user.update({
        where: {
            id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
        },
        data: Object.assign({}, req.body)
    });
    res.json(updateUser);
});
exports.updateUser = updateUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate 'skip' query parameter 
    const skip = req.query.skip ? +req.query.skip : 0;
    if (isNaN(skip) || skip < 0) {
        return res.status(400).json({
            message: "Invalid `skip` value. It should be non-negative number"
        });
    }
    const users = yield __1.prismaClient.user.findMany({
        skip: skip,
        take: 5
    });
    res.json(users);
});
exports.listUsers = listUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                address: true
            }
        });
        res.json(user);
    }
    catch (error) {
        throw new notFound_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.getUserById = getUserById;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.ChangeUserRoleSchema.parse(req.body);
    try {
        const user = yield __1.prismaClient.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: req.body.role
            }
        });
        res.json(user);
    }
    catch (_a) {
        throw new notFound_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.changeUserRole = changeUserRole;
