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
const businessModel_1 = require("../../models/BusinessModel/businessModel");
const cityBusinessModel_1 = require("../../models/BusinessModel/cityBusinessModel");
const BusinessData = (totalPrice, totalTime, city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch global business and city-specific business data
        const [business, cityBusiness] = yield Promise.all([
            businessModel_1.BusinessModel.findOne({}),
            cityBusinessModel_1.CityBusinessModel.findOne({ city }),
        ]);
        // Update or create city-specific business data
        yield handleCityBusinessUpdate(cityBusiness, city, totalPrice, totalTime);
        // Update or create global business data
        yield handleGlobalBusinessUpdate(business, totalPrice, totalTime);
    }
    catch (error) {
        console.error("Error while updating business data:", error);
    }
});
// Handles updating or creating city-specific business data
const handleCityBusinessUpdate = (cityBusiness, city, totalPrice, totalTime) => __awaiter(void 0, void 0, void 0, function* () {
    const initialCityBusinessInfo = {
        totalProfit: totalPrice,
        earningsPerPeriod: totalPrice,
        dailyAverage: totalPrice,
        totalRuns: 1,
        totalRunsPerDay: 1,
        averageEarningsPerRide: totalPrice, // Single run
        timeTravel: totalTime,
        city,
    };
    if (!cityBusiness) {
        // Create new city-specific business data
        yield cityBusinessModel_1.CityBusinessModel.create(initialCityBusinessInfo);
    }
    else {
        // Calculate updated values
        const updatedCityData = {
            totalProfit: cityBusiness.totalProfit + totalPrice,
            earningsPerPeriod: cityBusiness.earningsPerPeriod + totalPrice,
            dailyAverage: cityBusiness.dailyAverage + totalPrice,
            totalRuns: cityBusiness.totalRuns + 1,
            totalRunsPerDay: cityBusiness.totalRunsPerDay + 1,
            averageEarningsPerRide: (cityBusiness.dailyAverage + totalPrice) /
                (cityBusiness.totalRunsPerDay + 1),
            timeTravel: cityBusiness.timeTravel + totalTime,
        };
        // Update the document
        yield cityBusinessModel_1.CityBusinessModel.updateOne({ _id: cityBusiness._id }, { $set: updatedCityData });
    }
});
// Handles updating or creating global business data
const handleGlobalBusinessUpdate = (business, totalPrice, totalTime) => __awaiter(void 0, void 0, void 0, function* () {
    const initialGlobalBusinessInfo = {
        totalProfit: totalPrice,
        earningsPerPeriod: totalPrice,
        dailyAverage: totalPrice,
        totalRuns: 1,
        totalRunsPerDay: 1,
        averageEarningsPerRide: totalPrice, // Single run
        timeTravel: totalTime,
    };
    if (!business) {
        // Create new global business data
        yield businessModel_1.BusinessModel.create(initialGlobalBusinessInfo);
    }
    else {
        // Calculate updated values
        const updatedGlobalData = {
            totalProfit: business.totalProfit + totalPrice,
            earningsPerPeriod: business.earningsPerPeriod + totalPrice,
            dailyAverage: business.dailyAverage + totalPrice,
            totalRuns: business.totalRuns + 1,
            totalRunsPerDay: business.totalRunsPerDay + 1,
            averageEarningsPerRide: (business.dailyAverage + totalPrice) / (business.totalRunsPerDay + 1),
            timeTravel: business.timeTravel + totalTime,
        };
        // Update the document
        yield businessModel_1.BusinessModel.updateOne({ _id: business._id }, { $set: updatedGlobalData });
    }
});
exports.default = BusinessData;
