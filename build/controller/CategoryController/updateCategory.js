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
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, _id } = req.body;
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Check if category exists and belongs to the effective admin
        const existingCategory = yield CategoryModel_1.CategoryModel.findOne({ _id, adminUserId });
        if (!existingCategory) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Category not found or unauthorized");
        }
        existingCategory.category = category;
        yield existingCategory.save();
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Category updated successfully");
    }
    catch (error) {
        console.error("Error updating category:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
exports.default = updateCategory;
