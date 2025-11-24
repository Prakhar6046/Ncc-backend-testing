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
const responseFun_1 = require("../../utils/responseFun");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY);
const Payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { amount, currency } = req.body;
        if (!amount || !currency) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required parameters");
        }
        // Create a Checkout session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency, // Dynamic currency setting
                        product_data: {
                            name: "Your Product Name",
                        },
                        unit_amount: amount, // Dynamic amount based on the request
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${(_a = process.env.FRONTEND_BASEURL) === null || _a === void 0 ? void 0 : _a.trim()}/payment-success`,
            cancel_url: `${(_b = process.env.FRONTEND_BASEURL) === null || _b === void 0 ? void 0 : _b.trim()}/payment-failed`,
        });
        // Send session URL to redirect the customer
        return (0, responseFun_1.sendSuccessResponse)(res, session.url, "Checkout session created successfully");
    }
    catch (error) {
        console.error("Error during checkout session creation:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error during payment");
    }
});
exports.default = Payment;
