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
const responseFun_1 = require("../../utils/responseFun");
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addDriverEmail_1 = __importDefault(require("../../middleware/email/addDriverEmail"));
const CarModel_1 = require("../../models/CarModel/CarModel");
const adminHelper_1 = require("../../utils/adminHelper");
const NewCarDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { driverName, driverSurname, accessTheApp, carModel, driverEmail, driverPassword, cityOfService, category, } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Get effective adminUserId (parent Admin's ID for Capoflotta)
        // This ensures data created by Capoflotta is associated with their parent Admin
        const { effectiveAdminUserId } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        const adminUserId = effectiveAdminUserId;
        // Check if a car driver with the given email already exists
        const existingDriver = yield CarDriver_1.CarDriversModel.findOne({ driverEmail });
        if (existingDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 409, "A car driver with this email already exists.");
        }
        let CarModel = null;
        if (carModel && carModel.trim() !== '') {
            CarModel = yield CarModel_1.CarModels.findById(carModel);
            if (!CarModel) {
                return (0, responseFun_1.sendErrorResponse)(res, 404, "Car Model not Found ");
            }
            if (CarModel.driverAssign && CarModel.driverId) {
                return (0, responseFun_1.sendErrorResponse)(res, 409, "This car is already assigned to another driver");
            }
        }
        // Hash the driver password
        const hashedPassword = yield bcrypt_1.default.hash(driverPassword, 10);
        // Prepare new driver data
        const newDriverData = {
            adminUserId,
            driverName,
            driverSurname,
            accessTheApp,
            driverEmail,
            driverPassword: hashedPassword,
            cityOfService,
            carType: (_a = CarModel === null || CarModel === void 0 ? void 0 : CarModel.carType) !== null && _a !== void 0 ? _a : null,
            category,
        };
        // Set carModel - either the provided value or null if empty
        if (carModel && carModel.trim() !== '') {
            newDriverData.carModel = carModel;
        }
        else {
            newDriverData.carModel = null;
        }
        // Create new car driver entry in the database
        const NewDriver = yield CarDriver_1.CarDriversModel.create(newDriverData);
        // Only assign car if a car model was selected
        if (carModel && carModel.trim() !== '' && CarModel) {
            CarModel.driverAssign = true;
            CarModel.driverId = NewDriver._id.toString();
            yield CarModel.save();
        }
        yield (0, addDriverEmail_1.default)(driverEmail, driverPassword, res);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "New car driver created successfully.");
    }
    catch (error) {
        console.error("Error while adding car driver info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while adding the car driver information.");
    }
});
exports.default = NewCarDriver;
