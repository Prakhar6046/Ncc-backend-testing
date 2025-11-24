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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const Admin_1 = require("../../models/AdminModel/Admin");
const adminHelper_1 = require("../../utils/adminHelper");
const GetAllHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminExists = yield Admin_1.AdminModel.findById(effectiveAdminUserId);
        if (adminExists === null || adminExists === void 0 ? void 0 : adminExists.superAdmin) {
            const allHotelsData = yield CompanyModel_1.CompanyModel.find({});
            return (0, responseFun_1.sendSuccessResponse)(res, allHotelsData, "All hotel data retrieved successfully.");
        }
        // Fetch hotels filtered by effective admin's city
        const cityRouteFilter = { city: adminInfo.cityId };
        // Fetch all hotel data
        const allHotels = yield CompanyModel_1.CompanyModel.find(cityRouteFilter);
        // Send response with the list of all hotels
        return (0, responseFun_1.sendSuccessResponse)(res, allHotels, "All hotel data retrieved successfully.");
    }
    catch (error) {
        console.error("Error while retrieving all hotel details:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while retrieving hotel details.");
    }
});
exports.default = GetAllHotels;
