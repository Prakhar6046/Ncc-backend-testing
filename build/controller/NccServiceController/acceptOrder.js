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
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const acceptDriverEmail_1 = __importDefault(require("../../middleware/email/acceptDriverEmail"));
const AcceptOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        const driverId = req.user._id;
        const { orderId, pin } = req.body;
        // Validate input
        if (!orderId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Order ID is required.");
        }
        if (!pin) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "PIN is required to accept the order.");
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
        // Check if the order is already accepted
        if (orderDetails.driverAccept) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "Order already accepted by another driver.");
        }
        // Verify PIN before accepting order
        if (!orderDetails.securityPin || orderDetails.securityPin !== pin) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Invalid PIN. Please check the PIN sent to the customer's email and try again.");
        }
        // Fetch company  information
        const companyInfo = yield CompanyModel_1.CompanyModel.findOne({ _id: orderDetails.companyId });
        if (!companyInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "Client Info does not Found");
        }
        // Fetch route information
        // const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(orderDetails.selectedRouteId);
        // Update the order to mark it as accepted and PIN verified
        yield NccBooking_1.NccBookingModel.updateOne({ _id: orderId }, {
            $set: {
                driverAccept: true,
                driverId,
                driverName: `${driverInfo.driverName} ${driverInfo.driverSurname}`,
                driveAcceptDate: Date.now(),
                pinVerified: true,
            },
        });
        // // Update or create driver business info
        // if (!businessInfo) {
        //   const newBusinessInfo = {
        //     driverId,
        //     totalProfit: orderDetails.totalPrice,
        //     earningsPerPeriod: orderDetails.totalPrice,
        //     dailyAverage: orderDetails.totalPrice,
        //     totalRuns: 1,
        //     totalRunsPerDay: 1,
        //     averageEarningsPerRide: orderDetails.totalPrice, 
        //     timeTravel: routeInfo.averageTravelTime,
        //   };
        //   await DriverBusinessModel.create(newBusinessInfo);
        // } else {
        //   const updatedBusinessInfo = {
        //     totalProfit: businessInfo.totalProfit + orderDetails.totalPrice,
        //     earningsPerPeriod: businessInfo.earningsPerPeriod + orderDetails.totalPrice,
        //     dailyAverage: businessInfo.dailyAverage + orderDetails.totalPrice,
        //     totalRuns: businessInfo.totalRuns + 1,
        //     totalRunsPerDay: businessInfo.totalRunsPerDay + 1,
        //     averageEarningsPerRide:
        //       (businessInfo.dailyAverage + orderDetails.totalPrice) /
        //       (businessInfo.totalRunsPerDay + 1),
        //     timeTravel: businessInfo.timeTravel + routeInfo.averageTravelTime,
        //   };
        //   await DriverBusinessModel.updateOne(
        //     { driverId },
        //     { $set: updatedBusinessInfo }
        //   );
        // }
        // Send success response
        yield (0, acceptDriverEmail_1.default)(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.email, driverInfo, res);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Order successfully accepted.");
    }
    catch (error) {
        console.error("Error accepting order:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while accepting the order. Please try again later.");
    }
});
exports.default = AcceptOrder;
