"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errrorHandlers_1 = require("../errrorHandlers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const cartController_1 = require("../controllers/cartController");
const cartRoutes = (0, express_1.Router)();
cartRoutes.post("/", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(cartController_1.addItemToCart));
cartRoutes.get("/", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(cartController_1.getCart));
cartRoutes.delete("/:id", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(cartController_1.deleteItemFromCart));
cartRoutes.put("/:id", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(cartController_1.changeQuantity));
exports.default = cartRoutes;
