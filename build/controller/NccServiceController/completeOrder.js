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
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const driverBusiness_1 = require("../../models/DriverBusinessModel/driverBusiness");
const CityRoute_1 = require("../../models/CityRouteModel/CityRoute");
const CompleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        const driverId = req.user._id;
        const { orderId } = req.body;
        // Validate input
        if (!orderId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Order ID is required.");
        }
        // Fetch driver information
        const driverInfo = yield CarDriver_1.CarDriversModel.findById(driverId);
        if (!driverInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Driver not found.");
        }
        // Fetch order details
        const orderDetails = yield NccBooking_1.NccBookingModel.findById(orderId);
        if (!orderDetails) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Order not found.");
        }
        // Fetch driver business information
        const businessInfo = yield driverBusiness_1.DriverBusinessModel.findOne({ driverId });
        // Fetch route information
        const routeInfo = yield CityRoute_1.CityRouteModel.findById(orderDetails.selectedRouteId);
        // Update the order to mark it as accepted
        yield NccBooking_1.NccBookingModel.updateOne({ _id: orderId }, {
            $set: {
                completeOrder: true,
                carModel: driverInfo === null || driverInfo === void 0 ? void 0 : driverInfo.carModel
            },
        });
        // Update or create driver business info
        if (!businessInfo) {
            const newBusinessInfo = {
                driverId,
                totalProfit: orderDetails.driverCost,
                earningsPerPeriod: orderDetails.driverCost,
                dailyAverage: orderDetails.driverCost,
                totalRuns: 1,
                totalRunsPerDay: 1,
                averageEarningsPerRide: orderDetails.driverCost,
                timeTravel: routeInfo ? routeInfo.averageTravelTime : orderDetails.averageTravelTime,
            };
            yield driverBusiness_1.DriverBusinessModel.create(newBusinessInfo);
        }
        else {
            const updatedBusinessInfo = {
                totalProfit: businessInfo.totalProfit + orderDetails.driverCost,
                earningsPerPeriod: businessInfo.earningsPerPeriod + orderDetails.driverCost,
                dailyAverage: businessInfo.dailyAverage + orderDetails.driverCost,
                totalRuns: businessInfo.totalRuns + 1,
                totalRunsPerDay: businessInfo.totalRunsPerDay + 1,
                averageEarningsPerRide: (businessInfo.dailyAverage + orderDetails.driverCost) /
                    (businessInfo.totalRunsPerDay + 1),
                timeTravel: businessInfo.timeTravel + (routeInfo ? routeInfo.averageTravelTime : orderDetails.averageTravelTime),
            };
            yield driverBusiness_1.DriverBusinessModel.updateOne({ driverId }, { $set: updatedBusinessInfo });
        }
        // Send success response
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Order successfully completed.");
    }
    catch (error) {
        console.error("Error accepting order:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while completing the order. Please try again later.");
    }
});
exports.default = CompleteOrder;
