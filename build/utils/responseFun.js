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
exports.getToken = exports.sendSuccessWithoutResponse = exports.sendSuccessResponse = exports.sendErrorResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const translateService_1 = __importDefault(require("./translateService"));
require("dotenv").config();
const sendErrorResponse = (res, statusCode, message) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedMessage = yield (0, translateService_1.default)(message);
    return res.status(statusCode).json({
        status: false,
        message: translatedMessage,
    });
});
exports.sendErrorResponse = sendErrorResponse;
const sendSuccessResponse = (res, data, message) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedMessage = yield (0, translateService_1.default)(message);
    return res.status(200).json({
        status: true,
        data: data,
        message: translatedMessage,
    });
});
exports.sendSuccessResponse = sendSuccessResponse;
const sendSuccessWithoutResponse = (res, message) => __awaiter(void 0, void 0, void 0, function* () {
    const translatedMessage = yield (0, translateService_1.default)(message);
    return res.status(200).json({
        status: true,
        message: translatedMessage,
    });
});
exports.sendSuccessWithoutResponse = sendSuccessWithoutResponse;
const getToken = (email, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const token = jsonwebtoken_1.default.sign({ identifier: user._id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
    });
    return token;
});
exports.getToken = getToken;
