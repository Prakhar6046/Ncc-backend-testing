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
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./Routes/routes"));
const node_cron_1 = __importDefault(require("node-cron"));
const mongoDb_1 = __importDefault(require("./Database/mongoDb"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const CompanyModel_1 = require("./models/CompanyModel/CompanyModel");
const Admin_1 = require("./models/AdminModel/Admin");
const refreshBusinessData_1 = require("./middleware/BusinessFunction/refreshBusinessData");
const CarDriver_1 = require("./models/CarDriverModel/CarDriver");
const cors = require("cors");
// instantize an app from express() function
const app = (0, express_1.default)();
//Add Cors Policies
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://ncc-sobm.vercel.app",
        "https://web.nethgo.com"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
express_1.default.json({ limit: "50mb" });
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Ensure JWT_SECRET is defined in your environment variables
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield CompanyModel_1.CompanyModel.findOne({ _id: jwt_payload.identifier });
        let AdminUser = yield Admin_1.AdminModel.findOne({ _id: jwt_payload.identifier });
        let DriverUser = yield CarDriver_1.CarDriversModel.findOne({ _id: jwt_payload.identifier });
        if (user || AdminUser || DriverUser) {
            return done(null, user ? user : AdminUser ? AdminUser : DriverUser);
        }
        else {
            return done(null, false);
            // or you could create a new account
        }
    }
    catch (error) {
        return done(error, false);
    }
})));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
//MongoDb setup
(0, mongoDb_1.default)();
node_cron_1.default.schedule("0 0 * * *", () => {
    console.log("Running daily business data refresh...");
    (0, refreshBusinessData_1.refreshBusinessDataDaily)();
});
node_cron_1.default.schedule("0 0 * * 0", () => {
    console.log("Running weekly business data refresh...");
    (0, refreshBusinessData_1.refreshBusinessDataWeekly)();
});
//setup the Port
//All Rout use
app.use(routes_1.default);
const PORT = 5000;
// Schedule the task to run daily at midnight
app.listen(PORT, () => {
    console.log("server has started on port");
    console.log("http://localhost:" + PORT);
});
