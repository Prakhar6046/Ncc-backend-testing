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
const Admin_1 = require("../../../models/AdminModel/Admin");
const CitiesWithAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cityIds = yield Admin_1.AdminModel.distinct("cityId", { cityId: { $exists: true, $ne: null } });
        // Step 2: Find cities in CityModel whose _id is in cityIds array
        const cities = yield CityModel_1.CityModel.find({
            _id: { $in: cityIds }
        });
        return (0, responseFun_1.sendSuccessResponse)(res, cities, "Cities with admins retrieved successfully.");
    }
    catch (error) {
        console.error("Error fetching cities with admins:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while fetching cities with admins.");
    }
});
exports.default = CitiesWithAdmins;
