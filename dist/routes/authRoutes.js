"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const errrorHandlers_1 = require("../errrorHandlers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
// errorHandler will return a function and that function
// will be a controller function 
router.post("/signup", (0, errrorHandlers_1.errorHandler)(authController_1.signup));
router.post("/login", (0, errrorHandlers_1.errorHandler)((authController_1.login)));
router.get("/me", authMiddleware_1.default, (0, errrorHandlers_1.errorHandler)(authController_1.me));
exports.default = router;
