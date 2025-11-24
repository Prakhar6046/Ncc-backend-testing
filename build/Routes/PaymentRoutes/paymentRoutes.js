"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const payment_1 = __importDefault(require("../../controller/StripePayment/payment"));
const Paymentroutes = (0, express_1.default)();
Paymentroutes.post("/order-payment", passport_1.default.authenticate("jwt", { session: false }), payment_1.default);
exports.default = Paymentroutes;
