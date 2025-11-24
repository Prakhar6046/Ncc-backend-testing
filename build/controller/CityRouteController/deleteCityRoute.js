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
const DeleteCityRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityRouteId } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Validate City Route ID is provided
        if (!cityRouteId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "City Route ID is required");
        }
        // Check if the City Route exists
        const cityRouteInfo = yield CityRoute_1.CityRouteModel.findById(cityRouteId);
        if (!cityRouteInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "City Route not found");
        }
        // Remove the City Route
        yield CityRoute_1.CityRouteModel.deleteOne({ _id: cityRouteId });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "City Route removed successfully");
    }
    catch (error) {
        console.error("Error removing City Route:", error);
        (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while removing the City Route");
    }
});
exports.default = DeleteCityRoute;
