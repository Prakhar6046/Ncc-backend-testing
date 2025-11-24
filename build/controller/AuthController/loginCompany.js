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
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseFun_1 = require("../../utils/responseFun");
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const Admin_1 = require("../../models/AdminModel/Admin");
const loginCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists as a company or admin
        const company = (yield CompanyModel_1.CompanyModel.findOne({
            email,
        }));
        const admin = (yield Admin_1.AdminModel.findOne({ email }));
        const user = company || admin;
        if (!user) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Invalid email. No account found.");
        }
        // Verify the password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Invalid password.");
        }
        // Generate JWT token
        const token = yield (0, responseFun_1.getToken)(user.email, user);
        // Construct response data without the password
        const userResponse = company
            ? {
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
                token,
            }
            : {
                _id: admin._id,
                email: admin.email,
                superAdmin: admin.superAdmin,
                city: admin.city,
                cityId: admin.cityId,
                userType: admin.userType || (admin.superAdmin ? undefined : "admin"),
                parentId: admin.parentId || null,
                token,
            };
        return (0, responseFun_1.sendSuccessResponse)(res, userResponse, "Login successful.");
    }
    catch (error) {
        console.error("Error during login:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while logging in.");
    }
});
exports.default = loginCompany;
