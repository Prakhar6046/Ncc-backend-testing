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
const adminHelper_1 = require("../../utils/adminHelper");
const AllOrderBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Fetch all order bookings based on the effective admin's city
        const allOrderBookings = yield NccBooking_1.NccBookingModel.find({ city: adminInfo.cityId });
        // Send success response with booking data
        return (0, responseFun_1.sendSuccessResponse)(res, allOrderBookings, "All booking orders retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching all booking orders:", error);
        return (0, responseFun_1.sendErrorResponse)(res, error.message === "Admin user not found." ? 404 : 500, error.message || "An error occurred while retrieving booking orders.");
    }
});
exports.default = AllOrderBooking;
