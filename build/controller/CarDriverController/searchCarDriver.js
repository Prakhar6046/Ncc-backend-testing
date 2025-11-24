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
const adminHelper_1 = require("../../utils/adminHelper");
const SearchCarDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const carType = req.params.carType;
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Build query
        const query = {
            adminUserId: effectiveAdminUserId,
            cityOfService: adminInfo.cityId,
        };
        // Add carType filter if provided
        if (carType) {
            query.carType = carType;
        }
        // Fetch all car drivers for the effective admin (filtered by city and carType)
        const allCarDrivers = yield CarDriver_1.CarDriversModel.find(query);
        if (!allCarDrivers.length) {
            return (0, responseFun_1.sendSuccessResponse)(res, [], "No Car Drivers found for the specified city.");
        }
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, allCarDrivers, "All Car Driver Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting all car driver data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting all car driver data.");
    }
});
exports.default = SearchCarDriver;
