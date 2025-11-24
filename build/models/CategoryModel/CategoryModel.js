"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CategoryModelSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
});
exports.CategoryModel = mongoose_1.default.model("CategoryModel", CategoryModelSchema);
