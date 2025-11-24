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
const CityRoute_1 = require("../../models/CityRouteModel/CityRoute");
const Admin_1 = require("../../models/AdminModel/Admin");
const getAllCityRoutes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify user authentication
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Unauthorized access: User is not authenticated.");
        }
        const adminUserId = req.user._id;
        const adminExists = yield Admin_1.AdminModel.exists({ _id: adminUserId });
        // Fetch city routes: filter by adminUserId if user is an admin, otherwise fetch all routes
        const cityRouteFilter = adminExists ? { adminUserId } : {};
        const cityRoutes = yield CityRoute_1.CityRouteModel.find(cityRouteFilter);
        // Send success response with city route data
        return (0, responseFun_1.sendSuccessResponse)(res, cityRoutes, `City routes retrieved successfully${adminExists ? " for the authenticated admin." : " for all users."}`);
    }
    catch (error) {
        console.error("Error retrieving city route data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Server error: Unable to retrieve city route data at this time.");
    }
});
exports.default = getAllCityRoutes;
