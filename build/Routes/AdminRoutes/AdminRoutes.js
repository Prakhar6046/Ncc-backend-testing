"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerAdmin_1 = __importStar(require("../../controller/AdminController/registerAdmin"));
const allOrderBooking_1 = __importDefault(require("../../controller/AdminController/allOrderBooking"));
const passport_1 = __importDefault(require("passport"));
const allAdmins_1 = __importDefault(require("../../controller/AdminController/allAdmins"));
const editAdmin_1 = __importDefault(require("../../controller/AdminController/editAdmin"));
const removeAdmin_1 = __importDefault(require("../../controller/AdminController/removeAdmin"));
const createCapoflotta_1 = __importDefault(require("../../controller/AdminController/createCapoflotta"));
const createDittaIndividuale_1 = __importDefault(require("../../controller/AdminController/createDittaIndividuale"));
const getCapoflotta_1 = __importDefault(require("../../controller/AdminController/getCapoflotta"));
const getDittaIndividuale_1 = __importDefault(require("../../controller/AdminController/getDittaIndividuale"));
const updateCapoflotta_1 = __importDefault(require("../../controller/AdminController/updateCapoflotta"));
const updateDittaIndividuale_1 = __importDefault(require("../../controller/AdminController/updateDittaIndividuale"));
const Adminroutes = (0, express_1.default)();
Adminroutes.post("/register-admin", passport_1.default.authenticate("jwt", { session: false }), registerAdmin_1.default);
Adminroutes.post("/register-superadmin", registerAdmin_1.createSuperAdmin);
Adminroutes.post("/create-capoflotta", passport_1.default.authenticate("jwt", { session: false }), createCapoflotta_1.default);
Adminroutes.post("/update-capoflotta", passport_1.default.authenticate("jwt", { session: false }), updateCapoflotta_1.default);
Adminroutes.post("/create-ditta-individuale", passport_1.default.authenticate("jwt", { session: false }), createDittaIndividuale_1.default);
Adminroutes.post("/update-ditta-individuale", passport_1.default.authenticate("jwt", { session: false }), updateDittaIndividuale_1.default);
Adminroutes.get("/all-capoflotta", passport_1.default.authenticate("jwt", { session: false }), getCapoflotta_1.default);
Adminroutes.get("/all-ditta-individuale", passport_1.default.authenticate("jwt", { session: false }), getDittaIndividuale_1.default);
Adminroutes.get("/all-order-bookings", passport_1.default.authenticate("jwt", { session: false }), allOrderBooking_1.default);
Adminroutes.post("/update-admin", passport_1.default.authenticate("jwt", { session: false }), editAdmin_1.default);
Adminroutes.post("/delete-admin", passport_1.default.authenticate("jwt", { session: false }), removeAdmin_1.default);
Adminroutes.get("/all-admin", passport_1.default.authenticate("jwt", { session: false }), allAdmins_1.default);
exports.default = Adminroutes;
