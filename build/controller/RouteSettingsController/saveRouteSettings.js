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
const RouteSettings_1 = require("../../models/RouteSettingsModel/RouteSettings");
const saveRouteSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { kmRanges } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        const adminUserId = req.user._id;
        // Validate kmRanges structure
        if (!Array.isArray(kmRanges) || kmRanges.length === 0) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "kmRanges must be a non-empty array.");
        }
        // Validate each km range
        for (const range of kmRanges) {
            if (!range.maxKm || typeof range.maxKm !== "number") {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Each km range must have a valid maxKm value.");
            }
            if (!Array.isArray(range.pricing) || range.pricing.length === 0) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Each km range must have pricing configurations.");
            }
            for (const price of range.pricing) {
                if (!["Berlina", "Van", "Lusso"].includes(price.vehicleType)) {
                    return (0, responseFun_1.sendErrorResponse)(res, 400, "Vehicle type must be Berlina, Van, or Lusso.");
                }
                if (typeof price.adminFixed !== "number" ||
                    typeof price.adminPerKm !== "number" ||
                    typeof price.cooperativaFixed !== "number" ||
                    typeof price.cooperativaPerKm !== "number" ||
                    typeof price.driverFixed !== "number" ||
                    typeof price.driverPerKm !== "number") {
                    return (0, responseFun_1.sendErrorResponse)(res, 400, "All pricing values must be numbers.");
                }
            }
        }
        // Check if settings already exist
        const existingSettings = yield RouteSettings_1.RouteSettingsModel.findOne({ adminUserId });
        const settingsData = {
            adminUserId,
            kmRanges,
        };
        if (existingSettings) {
            // Update existing settings
            yield RouteSettings_1.RouteSettingsModel.updateOne({ adminUserId }, { $set: settingsData });
            return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Route settings updated successfully.");
        }
        else {
            // Create new settings
            const newSettings = yield RouteSettings_1.RouteSettingsModel.create(settingsData);
            return (0, responseFun_1.sendSuccessResponse)(res, newSettings, "Route settings created successfully.");
        }
    }
    catch (error) {
        console.error("Error saving route settings:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while saving route settings.");
    }
});
exports.default = saveRouteSettings;
