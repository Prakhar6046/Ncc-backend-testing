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
const getDittaIndividuale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const adminId = req.user._id;
        const adminInfo = yield Admin_1.AdminModel.findById(adminId);
        if (!adminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        // If userType is Capoflotta, use its parentId to get admin model data
        const effectiveAdminId = adminInfo.userType === "capoflotta" && adminInfo.parentId
            ? adminInfo.parentId
            : adminId;
        const dittaUsers = yield Admin_1.AdminModel.find({
            parentId: effectiveAdminId,
            userType: "ditta_individuale",
        });
        return (0, responseFun_1.sendSuccessResponse)(res, dittaUsers, "Ditta individuale users retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching Ditta individuale data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching Ditta individuale data.");
    }
});
exports.default = getDittaIndividuale;
