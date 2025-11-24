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
const createDittaIndividuale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, city, cityId } = req.body;
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Get original user info for permission checks
        const originalUserInfo = yield Admin_1.AdminModel.findById(req.user._id.toString());
        if (!originalUserInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "User not found.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data created by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        if (!originalUserInfo.superAdmin &&
            originalUserInfo.userType !== "admin" &&
            originalUserInfo.userType !== "capoflotta") {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Only Admin, SuperAdmin, or Capoflotta can create Ditta individuale.");
        }
        const existingAdminUser = yield Admin_1.AdminModel.findOne({ email });
        const CompanyInfo = yield CompanyModel_1.CompanyModel.findOne({ email });
        if (existingAdminUser) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        if (CompanyInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "An account with this email already exists.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Prepare new Ditta individuale data
        const newDittaIndividuale = {
            email,
            password: hashedPassword,
            city,
            cityId,
            userType: "ditta_individuale",
            parentId: effectiveAdminUserId,
            superAdmin: false,
        };
        // Create new Ditta individuale in the database
        yield Admin_1.AdminModel.create(newDittaIndividuale);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Ditta individuale created successfully.");
    }
    catch (error) {
        console.error("Error creating Ditta individuale:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while creating the Ditta individuale.");
    }
});
exports.default = createDittaIndividuale;
