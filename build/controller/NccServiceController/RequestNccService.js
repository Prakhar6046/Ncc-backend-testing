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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const CityRoute_1 = require("../../models/CityRouteModel/CityRoute");
const businessFunction_1 = __importDefault(require("../../middleware/BusinessFunction/businessFunction"));
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const firebase_1 = require("../../middleware/firebase/firebase");
const sendSecurityPinEmail_1 = __importDefault(require("../../middleware/email/sendSecurityPinEmail"));
const requestService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedRouteId, preferVehicel, clientName, telePhone, customerEmail, isReverse, noOfPassengers, appointmentTime, appointmentDate, usefulInformation, customFrom, customPrice, customTo, customDriver, customTime, } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Unauthorized: User is not authenticated.");
        }
        const userId = req.user._id;
        // Check if the user's associated company exists
        const existingCompany = yield CompanyModel_1.CompanyModel.findById(userId);
        if (!existingCompany) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "Account not found for the user.");
        }
        // Fetch route information
        const routeInfo = yield CityRoute_1.CityRouteModel.findById(selectedRouteId);
        const userOrderCount = yield NccBooking_1.NccBookingModel.countDocuments({
            companyId: userId,
        });
        const cityOrderCount = yield NccBooking_1.NccBookingModel.countDocuments({
            city: existingCompany.city,
        });
        const hotelOrderCount = yield NccBooking_1.NccBookingModel.countDocuments({
            companyId: userId,
        });
        const fromLocation = routeInfo
            ? {
                value: routeInfo.from,
                lat: null,
                long: null,
                description: null,
            }
            : {
                value: (customFrom === null || customFrom === void 0 ? void 0 : customFrom.description) || "",
                lat: (customFrom === null || customFrom === void 0 ? void 0 : customFrom.lat) || null,
                long: (customFrom === null || customFrom === void 0 ? void 0 : customFrom.lng) || null,
                description: (customFrom === null || customFrom === void 0 ? void 0 : customFrom.description) || "",
            };
        const toLocation = routeInfo
            ? {
                value: routeInfo.to,
                lat: null,
                long: null,
                description: null,
            }
            : {
                value: (customTo === null || customTo === void 0 ? void 0 : customTo.description) || "",
                lat: (customTo === null || customTo === void 0 ? void 0 : customTo.lat) || null,
                long: (customTo === null || customTo === void 0 ? void 0 : customTo.lng) || null,
                description: (customTo === null || customTo === void 0 ? void 0 : customTo.description) || "",
            };
        // Generate unique 6-digit PIN
        const securityPin = Math.floor(100000 + Math.random() * 900000).toString();
        // Prepare booking request data
        const newBookingRequest = {
            companyId: userId,
            orderNumber: userOrderCount + 1,
            cityOrderNumber: cityOrderCount + 1,
            hotelOrderNumber: hotelOrderCount + 1,
            selectedRouteId,
            from: fromLocation.value,
            fromLat: fromLocation.lat,
            fromLong: fromLocation.long,
            fromDescription: fromLocation.description,
            to: toLocation.value,
            toLat: toLocation.lat,
            toLong: toLocation.long,
            toDescription: toLocation.description,
            totalPrice: routeInfo ? routeInfo.totalPrice : customPrice,
            isReverse: isReverse ? isReverse : false,
            preferVehicel,
            clientName,
            telePhone,
            customerEmail,
            securityPin,
            noOfPassengers,
            appointmentTime,
            appointmentDate,
            usefulInformation,
            city: existingCompany.city,
            address: existingCompany.address,
            driverCost: routeInfo ? routeInfo.driverCost : customDriver,
            averageTravelTime: routeInfo
                ? routeInfo.averageTravelTime.toString()
                : customTime,
        };
        // Save booking requests to the database
        const BookingInfo = yield NccBooking_1.NccBookingModel.create(newBookingRequest);
        // Send security PIN email to customer
        yield (0, sendSecurityPinEmail_1.default)(customerEmail, securityPin, clientName, BookingInfo.orderNumber, res);
        // Business data update
        yield (0, businessFunction_1.default)(routeInfo ? routeInfo.totalPrice : customPrice, routeInfo ? routeInfo.averageTravelTime : customTime, existingCompany.city);
        // Retrieve drivers in the same city based on preferVehicel
        let driverQuery = {
            cityOfService: existingCompany.city,
            isActive: true,
        };
        if (preferVehicel === 6) {
            // Send to only drivers having carType 6
            driverQuery.carType = 6;
        }
        // else for preferVehicel === 4, send to all cars, so no need to add carType filter
        const drivers = yield CarDriver_1.CarDriversModel.find(driverQuery);
        if (!drivers || drivers.length === 0) {
            console.warn("No active drivers found in the city.");
        }
        else {
            // Map to extract FCM tokens
            const fcmTokens = drivers
                .map((driver) => driver.fmcToken)
                .filter((token) => Boolean(token));
            if (fcmTokens.length > 0) {
                const notificationPayload = {
                    notification: {
                        title: "Nuova corsa da Neth",
                        body: `Hai una corsa in attesa. Visualizza le informazioni e accetta la richiesta.`,
                    },
                    data: {
                        bookingId: BookingInfo._id.toString(),
                        orderNumber: newBookingRequest.orderNumber.toString(),
                        city: existingCompany.city,
                    },
                };
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
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Booking request created successfully.");
    }
    catch (error) {
        console.error("Error while creating booking request:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Server error: Unable to process the booking request at this time.");
    }
});
exports.default = requestService;
