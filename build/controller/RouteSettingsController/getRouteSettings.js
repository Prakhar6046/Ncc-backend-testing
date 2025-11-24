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
const Admin_1 = require("../../models/AdminModel/Admin");
const getRouteSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const adminUserId = req.user._id;
        const adminInfo = yield Admin_1.AdminModel.findById(adminUserId);
        // Check if admin info exists
        if (!adminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        // Only Admin can access route settings
        if (adminInfo.userType !== "admin" && !adminInfo.superAdmin) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Only Admin can access route settings.");
        }
        // Fetch route settings
        const routeSettings = yield RouteSettings_1.RouteSettingsModel.findOne({ adminUserId });
        if (!routeSettings) {
            return (0, responseFun_1.sendSuccessResponse)(res, { kmRanges: [] }, "No route settings found. Default empty settings returned.");
        }
        return (0, responseFun_1.sendSuccessResponse)(res, routeSettings, "Route settings retrieved successfully.");
    }
    catch (error) {
        console.error("Error getting route settings:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while getting route settings.");
    }
});
exports.default = getRouteSettings;
