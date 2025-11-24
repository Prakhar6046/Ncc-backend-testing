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
const responseFun_1 = require("../../utils/responseFun");
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const VerifyPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        const { orderId, pin } = req.body;
        // Validate input
        if (!orderId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Order ID is required.");
        }
        if (!pin) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "PIN is required.");
        }
        // Fetch order details
        const orderDetails = yield NccBooking_1.NccBookingModel.findById(orderId);
        if (!orderDetails) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Order not found.");
        }
        // Check if PIN matches
        if (orderDetails.securityPin !== pin) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Invalid PIN. Please check and try again.");
        }
        // Update order to mark PIN as verified
        yield NccBooking_1.NccBookingModel.updateOne({ _id: orderId }, {
            $set: {
                pinVerified: true,
            },
        });
        return (0, responseFun_1.sendSuccessResponse)(res, { verified: true }, "PIN verified successfully.");
    }
    catch (error) {
        console.error("Error while verifying PIN:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while verifying the PIN.");
    }
});
exports.default = VerifyPin;
