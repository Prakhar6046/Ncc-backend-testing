"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BusinessSchema = new mongoose_1.default.Schema({
    // Since the beginning of the activity
    totalProfit: {
        type: Number,
    },
    // Last 7 days in analysis
    earningsPerPeriod: {
        type: Number,
    },
    // Average turnover per day
    dailyAverage: {
        type: Number,
    },
    // Since the beginning of the activity
    totalRuns: {
        type: Number,
    },
    totalRunsPerDay: {
        type: Number,
    },
    // Calculated on a daily basis
    averageEarningsPerRide: {
        type: Number,
    },
    // Total driving time
    timeTravel: {
        type: Number
    }
});
exports.BusinessModel = mongoose_1.default.model("business", BusinessSchema);
