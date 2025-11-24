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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const tokenModel_1 = require("../../models/tokenModel/tokenModel");
const responseFun_1 = require("../../utils/responseFun");
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, token, password } = req.body;
        // Find the password reset token for the specified user
        const passwordResetToken = yield tokenModel_1.Token.findOne({ userId });
        if (!passwordResetToken) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Invalid or expired password reset token.");
        }
        // Validate the provided token with the stored hashed token
        const isValid = yield bcrypt_1.default.compare(token, passwordResetToken.token);
        if (!isValid) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Invalid or expired password reset token.");
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Update the user's password in the CompanyModel
        yield CompanyModel_1.CompanyModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
        // Delete the password reset token after successful password reset
        yield passwordResetToken.deleteOne();
        (0, responseFun_1.sendSuccessWithoutResponse)(res, "Password reset successfully.");
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while resetting the password.");
    }
});
exports.default = resetPassword;
