"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarDriversModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CarDriversSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        require: true,
    },
    driverName: {
        type: String,
        require: true,
    },
    cityOfService: {
        type: String,
        require: true,
    },
    carModel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CarModels",
        required: false,
    },
    category: {
        type: String,
        require: true,
    },
    carType: {
        type: String,
    },
    driverSurname: {
        type: String,
        require: true,
    },
    accessTheApp: {
        type: Boolean,
        require: true,
    },
    driverEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        lowercase: true,
    },
    driverPassword: {
        type: String,
        require: true,
    },
    fmcToken: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});
exports.CarDriversModel = mongoose_1.default.model("CarDrivers", CarDriversSchema);
