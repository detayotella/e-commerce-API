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
exports.errorHandler = void 0;
const root_1 = require("./exceptions/root");
const internalException_1 = require("./exceptions/internalException");
const zod_1 = require("zod");
const badRequests_1 = require("./exceptions/badRequests");
// A higher-order function for centralized error handling in Express applications.
// This function wraps an asynchronous method and ensures any errors are caught
// and passed to the next middleware (typically an error-handling middleware).
// It improves code maintainability by avoiding repetitive try-catch blocks in route handlers.
const errorHandler = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Execute the wrapped method, passing in the request, response, and next function.
            yield method(req, res, next); // The method (e.g., signup) is executed here
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.HttpException) {
                exception = error;
            }
            else {
                if (error instanceof zod_1.ZodError) {
                    exception = new badRequests_1.BadRequestsException("Unprocessable entity", root_1.ErrorCode.UNPROCESSIBLE_ENTITY, error);
                }
                else {
                    exception = new internalException_1.InternalException("Something went wrong", error, root_1.ErrorCode.INTERNAL_EXCEPTION);
                }
            }
            next(exception);
        }
    });
};
exports.errorHandler = errorHandler;
