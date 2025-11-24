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
const CarDriverLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverEmail, driverPassword } = req.body;
        const carDriver = (yield CarDriver_1.CarDriversModel.findOne({
            driverEmail,
        }));
        if (!carDriver) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Invalid email. No account found.");
        }
        // Verify the password
        const isPasswordValid = yield bcrypt_1.default.compare(driverPassword, carDriver.driverPassword);
        if (!isPasswordValid) {
            return (0, responseFun_1.sendErrorResponse)(res, 403, "Invalid password.");
        }
        // Generate JWT token
        const token = yield (0, responseFun_1.getToken)(carDriver.driverEmail, carDriver);
        yield CarDriver_1.CarDriversModel.updateOne({ _id: carDriver._id }, {
            $set: {
                isActive: true,
            },
        });
        // Construct response data without the password
        const CarDriverResponse = {
            _id: carDriver._id,
            email: carDriver.driverEmail,
            fmcToken: carDriver.fmcToken,
            token,
        };
        return (0, responseFun_1.sendSuccessResponse)(res, CarDriverResponse, "Login successful.");
    }
    catch (error) {
        (0, responseFun_1.sendErrorResponse)(res, 500, "Error During Login Car Driver");
    }
});
exports.default = CarDriverLogin;
