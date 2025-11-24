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
const AdminSettingModel_1 = require("../../models/AdminSettingModel/AdminSettingModel");
const UpsertAdminSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mileageBands } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Validate mileageBands structure
        if (!mileageBands || !Array.isArray(mileageBands) || mileageBands.length === 0) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "At least one mileage band is required.");
        }
        // Validate each mileage band
        for (const band of mileageBands) {
            if (typeof band.kmMin !== "number" || band.kmMin < 0) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Each mileage band must have a valid kmMin value (>= 0).");
            }
            if (!band.kmMax || typeof band.kmMax !== "number") {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Each mileage band must have a valid kmMax value.");
            }
            if (band.kmMin >= band.kmMax) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "kmMin must be less than kmMax for each mileage band.");
            }
            if (!band.vehicleTypes) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Each mileage band must have vehicleTypes.");
            }
            const vehicleTypes = ["berlina", "van", "lusso"];
            const roles = ["admin", "cooperative", "driver", "ditta_individuale"];
            for (const vehicleType of vehicleTypes) {
                if (!band.vehicleTypes[vehicleType]) {
                    return (0, responseFun_1.sendErrorResponse)(res, 400, `Each mileage band must have ${vehicleType} vehicle type.`);
                }
                for (const role of roles) {
                    if (!band.vehicleTypes[vehicleType][role]) {
                        return (0, responseFun_1.sendErrorResponse)(res, 400, `Each vehicle type must have ${role} role costs.`);
                    }
                    if (typeof band.vehicleTypes[vehicleType][role].fixedCost !== "number" ||
                        typeof band.vehicleTypes[vehicleType][role].costPerKm !== "number") {
                        return (0, responseFun_1.sendErrorResponse)(res, 400, `Invalid cost values for ${vehicleType} - ${role}.`);
                    }
                }
            }
        }
        const adminUserId = req.user._id.toString();
        // Prepare the settings data
        const settingsData = {
            adminUserId,
            mileageBands,
        };
        // Check if settings already exist
        const existingSettings = yield AdminSettingModel_1.AdminSettings.findOne({ adminUserId });
        if (existingSettings) {
            // Update existing settings
            yield AdminSettingModel_1.AdminSettings.updateOne({ adminUserId }, settingsData);
            return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Admin settings updated successfully.");
        }
        else {
            // Create new settings
            yield AdminSettingModel_1.AdminSettings.create(settingsData);
            return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Admin settings created successfully.");
        }
    }
    catch (error) {
        console.error("Error in Admin Settings upsert:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while processing admin settings.");
    }
});
exports.default = UpsertAdminSetting;
