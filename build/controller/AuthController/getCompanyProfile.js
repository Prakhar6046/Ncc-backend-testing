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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const GetCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if req.user is authenticated and has a valid _id
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Authentication failed. User not found.");
        }
        const userId = req.user._id;
        // Verify if the company profile exists
        const company = yield CompanyModel_1.CompanyModel.findById(userId);
        if (!company) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Company profile not found.");
        }
        const companyToReturn = {
            _id: company._id,
            email: company.email,
            surname: company.surname,
            companyName: company.companyName,
            piva: company.piva,
            address: company.address,
            city: company.city,
            pec: company.pec,
            sdi: company.sdi,
            name: company.name,
        };
        return (0, responseFun_1.sendSuccessResponse)(res, companyToReturn, "Company Profile Data");
    }
    catch (error) {
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An unexpected error occurred while getting the company profile. Please try again.");
    }
});
exports.default = GetCompanyProfile;
