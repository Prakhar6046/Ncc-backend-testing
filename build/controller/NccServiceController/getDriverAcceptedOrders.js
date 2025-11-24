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
const GetAllDriverAcceptedOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for authenticated user
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        const driverId = req.user._id;
        // Fetch all accepted orders for the driver
        const acceptedOrders = yield NccBooking_1.NccBookingModel.find({ driverId, driverAccept: true }).sort({ driveAcceptDate: -1 });
        // Return appropriate response
        if (!acceptedOrders || acceptedOrders.length === 0) {
            return (0, responseFun_1.sendSuccessResponse)(res, [], "No accepted orders found.");
        }
        return (0, responseFun_1.sendSuccessResponse)(res, acceptedOrders, "Accepted orders retrieved successfully.");
    }
    catch (error) {
        console.error("Error retrieving accepted orders:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching accepted orders.");
    }
});
exports.default = GetAllDriverAcceptedOrder;
