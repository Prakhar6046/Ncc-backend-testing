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
const NewCarModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carType, targa, module, licenseNumber, cityOfService } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data created by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Validate carType
        const validCarTypes = [4, 6, 8]; // Berlina, Van, Lusso
        if (!carType || !validCarTypes.includes(Number(carType))) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Invalid car type. Must be 4 (Berlina), 6 (Van), or 8 (Lusso).");
        }
        // Check if a car Model with the given tagra already exists
        const existingDriver = yield CarModel_1.CarModels.findOne({ targa });
        if (existingDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "A car Model with this targa already exists.");
        }
        // Prepare new Car Model data
        const newDriverData = {
            adminUserId,
            carType,
            targa,
            module,
            licenseNumber,
            cityOfService,
        };
        // Create new car Model entry in the database
        yield CarModel_1.CarModels.create(newDriverData);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "New car Model created successfully.");
    }
    catch (error) {
        console.error("Error while adding car Model info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while adding the car model information.");
    }
});
exports.default = NewCarModel;
