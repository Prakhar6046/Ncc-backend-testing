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
exports.getAdminInfo = exports.getEffectiveAdminUserId = void 0;
const Admin_1 = require("../models/AdminModel/Admin");
const getEffectiveAdminUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const adminInfo = yield Admin_1.AdminModel.findById(userId);
    if (!adminInfo) {
        throw new Error("Admin user not found.");
    }
    // If user is Capoflotta, get their parent Admin's ID
    if (adminInfo.userType === "capoflotta" && adminInfo.parentId) {
        const parentAdmin = yield Admin_1.AdminModel.findById(adminInfo.parentId);
        if (!parentAdmin) {
            throw new Error("Parent Admin not found for Capoflotta.");
        }
        // Return parent Admin's ID and info (for city filtering)
        return {
            effectiveAdminUserId: parentAdmin._id.toString(),
            adminInfo: parentAdmin,
        };
    }
    // If user is Ditta individuale, get their parent Capoflotta's ID
    if (adminInfo.userType === "ditta_individuale" && adminInfo.parentId) {
        const parentCapoflotta = yield Admin_1.AdminModel.findById(adminInfo.parentId);
        if (!parentCapoflotta) {
            throw new Error("Parent Capoflotta not found for Ditta individuale.");
        }
        // For Ditta individuale, we need to get the effective ID from their parent Capoflotta
        // This ensures they see data from the Capoflotta's parent Admin (hierarchical access)
        if (parentCapoflotta.userType === "capoflotta" && parentCapoflotta.parentId) {
            const parentAdmin = yield Admin_1.AdminModel.findById(parentCapoflotta.parentId);
            if (!parentAdmin) {
                throw new Error("Parent Admin not found for Capoflotta.");
            }
            // Return parent Admin's ID and info (for city filtering)
            return {
                effectiveAdminUserId: parentAdmin._id.toString(),
                adminInfo: parentAdmin,
            };
        }
        // If parent Capoflotta doesn't have a parent, use Capoflotta's ID
        return {
            effectiveAdminUserId: parentCapoflotta._id.toString(),
            adminInfo: parentCapoflotta,
        };
    }
    // For Admin or others, use their own ID
    return {
        effectiveAdminUserId: adminInfo._id.toString(),
        adminInfo,
    };
});
exports.getEffectiveAdminUserId = getEffectiveAdminUserId;
const getAdminInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const adminInfo = yield Admin_1.AdminModel.findById(userId);
    if (!adminInfo) {
        throw new Error("Admin user not found.");
    }
    return adminInfo;
});
exports.getAdminInfo = getAdminInfo;
