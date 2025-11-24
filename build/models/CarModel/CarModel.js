"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModels = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CarModelSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        require: true,
    },
    carType: {
        type: Number,
        require: true,
    },
    targa: {
        type: String,
        require: true,
    },
    module: {
        type: String,
        require: true,
    },
    cityOfService: {
        type: String,
        require: true,
    },
    licenseNumber: {
        type: String,
        require: true,
    },
    driverAssign: {
        type: Boolean,
        default: false,
    },
    driverId: {
        type: String,
    },
});
exports.CarModels = mongoose_1.default.model("CarModels", CarModelSchema);
