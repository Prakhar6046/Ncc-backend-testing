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
const Admin_1 = require("../../models/AdminModel/Admin");
const CarModel_1 = require("../../models/CarModel/CarModel");
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const AllAppCarModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const carDriverId = req.user._id;
        const CarDriverInfo = yield CarDriver_1.CarDriversModel.findById(carDriverId);
        const adminInfo = yield Admin_1.AdminModel.findOne({
            _id: CarDriverInfo === null || CarDriverInfo === void 0 ? void 0 : CarDriverInfo.adminUserId,
        });
        // Check if admin info exists
        if (!adminInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin user not found.");
        }
        // Fetch all car Models for the authenticated admin's city
        const allCarModels = yield CarModel_1.CarModels.find({ adminUserId: adminInfo._id });
        if (!allCarModels.length) {
            return (0, responseFun_1.sendSuccessResponse)(res, [], "No Car Models found for the specified city.");
        }
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, allCarModels, "All Car Model Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting all car Models data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting all car Models data.");
    }
});
exports.default = AllAppCarModels;
