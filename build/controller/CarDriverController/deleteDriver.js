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
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const CarModel_1 = require("../../models/CarModel/CarModel");
const DeleteDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Validate driver ID is provided
        if (!driverId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Driver ID is required");
        }
        // Check if the driver exists
        const driverInfo = yield CarDriver_1.CarDriversModel.findById(driverId);
        if (!driverInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Driver not found");
        }
        // Remove driver from cars
        yield CarModel_1.CarModels.updateMany({ driverId }, { $set: { driverAssign: false, driverId: null } });
        // Remove the driver
        yield CarDriver_1.CarDriversModel.deleteOne({ _id: driverId });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Driver removed successfully and car(s) updated");
    }
    catch (error) {
        console.error("Error removing driver:", error);
        (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while removing the driver");
    }
});
exports.default = DeleteDriver;
