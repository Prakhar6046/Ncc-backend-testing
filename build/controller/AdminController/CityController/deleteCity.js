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
const responseFun_1 = require("../../../utils/responseFun");
const CityModel_1 = require("../../../models/CityModel/CityModel");
const CompanyModel_1 = require("../../../models/CompanyModel/CompanyModel");
const DeleteCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cityId } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Validate City  ID is provided
        if (!cityId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "City  ID is required");
        }
        // Check if the City  exists
        const cityInfo = yield CityModel_1.CityModel.findById(cityId);
        if (!cityInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "City not found");
        }
        const companyUsingCity = yield CompanyModel_1.CompanyModel.findOne({ city: cityId });
        if (companyUsingCity) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "Cannot delete city. It is being used by one or more companies.");
        }
        // Remove the City
        yield CityModel_1.CityModel.deleteOne({ _id: cityId });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "City  removed successfully");
    }
    catch (error) {
        console.error("Error removing City :", error);
        (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while removing the City ");
    }
});
exports.default = DeleteCity;
