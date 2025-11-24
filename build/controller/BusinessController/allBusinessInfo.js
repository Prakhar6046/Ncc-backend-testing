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
const businessModel_1 = require("../../models/BusinessModel/businessModel");
const Admin_1 = require("../../models/AdminModel/Admin");
const cityBusinessModel_1 = require("../../models/BusinessModel/cityBusinessModel");
const adminHelper_1 = require("../../utils/adminHelper");
const GetBusinessInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Check if admin exists (using effective admin)
        const adminExists = yield Admin_1.AdminModel.findById(effectiveAdminUserId);
        if (!adminExists) {
            return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Admin info not found");
        }
        let businessInfo;
        // Fetch city routes: filter by adminUserId if user is an admin, otherwise fetch all routes
        if (adminExists === null || adminExists === void 0 ? void 0 : adminExists.superAdmin) {
            businessInfo = yield businessModel_1.BusinessModel.findOne({});
            return (0, responseFun_1.sendSuccessResponse)(res, businessInfo, "Business information retrieved successfully");
        }
        // Fetch the business info from the database using effective admin's city
        businessInfo = yield cityBusinessModel_1.CityBusinessModel.findOne({ city: adminInfo.cityId });
        // If no data is found, return an empty array with a success response
        if (!businessInfo) {
            return (0, responseFun_1.sendSuccessResponse)(res, {}, "No business information found");
        }
        // Return the fetched data with a success response
        return (0, responseFun_1.sendSuccessResponse)(res, businessInfo, "Business information retrieved successfully");
    }
    catch (error) {
        // Log the error for debugging
        console.error("Error fetching business info:", error);
        // Return a 500 Internal Server Error response
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while retrieving business information");
    }
});
exports.default = GetBusinessInfo;
