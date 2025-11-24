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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseFun_1 = require("../../utils/responseFun"); // Assuming `sendSuccessResponse` sends data with success
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const CarModel_1 = require("../../models/CarModel/CarModel");
const adminHelper_1 = require("../../utils/adminHelper");
const EditCarDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { carDriverId, driverName, driverSurname, accessTheApp, driverEmail, driverPassword, cityOfService, licenseNumber, carModel, category, } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "Unauthorized: User not authenticated");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data edited by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Validate required fields
        if (!carDriverId || !driverEmail || !driverName || !driverSurname) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required fields: carDriverId, driverEmail, driverName, and driverSurname");
        }
        // Find the existing car driver
        const existingDriver = yield CarDriver_1.CarDriversModel.findById(carDriverId);
        if (!existingDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Car driver not found.");
        }
        const existingCarId = (_a = existingDriver.carModel) === null || _a === void 0 ? void 0 : _a.toString();
        const newCarId = carModel === null || carModel === void 0 ? void 0 : carModel.toString();
        let CarModel = null;
        if (newCarId && newCarId.trim() !== '') {
            CarModel = yield CarModel_1.CarModels.findById(newCarId);
            if (!CarModel) {
                return (0, responseFun_1.sendErrorResponse)(res, 404, "Car Model not Found");
            }
        }
        if (existingCarId !== newCarId) {
            if (newCarId && newCarId.trim() !== '' && CarModel && CarModel.driverAssign && CarModel.driverId) {
                return (0, responseFun_1.sendErrorResponse)(res, 409, "This car is already assigned to another driver");
            }
        }
        // Check for duplicate email
        const emailExists = yield CarDriver_1.CarDriversModel.findOne({
            driverEmail,
            _id: { $ne: carDriverId },
        });
        if (emailExists) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "A car driver with this email already exists.");
        }
        let hashedPassword = existingDriver.driverPassword;
        if (driverPassword) {
            const isSame = yield bcrypt_1.default.compare(driverPassword, existingDriver.driverPassword);
            if (!isSame) {
                hashedPassword = yield bcrypt_1.default.hash(driverPassword, 10);
            }
        }
        // Prepare updated data
        const updatedDriverData = {
            adminUserId,
            driverName,
            driverSurname,
            accessTheApp,
            driverEmail,
            driverPassword: hashedPassword,
            cityOfService,
            licenseNumber,
            carType: (_b = CarModel === null || CarModel === void 0 ? void 0 : CarModel.carType) !== null && _b !== void 0 ? _b : null,
            category,
        };
        // Only include carModel if it's provided and not empty
        if (carModel && carModel.trim() !== '') {
            updatedDriverData.carModel = carModel;
        }
        else {
            // If no car model is selected, set it to null to unassign any existing car
            updatedDriverData.carModel = null;
        }
        // Update the car driver in the database
        yield CarDriver_1.CarDriversModel.findByIdAndUpdate(carDriverId, { $set: updatedDriverData }, { new: true });
        // If the driver was previously assigned to a different car, un‑assign it
        if (existingDriver.carModel &&
            existingDriver.carModel.toString() !== carModel) {
            yield CarModel_1.CarModels.updateOne({ _id: existingDriver.carModel }, { $set: { driverAssign: false, driverId: null } });
        }
        // Only assign new car if a car model was selected
        if (carModel && carModel.trim() !== '' && CarModel) {
            yield CarModel_1.CarModels.updateOne({
                _id: carModel,
            }, {
                $set: {
                    driverAssign: true,
                    driverId: carDriverId,
                },
            });
        }
        // Send success response with updated driver data
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Car driver details updated successfully.");
    }
    catch (error) {
        console.error("Error while updating car driver info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal Server Error: Unable to update car driver information.");
    }
});
exports.default = EditCarDriver;
