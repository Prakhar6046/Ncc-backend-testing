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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const Admin_1 = require("../../models/AdminModel/Admin");
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, surname, companyName, piva, address, city, name, pec, sdi, } = req.body;
        // Check if origination already exists
        const existingOrigination = yield CompanyModel_1.CompanyModel.findOne({ email });
        const AdminInfo = yield Admin_1.AdminModel.findOne({ email });
        if (existingOrigination) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        if (AdminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists .");
        }
        // Generate and hash a random password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Prepare new origination data
        const newOrigination = {
            email,
            password: hashedPassword,
            surname,
            name,
            companyName,
            piva,
            address,
            city,
            pec,
            sdi,
        };
        // Create new origination in the database
        yield CompanyModel_1.CompanyModel.create(newOrigination);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Company Data created successfully.");
    }
    catch (error) {
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while registering the Company.");
    }
});
exports.default = registerCompany;
