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
const updateCapoflotta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, confirmPassword, city, cityId, capoflottaId } = req.body;
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        const creatorId = req.user._id;
        const creatorInfo = yield Admin_1.AdminModel.findById(creatorId);
        if (!creatorInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Creator not found.");
        }
        if (!creatorInfo.superAdmin && creatorInfo.userType !== "admin") {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Only Admin or SuperAdmin can update Capoflotta.");
        }
        if (!capoflottaId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Capoflotta ID is required.");
        }
        // Check if the Capoflotta exists
        const existingCapoflotta = yield Admin_1.AdminModel.findById(capoflottaId);
        if (!existingCapoflotta) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Capoflotta not found.");
        }
        // Verify it's actually a Capoflotta
        if (existingCapoflotta.userType !== "capoflotta") {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "The specified user is not a Capoflotta.");
        }
        // Check if email is being changed and if it already exists
        if (email && email !== existingCapoflotta.email) {
            const existingAdminUser = yield Admin_1.AdminModel.findOne({
                email,
                _id: { $ne: capoflottaId }
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
        let hashedPassword = existingCapoflotta.password; // Retain existing password by default
        if (password) {
            if (!confirmPassword) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Confirm password is required when updating password.");
            }
            if (password !== confirmPassword) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Password and Confirm Password do not match.");
            }
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        // Prepare updated Capoflotta data
        const updatedCapoflottaData = {
            email: email || existingCapoflotta.email,
            password: hashedPassword,
            city: city || existingCapoflotta.city,
            cityId: cityId || existingCapoflotta.cityId,
            parentId: existingCapoflotta.parentId || null,
        };
        // Update the Capoflotta in the database
        yield Admin_1.AdminModel.updateOne({ _id: capoflottaId }, { $set: updatedCapoflottaData });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Capoflotta updated successfully.");
    }
    catch (error) {
        console.error("Error updating Capoflotta:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while updating the Capoflotta.");
    }
});
exports.default = updateCapoflotta;
