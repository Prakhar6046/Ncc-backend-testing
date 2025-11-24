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
const CityModel_1 = require("../../models/CityModel/CityModel");
const RemoveAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { removeAdminId, cityId } = req.body;
        // Validate request body
        if (!removeAdminId ||
            typeof removeAdminId !== "string" ||
            removeAdminId.trim() === "") {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Admin ID is required and must be a valid string.");
        }
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
            return (0, responseFun_1.sendErrorResponse)(res, 403, "You do not have permission to remove an admin.");
        }
        // Check if the admin to be removed exists
        const adminToRemove = yield Admin_1.AdminModel.findById(removeAdminId);
        if (!adminToRemove) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, `Admin  not found.`);
        }
        // Delete the admin
        yield Admin_1.AdminModel.deleteOne({ _id: removeAdminId });
        const cityUpdateResult = yield CityModel_1.CityModel.updateOne({ _id: cityId }, { $set: { cityUsed: false } });
        // Respond with success
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, `Admin has been successfully removed.`);
    }
    catch (error) {
        console.error("Error during removing the admin:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while removing the admin.");
    }
});
exports.default = RemoveAdmin;
