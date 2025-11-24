"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityRouteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CityRouteSchema = new mongoose_1.default.Schema({
    adminUserId: {
        type: String,
        require: true,
    },
    from: {
        type: String,
        require: true,
    },
    to: {
        type: String,
        require: true,
    },
    averageTravelTime: {
        type: Number,
        require: true,
    },
    driverCost: {
        type: Number,
        require: true,
    },
    adminCost: {
        type: Number,
        require: true,
    },
    cooperativeCost: {
        type: Number,
        require: true,
    },
    ditteCost: {
        type: Number,
        require: true,
    },
    totalPrice: {
        type: Number,
        require: true,
    },
    city: {
        type: String
    },
});
exports.CityRouteModel = mongoose_1.default.model("routes", CityRouteSchema);
