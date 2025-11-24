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
const CarModel_1 = require("../../models/CarModel/CarModel");
const adminHelper_1 = require("../../utils/adminHelper");
const EditCarModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carModelId, carType, targa, module, licenseNumber, cityOfService } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Unauthorized: User not authenticated");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data edited by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Validate required fields
        if (!carType || !targa || !module || !carModelId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required fields: carModelId, carType, module, and targa");
        }
        // Validate carType
        const validCarTypes = [4, 6, 8]; // Berlina, Van, Lusso
        if (!validCarTypes.includes(Number(carType))) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Invalid car type. Must be 4 (Berlina), 6 (Van), or 8 (Lusso).");
        }
        // Find the existing car Model
        const existingDriver = yield CarModel_1.CarModels.findById(carModelId);
        if (!existingDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Car driver not found.");
        }
        // Check for duplicate email
        const emailExists = yield CarModel_1.CarModels.findOne({
            targa,
            _id: { $ne: carModelId },
        });
        if (emailExists) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "A car Model with this targa already exists.");
        }
        // Prepare updated data
        const updatedDriverData = {
            adminUserId,
            carType,
            targa,
            module,
            licenseNumber,
            cityOfService,
        };
        // Update the car Model in the database
        yield CarModel_1.CarModels.findByIdAndUpdate(carModelId, { $set: updatedDriverData }, { new: true });
        // Send success response with updated Car Model data
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Car Model details updated successfully.");
    }
    catch (error) {
        console.error("Error while updating car Model info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal Server Error: Unable to update car Model information.");
    }
});
exports.default = EditCarModel;
