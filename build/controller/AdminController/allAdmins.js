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
const Admin_1 = require("../../models/AdminModel/Admin");
const AllAdminsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const superAdminId = req.user._id;
        const superAdminInfo = yield Admin_1.AdminModel.findById(superAdminId);
        // Check if admin info exists
        if (!superAdminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Super admin user not found.");
        }
        // Ensure the user has super admin privileges
        if (!superAdminInfo.superAdmin) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "You do not have permission to view admin data.");
        }
        // Fetch all admins excluding the current super admin
        const adminsInfo = yield Admin_1.AdminModel.find({
            _id: { $ne: superAdminId },
            superAdmin: { $ne: true }
        });
        // Respond with the fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, adminsInfo, "Admin data retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching admin data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching admin data.");
    }
});
exports.default = AllAdminsData;
