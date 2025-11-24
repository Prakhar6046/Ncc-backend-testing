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
const CategoryModel_1 = require("../../models/CategoryModel/CategoryModel");
const adminHelper_1 = require("../../utils/adminHelper");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        // Ensure user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Check if this adminUserId already has the same category
        const existingCategory = yield CategoryModel_1.CategoryModel.findOne({
            adminUserId,
            category,
        });
        if (existingCategory) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Category already exists for this admin.");
        }
        // Save the new category for this admin user
        const newCategory = new CategoryModel_1.CategoryModel({ category, adminUserId });
        yield newCategory.save();
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Category created successfully.");
    }
    catch (error) {
        console.error("Error creating category:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal server error.");
    }
});
exports.default = createCategory;
