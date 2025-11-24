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
const CarModel_1 = require("../../models/CarModel/CarModel");
const adminHelper_1 = require("../../utils/adminHelper");
const AllCarModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Fetch all car Models for the effective admin (filtered by city)
        const allCarModels = yield CarModel_1.CarModels.find({
            adminUserId: effectiveAdminUserId,
            cityOfService: adminInfo.cityId,
        });
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, allCarModels, "All Car Model Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting all car Models data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, error.message === "Admin user not found." ? 404 : 500, error.message || "Error while getting all car Models data.");
    }
});
exports.default = AllCarModels;
