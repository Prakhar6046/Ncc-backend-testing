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
const responseFun_1 = require("../../utils/responseFun");
const CityRoute_1 = require("../../models/CityRouteModel/CityRoute");
const adminHelper_1 = require("../../utils/adminHelper");
const NewCityRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, averageTravelTime, driverCost, adminCost, cooperativeCost, ditteCost, totalPrice } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Prepare new city route data
        const newCityRoute = {
            adminUserId: effectiveAdminUserId,
            from,
            to,
            averageTravelTime,
            driverCost,
            adminCost,
            cooperativeCost,
            ditteCost,
            totalPrice,
            city: adminInfo.cityId
        };
        // Create new city route entry in the database
        yield CityRoute_1.CityRouteModel.create(newCityRoute);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "New city route created successfully.");
    }
    catch (error) {
        console.error("Error while adding city route info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while creating the city route.");
    }
});
exports.default = NewCityRoute;
