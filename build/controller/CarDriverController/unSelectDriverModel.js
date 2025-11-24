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
const CarModel_1 = require("../../models/CarModel/CarModel");
const mongoose_1 = __importDefault(require("mongoose"));
const UnSelectDriverModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carModel } = req.body;
        if (!carModel || !mongoose_1.default.Types.ObjectId.isValid(carModel)) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Invalid or missing carModel.");
        }
        // Ensure the user is authenticated and has a valid ID
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const DriverId = req.user._id;
        const DriverInfo = yield CarDriver_1.CarDriversModel.findById(DriverId);
        // Validate required fields
        if (!DriverInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Missing required fields. City info not found");
        }
        // Update the car driver in the database
        yield CarDriver_1.CarDriversModel.findByIdAndUpdate(DriverId, { $set: { carModel: null, carType: null } }, { new: true });
        // If the driver was previously assigned to a different car, un‑assign it
        yield CarModel_1.CarModels.updateOne({
            _id: carModel,
        }, {
            $set: {
                driverAssign: false,
                driverId: null,
            },
        });
        // Send success response with updated driver data
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Car driver un‑assigned successfully.");
    }
    catch (error) {
        console.error("Error while updating car driver info:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal Server Error: Unable to update car driver information.");
    }
});
exports.default = UnSelectDriverModel;
