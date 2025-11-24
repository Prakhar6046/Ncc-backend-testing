"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoleCostSchema = new mongoose_1.default.Schema({
    fixedCost: {
        type: Number,
        required: true,
    },
    costPerKm: {
        type: Number,
        required: true,
    },
});
const VehicleTypeSchema = new mongoose_1.default.Schema({
    admin: {
        type: RoleCostSchema,
        required: true,
    },
    cooperative: {
        type: RoleCostSchema,
        required: true,
    },
    driver: {
        type: RoleCostSchema,
        required: true,
    },
    ditta_individuale: {
        type: RoleCostSchema,
        required: true,
    },
});
const MileageBandSchema = new mongoose_1.default.Schema({
    kmMin: {
        type: Number,
        required: true,
        default: 0,
    },
    kmMax: {
        type: Number,
        required: true,
    },
    vehicleTypes: {
        berlina: {
            type: VehicleTypeSchema,
            required: true,
        },
        van: {
            type: VehicleTypeSchema,
            required: true,
        },
        lusso: {
            type: VehicleTypeSchema,
            required: true,
        },
    },
});
const AdminSettingSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        require: true,
    },
    mileageBands: {
        type: [MileageBandSchema],
        required: true,
    },
});
exports.AdminSettings = mongoose_1.default.model("AdminSetting", AdminSettingSchema);
