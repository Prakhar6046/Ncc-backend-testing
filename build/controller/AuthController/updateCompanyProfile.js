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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UpdateCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, surname, companyName, piva, address, city, pec, sdi, } = req.body;
        // Check if req.user is authenticated and has a valid _id
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. User not found.");
        }
        const userId = req.user._id;
        // Verify if the company profile exists
        const existingCompany = yield CompanyModel_1.CompanyModel.findById(userId);
        if (!existingCompany) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Company profile not found.");
        }
        let hashedPassword = existingCompany.password; // Retain existing password by default
        if (password && !(password === existingCompany.password)) {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        // Update company profile details
        const updatedCompanyData = {
            companyName,
            name,
            email,
            password: hashedPassword,
            surname,
            piva,
            address,
            city,
            pec,
            sdi,
        };
        yield CompanyModel_1.CompanyModel.updateOne({ _id: userId }, { $set: updatedCompanyData });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Company profile updated successfully.");
    }
    catch (error) {
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An unexpected error occurred while updating the company profile. Please try again.");
    }
});
exports.default = UpdateCompanyProfile;
