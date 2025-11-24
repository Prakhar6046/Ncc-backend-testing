"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CompanySchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        lowercase: true,
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    companyName: {
        type: String,
        require: true
    },
    piva: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    pec: {
        type: String,
        require: true
    },
    sdi: {
        type: String,
        require: true
    }
});
exports.CompanyModel = mongoose_1.default.model("companys", CompanySchema);
