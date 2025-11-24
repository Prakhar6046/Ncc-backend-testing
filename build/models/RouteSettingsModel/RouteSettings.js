"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteSettingsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for pricing configuration for a specific km range, vehicle type, and user type
const PricingConfigSchema = new mongoose_1.default.Schema({
    vehicleType: {
        type: String,
        enum: ["Berlina", "Van", "Lusso"],
        required: true,
    },
    adminFixed: {
        type: Number,
        required: true,
    },
    adminPerKm: {
        type: Number,
        required: true,
    },
    cooperativaFixed: {
        type: Number,
        required: true,
    },
    cooperativaPerKm: {
        type: Number,
        required: true,
    },
    driverFixed: {
        type: Number,
        required: true,
    },
    driverPerKm: {
        type: Number,
        required: true,
    },
});
// Schema for km range configuration
const KmRangeSchema = new mongoose_1.default.Schema({
    maxKm: {
        type: Number,
        required: true,
    },
    pricing: [PricingConfigSchema],
});
const RouteSettingsSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        required: true,
    },
    kmRanges: [KmRangeSchema],
});
exports.RouteSettingsModel = mongoose_1.default.model("RouteSettings", RouteSettingsSchema);
