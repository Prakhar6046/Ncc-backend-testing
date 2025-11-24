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
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const deleteCompanyInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const userId = req.user._id;
        // Delete company info and associated bookings
        yield CompanyModel_1.CompanyModel.deleteOne({ _id: userId });
        yield NccBooking_1.NccBookingModel.deleteMany({ CompanyId: userId });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Account deleted successfully.");
    }
    catch (error) {
        console.error("Error during account deletion:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while deleting the account.");
    }
});
exports.default = deleteCompanyInfo;
