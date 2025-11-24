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
const firebase_1 = require("../../middleware/firebase/firebase");
const rejectDriverEmail_1 = __importDefault(require("../../middleware/email/rejectDriverEmail"));
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const RejectOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Authentication check
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. Please log in.");
        }
        const driverId = req.user._id;
        const { orderId } = req.body;
        // Input validation
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
        // // Fetch route information
        // const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(
        //   orderDetails.selectedRouteId
        // );
        // Fetch company  information
        const companyInfo = yield CompanyModel_1.CompanyModel.findOne({
            _id: orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.companyId,
        });
        if (!companyInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "Client Info does not Found");
        }
        // Reject the order by updating the database
        yield NccBooking_1.NccBookingModel.updateOne({ _id: orderId }, {
            $set: {
                driverAccept: false,
                driverId: "",
                driverName: "",
                driveAcceptDate: null,
            },
        });
        // // Fetch driver business info
        // const businessInfo: DriverBusinessInfo | null =
        //   await DriverBusinessModel.findOne({ driverId });
        // if (!businessInfo) {
        //   return sendErrorResponse(res, 404, "Driver business info not found.");
        // }
        // // Update existing business info
        // const updatedBusinessInfo = {
        //   totalProfit: businessInfo.totalProfit - orderDetails.totalPrice,
        //   earningsPerPeriod:
        //     businessInfo.earningsPerPeriod - orderDetails.totalPrice,
        //   dailyAverage: Math.max(
        //     0,
        //     businessInfo.dailyAverage - orderDetails.totalPrice
        //   ),
        //   totalRuns: Math.max(0, businessInfo.totalRuns - 1),
        //   totalRunsPerDay: Math.max(0, businessInfo.totalRunsPerDay - 1),
        //   averageEarningsPerRide:
        //     businessInfo.totalRunsPerDay > 1
        //       ? (businessInfo.dailyAverage - orderDetails.totalPrice) /
        //       (businessInfo.totalRunsPerDay - 1)
        //       : 0,
        //   timeTravel: Math.max(
        //     0,
        //     businessInfo.timeTravel - routeInfo.averageTravelTime
        //   ),
        // };
        // await DriverBusinessModel.updateOne(
        //   { driverId },
        //   { $set: updatedBusinessInfo }
        // );
        const drivers = yield CarDriver_1.CarDriversModel.find({
            cityOfService: driverInfo.cityOfService,
            isActive: true,
        });
        if (!drivers || drivers.length === 0) {
            console.warn("No active drivers found in the city.");
        }
        else {
            // Map to extract FCM tokens
            const fcmTokens = drivers
                .map((driver) => driver.fmcToken)
                .filter((token) => Boolean(token)); // Ensure non-null, non-undefined values
            if (fcmTokens.length > 0) {
                const notificationPayload = {
                    notification: {
                        title: "Nuova corsa da Neth",
                        body: `Hai una corsa in attesa. Visualizza le informazioni e accetta la richiesta.`,
                    },
                    data: {
                        bookingId: orderDetails._id.toString(),
                        orderNumber: orderDetails.orderNumber.toString(),
                        city: orderDetails.city,
                    },
                };
                // Use sendMulticast for multiple tokens
                const response = yield firebase_1.firebaseAdmin.messaging().sendEachForMulticast(Object.assign({ tokens: fcmTokens }, notificationPayload));
                console.log(`Notifications sent successfully: ${response.successCount} successful, ${response.failureCount} failed.`);
                if (response.failureCount > 0) {
                    console.warn("Failed to send notifications to some devices:", response.responses
                        .filter((r) => !r.success)
                        .map((r) => r.error));
                }
            }
            else {
                console.warn("No FCM tokens found for drivers in the city.");
            }
        }
        // Send success response
        yield (0, rejectDriverEmail_1.default)(companyInfo.email, res);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Order successfully rejected.");
    }
    catch (error) {
        console.error("Error rejecting order:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while rejecting the order. Please try again later.");
    }
});
exports.default = RejectOrder;
