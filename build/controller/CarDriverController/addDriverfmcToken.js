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
const responseFun_1 = require("../../utils/responseFun"); // Assuming `sendSuccessResponse` sends data with success
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const AddDriverFmcToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fmcToken } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Unauthorized: User not authenticated.");
        }
        const driverId = req.user._id;
        // Validate required fields
        if (!fmcToken) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required field: fmcToken.");
        }
        // Find the existing car driver
        const existingDriver = yield CarDriver_1.CarDriversModel.findById(driverId);
        if (!existingDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Car driver not found.");
        }
        // Update the car driver in the database
        const updateResult = yield CarDriver_1.CarDriversModel.updateOne({ _id: driverId }, { $set: { fmcToken } });
        // Send success response
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Car driver FMC token updated successfully.");
    }
    catch (error) {
        console.error("Error while updating car driver info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal Server Error: Unable to update car driver information.");
    }
});
exports.default = AddDriverFmcToken;
