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
const CompanyModel_1 = require("../../models/CompanyModel/CompanyModel");
const tokenModel_1 = require("../../models/tokenModel/tokenModel");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const responseFun_1 = require("../../utils/responseFun");
const forgotPasswordEmail_1 = __importDefault(require("../../middleware/email/forgotPasswordEmail"));
dotenv_1.default.config();
const ForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if the user with the provided email exists
        const user = yield CompanyModel_1.CompanyModel.findOne({ email });
        if (!user) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "User not found please enter valid email.");
        }
        // Remove any existing token for the user
        let token = yield tokenModel_1.Token.findOne({ userId: user._id });
        if (token) {
            yield token.deleteOne();
        }
        // Generate a new reset token and hash it
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hash = yield bcrypt_1.default.hash(resetToken, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
        // Save the new token with a timestamp for expiration management
        yield new tokenModel_1.Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();
        // Create a reset link and send it in the response (in production, you would email this link)
        const resetLink = `${process.env.FRONTEND_BASEURL}/reset-password/${user._id}/${resetToken}`;
        yield (0, forgotPasswordEmail_1.default)(user, resetLink, res);
        return (0, responseFun_1.sendSuccessWithoutResponse)(res, "Reset Password Mail Sent to Your Email");
    }
    catch (error) {
        console.error("Error during password reset:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "An error occurred while processing the password reset request.");
    }
});
exports.default = ForgotPassword;
