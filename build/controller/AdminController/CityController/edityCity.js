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
const responseFun_1 = require("../../../utils/responseFun");
const Admin_1 = require("../../../models/AdminModel/Admin");
const CityModel_1 = require("../../../models/CityModel/CityModel");
const EditCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityName, cityId } = req.body;
        // Validate request body
        if (!cityId || typeof cityId !== "string" || cityId.trim() === "") {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "City ID is required and must be a valid string.");
        }
        if (!cityName || typeof cityName !== "string" || cityName.trim() === "") {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "City name is required and must be a valid string.");
        }
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const superAdminId = req.user._id;
        const superAdminInfo = yield Admin_1.AdminModel.findById(superAdminId);
        // Check if admin info exists
        if (!superAdminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        // Ensure the user has super admin privileges
        if (!superAdminInfo.superAdmin) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "You do not have permission to edit a city.");
        }
        // Check if the city exists
        const cityToUpdate = yield CityModel_1.CityModel.findById(cityId);
        if (!cityToUpdate) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, `City with ID "${cityId}" not found.`);
        }
        // Check for duplicate city name
        const duplicateCity = yield CityModel_1.CityModel.findOne({ cityName: cityName.trim(), _id: { $ne: cityId } });
        if (duplicateCity) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, `City name "${cityName}" is already in use by another city.`);
        }
        // Update the city
        cityToUpdate.cityName = cityName.trim();
        yield cityToUpdate.save();
        // Respond with success
        return (0, responseFun_1.sendSuccessResponse)(res, cityToUpdate, `City "${cityName}" has been updated successfully.`);
    }
    catch (error) {
        console.error("Error during updating the city:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while updating the city.");
    }
});
exports.default = EditCity;
