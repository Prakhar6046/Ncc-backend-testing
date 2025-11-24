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
const GetSingleAcceptedOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User authentication failed. Please log in to continue.");
        }
        const acceptedOrderId = req.params.acceptedOrderId;
        // Validate the provided orderId
        if (!acceptedOrderId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Order ID is required to fetch the order details.");
        }
        // Fetch the order details
        const singleOrder = yield NccBooking_1.NccBookingModel.findOne({ _id: acceptedOrderId });
        if (!singleOrder) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, `No order found with ID: ${acceptedOrderId}. Please check and try again.`);
        }
        // Return the order details if found
        return (0, responseFun_1.sendSuccessResponse)(res, singleOrder, "Order details retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching single order:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An unexpected error occurred while retrieving the order details. Please try again later.");
    }
});
exports.default = GetSingleAcceptedOrder;
