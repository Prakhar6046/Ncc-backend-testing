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
const AllCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all citys 
        const CityInfo = yield CityModel_1.CityModel.find({});
        // Respond with the fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, CityInfo, "City data retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching admin data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching citys data.");
    }
});
exports.default = AllCity;
