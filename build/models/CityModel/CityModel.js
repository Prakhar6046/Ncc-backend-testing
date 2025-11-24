"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CitySchema = new mongoose_1.default.Schema({
    cityName: {
        type: String
    },
    cityUsed: {
        type: Boolean,
        default: false
    }
});
exports.CityModel = mongoose_1.default.model("Citys", CitySchema);
