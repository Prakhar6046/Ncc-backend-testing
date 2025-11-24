"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const allCity_1 = __importDefault(require("../../controller/AdminController/CityController/allCity"));
const addcity_1 = __importDefault(require("../../controller/AdminController/CityController/addcity"));
const edityCity_1 = __importDefault(require("../../controller/AdminController/CityController/edityCity"));
const deleteCity_1 = __importDefault(require("../../controller/AdminController/CityController/deleteCity"));
const CitiesWithAdmins_1 = __importDefault(require("../../controller/AdminController/CityController/CitiesWithAdmins"));
const Cityroutes = (0, express_1.default)();
Cityroutes.get("/all-city", allCity_1.default);
Cityroutes.get("/all-city-with-admins", CitiesWithAdmins_1.default);
Cityroutes.post("/add-city", passport_1.default.authenticate("jwt", { session: false }), addcity_1.default);
Cityroutes.post("/edit-city", passport_1.default.authenticate("jwt", { session: false }), edityCity_1.default);
Cityroutes.post("/delete-city", passport_1.default.authenticate("jwt", { session: false }), deleteCity_1.default);
exports.default = Cityroutes;
