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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseFun_1 = require("../../utils/responseFun");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Admin_1 = require("../../models/AdminModel/Admin");
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const adminHelper_1 = require("../../utils/adminHelper");
const updateDittaIndividuale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, confirmPassword, city, cityId, dittaIndividualeId } = req.body;
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Get original user info for permission checks
        const originalUserInfo = yield Admin_1.AdminModel.findById(req.user._id.toString());
        if (!originalUserInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "User not found.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data updated by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        if (!originalUserInfo.superAdmin &&
            originalUserInfo.userType !== "admin" &&
            originalUserInfo.userType !== "capoflotta") {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Only Admin, SuperAdmin, or Capoflotta can update Ditta individuale.");
        }
        if (!dittaIndividualeId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Ditta individuale ID is required.");
        }
        // Check if the Ditta individuale exists
        const existingDittaIndividuale = yield Admin_1.AdminModel.findById(dittaIndividualeId);
        if (!existingDittaIndividuale) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Ditta individuale not found.");
        }
        // Verify it's actually a Ditta individuale
        if (existingDittaIndividuale.userType !== "ditta_individuale") {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "The specified user is not a Ditta individuale.");
        }
        // Verify ownership: Ditta individuale must belong to the effective admin (parent admin for Capoflotta)
        if (existingDittaIndividuale.parentId !== effectiveAdminUserId) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "You can only update Ditta individuale that belong to you.");
        }
        // Check if email is being changed and if it already exists
        if (email && email !== existingDittaIndividuale.email) {
            const existingAdminUser = yield Admin_1.AdminModel.findOne({
                email,
                _id: { $ne: dittaIndividualeId }
            });
            const CompanyInfo = yield CompanyModel_1.CompanyModel.findOne({ email });
            if (existingAdminUser) {
                return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
            }
            if (CompanyInfo) {
                return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
            }
        }
        // Handle password update (only if provided)
        let hashedPassword = existingDittaIndividuale.password; // Retain existing password by default
        if (password) {
            if (!confirmPassword) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Confirm password is required when updating password.");
            }
            if (password !== confirmPassword) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Password and Confirm Password do not match.");
            }
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        // Prepare updated Ditta individuale data
        const updatedDittaIndividualeData = {
            email: email || existingDittaIndividuale.email,
            password: hashedPassword,
            city: city || existingDittaIndividuale.city,
            cityId: cityId || existingDittaIndividuale.cityId,
            parentId: existingDittaIndividuale.parentId || null,
        };
        // Update the Ditta individuale in the database
        yield Admin_1.AdminModel.updateOne({ _id: dittaIndividualeId }, { $set: updatedDittaIndividualeData });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Ditta individuale updated successfully.");
    }
    catch (error) {
        console.error("Error updating Ditta individuale:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while updating the Ditta individuale.");
    }
});
exports.default = updateDittaIndividuale;
