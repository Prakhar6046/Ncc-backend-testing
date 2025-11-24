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
const getCapoflotta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const adminId = req.user._id;
        const adminInfo = yield Admin_1.AdminModel.findById(adminId);
        if (!adminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        if (!adminInfo.superAdmin && adminInfo.userType !== "admin") {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "You do not have permission to view Capoflotta data.");
        }
        const capoflottaUsers = yield Admin_1.AdminModel.find({
            parentId: adminId,
            userType: "capoflotta",
        });
        return (0, responseFun_1.sendSuccessResponse)(res, capoflottaUsers, "Capoflotta data retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching Capoflotta data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching Capoflotta data.");
    }
});
exports.default = getCapoflotta;
