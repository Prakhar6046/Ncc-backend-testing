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
exports.createSuperAdmin = void 0;
const responseFun_1 = require("../../utils/responseFun");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Admin_1 = require("../../models/AdminModel/Admin");
const CityModel_1 = require("../../models/CityModel/CityModel");
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, city, cityId } = req.body;
        // Check if Admin already exists
        const existingAdminUser = yield Admin_1.AdminModel.findOne({ email });
        const CompanyInfo = yield CompanyModel_1.CompanyModel.findOne({ email });
        if (existingAdminUser) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        if (CompanyInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Prepare new Admin data
        const newAdmin = {
            email,
            password: hashedPassword,
            city,
            cityId
        };
        // Create new Admin in the database
        yield Admin_1.AdminModel.create(newAdmin);
        yield CityModel_1.CityModel.updateOne({ _id: cityId }, { $set: {
                cityUsed: true
            } });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Admin created successfully.");
    }
    catch (error) {
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while registering the Admin.");
    }
});
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if Admin or SuperAdmin with the email already exists
        const existingAdmin = yield Admin_1.AdminModel.findOne({ email });
        if (existingAdmin) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newSuperAdmin = {
            email,
            password: hashedPassword,
            superAdmin: true,
        };
        yield Admin_1.AdminModel.create(newSuperAdmin);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Super Admin created successfully.");
    }
    catch (error) {
        console.error("Error creating super admin:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while creating the Super Admin.");
    }
});
exports.createSuperAdmin = createSuperAdmin;
exports.default = registerAdmin;
