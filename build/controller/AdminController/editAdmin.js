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
const CityModel_1 = require("../../models/CityModel/CityModel");
const EditAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, confirmPassword, city, adminId, newCityId, oldCityId, } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Check if the admin with the given ID exists
        const existingAdmin = yield Admin_1.AdminModel.findById(adminId);
        if (!existingAdmin) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin not found.");
        }
        // Check if an admin with the same email already exists (excluding the current admin being edited)
        const emailExists = yield Admin_1.AdminModel.findOne({
            email,
            _id: { $ne: adminId },
        });
        if (emailExists) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An admin with this email already exists.");
        }
        let hashedPassword = existingAdmin.password; // Retain existing password by default
        if (password) {
            if (password !== confirmPassword) {
                return (0, responseFun_1.sendErrorResponse)(res, 400, "Password and Confirm Password do not match.");
            }
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        // Hash the password if provided, or retain the existing password
        // Prepare updated admin data
        const updatedAdminData = {
            email: email || existingAdmin.email, // Retain existing email if not updated
            password: hashedPassword,
            city: city || existingAdmin.city, // Retain existing city if not updated
        };
        // Update the admin entry in the database
        yield Admin_1.AdminModel.updateOne({ _id: adminId }, { $set: updatedAdminData });
        yield CityModel_1.CityModel.updateOne({ _id: newCityId }, {
            $set: {
                cityUsed: true,
            },
        });
        yield CityModel_1.CityModel.updateOne({ _id: oldCityId }, {
            $set: {
                cityUsed: true,
            },
        });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Admin details updated successfully.");
    }
    catch (error) {
        console.error("Error while updating admin info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while updating admin information.");
    }
});
exports.default = EditAdmin;
