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
exports.IndividualAppCarDriver = exports.IndividualCarDriver = void 0;
const responseFun_1 = require("../../utils/responseFun");
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const CarModel_1 = require("../../models/CarModel/CarModel");
const CityModel_1 = require("../../models/CityModel/CityModel");
const IndividualCarDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { CarDriverId } = req.body;
        // Fetch all car drivers for the authenticated user
        const CarDriversInfo = yield CarDriver_1.CarDriversModel.findOne({ _id: CarDriverId });
        if (!CarDriversInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Car Driver Not Found Please chack the detail");
        }
        let CarModelInfo = null;
        if (CarDriversInfo.carModel) {
            CarModelInfo = yield CarModel_1.CarModels.findById(CarDriversInfo.carModel);
        }
        const CarDriverResponse = {
            driverName: CarDriversInfo.driverName,
            driverSurname: CarDriversInfo.driverSurname,
            cityOfService: CarDriversInfo.cityOfService,
            carType: (_a = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.carType) !== null && _a !== void 0 ? _a : null,
            targa: (_b = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.targa) !== null && _b !== void 0 ? _b : "",
            module: (_c = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.module) !== null && _c !== void 0 ? _c : "",
            licenseNumber: (_d = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.licenseNumber) !== null && _d !== void 0 ? _d : "",
        };
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, CarDriverResponse, "All Car Driver Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting all car driver data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting all car driver data.");
    }
});
exports.IndividualCarDriver = IndividualCarDriver;
const IndividualAppCarDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const CarDriverId = req.user._id;
        const CarDriversInfo = yield CarDriver_1.CarDriversModel.findOne({ _id: CarDriverId });
        if (!CarDriversInfo) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Car Driver Not Found Please chack the detail");
        }
        let CarModelInfo;
        if (CarDriversInfo.carModel) {
            CarModelInfo = yield CarModel_1.CarModels.findById(CarDriversInfo.carModel);
        }
        let cityName = "";
        if (CarDriversInfo.cityOfService) {
            const cityDoc = yield CityModel_1.CityModel.findById(CarDriversInfo.cityOfService);
            cityName = (cityDoc === null || cityDoc === void 0 ? void 0 : cityDoc.cityName) || "";
        }
        const CarDriverResponse = {
            _id: CarDriverId,
            email: CarDriversInfo.driverEmail,
            carModel: CarDriversInfo.carModel,
            driverName: CarDriversInfo.driverName,
            driverSurname: CarDriversInfo.driverSurname,
            cityOfService: cityName,
            carType: (_a = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.carType) !== null && _a !== void 0 ? _a : null,
            targa: (_b = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.targa) !== null && _b !== void 0 ? _b : "",
            module: (_c = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.module) !== null && _c !== void 0 ? _c : "",
            licenseNumber: (_d = CarModelInfo === null || CarModelInfo === void 0 ? void 0 : CarModelInfo.licenseNumber) !== null && _d !== void 0 ? _d : "",
        };
        // Send response with fetched data
        return (0, responseFun_1.sendSuccessResponse)(res, CarDriverResponse, "All Car Driver Info retrieved successfully.");
    }
    catch (error) {
        console.error("Error while getting all car driver data:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Error while getting all car driver data.");
    }
});
exports.IndividualAppCarDriver = IndividualAppCarDriver;
