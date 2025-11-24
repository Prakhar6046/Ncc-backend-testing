"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        lowercase: true,
    },
    password: {
        type: String,
    },
    city: {
        type: String
    },
    cityId: {
        type: String
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["admin", "capoflotta", "ditta_individuale"],
        default: "admin"
    },
    parentId: {
        type: String,
        default: null
    }
});
exports.AdminModel = mongoose_1.default.model("AdminMembers", AdminSchema);
