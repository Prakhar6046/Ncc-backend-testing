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
exports.getSetting = void 0;
const responseFun_1 = require("../../utils/responseFun");
const Admin_1 = require("../../models/AdminModel/Admin");
const AdminSettingModel_1 = require("../../models/AdminSettingModel/AdminSettingModel");
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const adminHelper_1 = require("../../utils/adminHelper");
const SingleAdminSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Fetch admin settings for the effective admin
        const AdminSettingInfo = yield AdminSettingModel_1.AdminSettings.findOne({
            adminUserId: effectiveAdminUserId,
        });
        if (!AdminSettingInfo) {
            return (0, responseFun_1.sendSuccessResponse)(res, {}, "No Admin Settings found for the specified city.");
        }
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, AdminSettingInfo, "Admin Settings Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting  Admin Settings data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting  Admin Settings data.");
    }
});
const getSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const CustomerId = req.user._id;
        const customerInfo = yield CompanyModel_1.CompanyModel.findById(CustomerId);
        if (!customerInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Hotel Not found");
        }
        const adminInfo = yield Admin_1.AdminModel.findOne({ cityId: customerInfo === null || customerInfo === void 0 ? void 0 : customerInfo.city });
        // Check if admin info exists
        if (!adminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        // Fetch all car Models for the authenticated admin's city
        const AdminSettingInfo = yield AdminSettingModel_1.AdminSettings.findOne({
            adminUserId: adminInfo._id,
        });
        if (!AdminSettingInfo) {
            return (0, responseFun_1.sendSuccessResponse)(res, {}, "No Admin Settings found for the specified city.");
        }
        return (0, responseFun_1.sendSuccessResponse)(res, {
            admin: adminInfo,
            AdminSettingInfo,
        }, "Admin and settings retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting  Admin Settings data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting  Admin Settings data.");
    }
});
exports.getSetting = getSetting;
exports.default = SingleAdminSetting;
