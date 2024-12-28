"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errrorHandlers_1 = require("../errrorHandlers");
const productsController_1 = require("../controllers/productsController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const productRoutes = (0, express_1.Router)();
productRoutes.post("/", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.createProduct));
productRoutes.put("/:id", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.updateProduct));
productRoutes.delete("/:id", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.deleteProduct));
productRoutes.get("/", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.listProducts));
productRoutes.get("/search", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.searchProducts));
productRoutes.get("/:id", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(productsController_1.getProductById));
exports.default = productRoutes;
