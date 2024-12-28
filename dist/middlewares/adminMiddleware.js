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
exports.adminMiddleware = void 0;
const unauthorizedException_1 = require("../exceptions/unauthorizedException");
const root_1 = require("../exceptions/root");
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        // Handle the case where the user is undefined 
        return next(new unauthorizedException_1.UnauthorizedException("User not authenticated", root_1.ErrorCode.UNAUTHORIZED));
    }
    if (user.role === "ADMIN") {
        next();
    }
    else {
        return next(new unauthorizedException_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    ;
});
exports.adminMiddleware = adminMiddleware;
exports.default = exports.adminMiddleware;
