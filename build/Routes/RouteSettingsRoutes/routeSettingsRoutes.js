"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const saveRouteSettings_1 = __importDefault(require("../../controller/RouteSettingsController/saveRouteSettings"));
const getRouteSettings_1 = __importDefault(require("../../controller/RouteSettingsController/getRouteSettings"));
const RouteSettingsRoutes = (0, express_1.default)();
RouteSettingsRoutes.post("/save", passport_1.default.authenticate("jwt", { session: false }), saveRouteSettings_1.default);
RouteSettingsRoutes.get("/", passport_1.default.authenticate("jwt", { session: false }), getRouteSettings_1.default);
exports.default = RouteSettingsRoutes;
