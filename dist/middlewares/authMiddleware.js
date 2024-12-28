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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthorizedException_1 = require("../exceptions/unauthorizedException");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. extract the token from header 
    const authHeaders = req.headers.authorization;
    const token = (authHeaders === null || authHeaders === void 0 ? void 0 : authHeaders.startsWith("Bearer "))
        ? authHeaders.substring(7)
        : authHeaders;
    // 2. If token is not present, throw an error of unauthorized 
    if (!token) {
        return next(new unauthorizedException_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    // Type assertion since we've checked for undefined 
    //const verifiedToken = token as string; 
    try {
        // 3. If the token is present, verify that token and extract the payload 
        const decodedToken = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET);
        // Type guard to enusre the payload has userId 
        if (!decodedToken || typeof decodedToken !== "object" || !("userId" in decodedToken)) {
            return next(new unauthorizedException_1.UnauthorizedException("Invalid token payload", root_1.ErrorCode.UNAUTHORIZED));
        }
        //const payload = decodedToken as CustomJWTPayload; 
        // 4. To get the user from the payload 
        const user = yield __1.prismaClient.user.findFirst({
            where: {
                id: decodedToken.userId
            }
        });
        if (!user) {
            return next(new unauthorizedException_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        // 5. To attach the user to the current request object
        // Type assertion to satisfy Typescript that user is not null
        req.user = user;
        next();
    }
    catch (error) {
        return next(new unauthorizedException_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
});
exports.default = authMiddleware;
