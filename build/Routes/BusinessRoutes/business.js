"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allBusinessInfo_1 = __importDefault(require("../../controller/BusinessController/allBusinessInfo"));
const passport_1 = __importDefault(require("passport"));
const weeklyDriverCost_1 = __importDefault(require("../../controller/BusinessController/weeklyDriverCost"));
const Businessroutes = (0, express_1.default)();
Businessroutes.get("/business-info", passport_1.default.authenticate("jwt", { session: false }), allBusinessInfo_1.default);
Businessroutes.get("/weekly-info", passport_1.default.authenticate("jwt", { session: false }), weeklyDriverCost_1.default);
exports.default = Businessroutes;
