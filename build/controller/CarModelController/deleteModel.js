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
const DeleteCarModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carModelId } = req.body;
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated");
        }
        // Validate Model ID is provided
        if (!carModelId) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Car Model ID is required");
        }
        // Check if the Model exists
        const carModelInfo = yield CarModel_1.CarModels.findById(carModelId);
        if (!carModelInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Car Model not found");
        }
        // Remove the Model
        yield CarModel_1.CarModels.deleteOne({ _id: carModelId });
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Car Model removed successfully");
    }
    catch (error) {
        console.error("Error removing Model:", error);
        (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while removing the Model");
    }
});
exports.default = DeleteCarModel;
