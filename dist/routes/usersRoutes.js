"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const errrorHandlers_1 = require("../errrorHandlers");
const usersControllers_1 = require("../controllers/usersControllers");
const usersRoutes = (0, express_1.Router)();
usersRoutes.post("/address", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.addAddress));
usersRoutes.delete("/address/:id", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.deleteAddress));
usersRoutes.get("/address", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.listAddress));
usersRoutes.put("/", [authMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.updateUser));
usersRoutes.put("/:id/role", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.changeUserRole));
usersRoutes.get("/", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.listUsers));
usersRoutes.get("/:id", [authMiddleware_1.default, adminMiddleware_1.default], (0, errrorHandlers_1.errorHandler)(usersControllers_1.getUserById));
exports.default = usersRoutes;
