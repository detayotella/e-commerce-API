"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productsRoutes_1 = __importDefault(require("./productsRoutes"));
const usersRoutes_1 = __importDefault(require("./usersRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const router = (0, express_1.Router)();
router.use("/auth", authRoutes_1.default);
router.use("/products", productsRoutes_1.default);
router.use("/users", usersRoutes_1.default);
router.use("/carts", cartRoutes_1.default);
router.use("/orders", orderRoutes_1.default);
exports.default = router;
