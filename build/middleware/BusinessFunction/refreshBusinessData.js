"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshBusinessDataWeekly = exports.refreshBusinessDataDaily = void 0;
const businessModel_1 = require("../../models/BusinessModel/businessModel");
const refreshBusinessDataDaily = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = yield businessModel_1.BusinessModel.findOne({});
        if (!business) {
            console.error("No business record found to refresh.");
            return;
        }
        // Update the single business record
        yield businessModel_1.BusinessModel.updateOne({ _id: business._id }, {
            $set: {
                DailyAverage: 0,
                averageEarningsPerRide: 0,
                totalRunsPerDay: 0
            },
        });
    }
    catch (error) {
        console.error("Error while refreshing business data:", error);
    }
});
exports.refreshBusinessDataDaily = refreshBusinessDataDaily;
const refreshBusinessDataWeekly = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = yield businessModel_1.BusinessModel.findOne({});
        if (!business) {
            console.error("No business record found to refresh.");
            return;
        }
        // Update the single business record
        yield businessModel_1.BusinessModel.updateOne({ _id: business._id }, {
            $set: {},
        });
    }
    catch (error) {
        console.error("Error while refreshing business data:", error);
    }
});
exports.refreshBusinessDataWeekly = refreshBusinessDataWeekly;
