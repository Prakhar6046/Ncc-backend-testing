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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const getSingleHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.body;
        // Fetch hotel info by ID
        const hotelInfo = yield CompanyModel_1.CompanyModel.findById(hotelId);
        if (!hotelInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Hotel information not found.");
        }
        // Define response data
        const hotelInfoResponse = {
            _id: hotelInfo._id,
            email: hotelInfo.email,
            surname: hotelInfo.surname,
            companyName: hotelInfo.companyName,
            piva: hotelInfo.piva,
            address: hotelInfo.address,
            city: hotelInfo.city,
            pec: hotelInfo.pec,
            sdi: hotelInfo.sdi,
            name: hotelInfo.name,
        };
        return (0, responseFun_1.sendSuccessResponse)(res, hotelInfoResponse, "Hotel information retrieved successfully.");
    }
    catch (error) {
        console.error("Error retrieving single hotel data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while retrieving hotel information.");
    }
});
exports.default = getSingleHotel;
