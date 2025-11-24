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
const EditCityRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityRouteId, from, to, averageTravelTime, driverCost, adminCost, cooperativeCost, ditteCost, totalPrice } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Check if the city route with the given ID exists
        const existingRoute = yield CityRoute_1.CityRouteModel.findById(cityRouteId);
        if (!existingRoute) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "City route not found.");
        }
        // Prepare updated city route data
        const updatedRouteData = {
            adminUserId,
            from,
            to,
            averageTravelTime,
            driverCost,
            adminCost,
            cooperativeCost,
            ditteCost,
            totalPrice
        };
        // Update the city route entry in the database
        yield CityRoute_1.CityRouteModel.updateOne({ _id: cityRouteId }, { $set: updatedRouteData });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "City route details updated successfully.");
    }
    catch (error) {
        console.error("Error while updating city route info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while updating the city route information.");
    }
});
exports.default = EditCityRoute;
