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
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const GetCityRequestService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated and has a valid ID
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const DriverId = req.user._id;
        const DriverInfo = yield CarDriver_1.CarDriversModel.findById(DriverId);
        // Validate required fields
        if (!DriverInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required fields. City info not found");
        }
        // Fetch all service requests for the authenticated user
        const allServiceRequests = yield NccBooking_1.NccBookingModel.find({
            city: DriverInfo.cityOfService,
            driverAccept: false,
        }).sort({ createdAt: -1 });
        if (!allServiceRequests || allServiceRequests.length === 0) {
            return (0, responseFun_1.sendSuccessResponse)(res, allServiceRequests, "No service request found.");
        }
        // Return all service requests if found
        return (0, responseFun_1.sendSuccessResponse)(res, allServiceRequests, "All service requests retrieved successfully.");
    }
    catch (error) {
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while retrieving service requests.");
    }
});
exports.default = GetCityRequestService;
