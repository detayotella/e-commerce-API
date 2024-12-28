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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const badRequests_1 = require("../exceptions/badRequests");
const root_1 = require("../exceptions/root");
const users_1 = require("../schema/users");
const notFound_1 = require("../exceptions/notFound");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the incoming request body using the SignupSchema.
    // The `parse` method ensures that the request body conforms to the expected schema,
    // throwing an error if validation fails. This helps enforce proper data structure
    // and sanitization before proceeding further.
    // Validate request body
    users_1.SignupSchema.parse(req.body);
    const { email, password, name } = req.body;
    let user = yield __1.prismaClient.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        new badRequests_1.BadRequestsException("User already exists!", root_1.ErrorCode.USER_ALREADY_EXISTS);
    }
    ;
    user = yield __1.prismaClient.user.create({
        data: {
            name,
            email,
            password: (0, bcrypt_1.hashSync)(password, 10)
        }
    });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    res.status(201).json(userWithoutPassword);
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new notFound_1.NotFoundException("User not found.", root_1.ErrorCode.USER_NOT_FOUND);
    }
    if (!(0, bcrypt_1.compareSync)(password, user.password)) {
        throw new badRequests_1.BadRequestsException("Incorrect password", root_1.ErrorCode.INCORRECT_PASSWORD);
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id
    }, secrets_1.JWT_SECRET);
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    res.json({ user: userWithoutPassword, token });
});
exports.login = login;
// /me -> return the logged in user 
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new badRequests_1.BadRequestsException("User not authenticated", root_1.ErrorCode.UNAUTHORIZED));
        }
        const _a = req.user, { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        res.json(userWithoutPassword);
    }
    catch (error) {
        next(error);
    }
});
exports.me = me;
