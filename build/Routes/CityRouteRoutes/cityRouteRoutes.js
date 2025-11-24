"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const addCityRoute_1 = __importDefault(require("../../controller/CityRouteController/addCityRoute"));
const editCityRoute_1 = __importDefault(require("../../controller/CityRouteController/editCityRoute"));
const allCityRoute_1 = __importDefault(require("../../controller/CityRouteController/allCityRoute"));
const deleteCityRoute_1 = __importDefault(require("../../controller/CityRouteController/deleteCityRoute"));
const CityRouteroutes = (0, express_1.default)();
CityRouteroutes.post("/new-city-route", passport_1.default.authenticate("jwt", { session: false }), addCityRoute_1.default);
CityRouteroutes.post("/update-city-route", passport_1.default.authenticate("jwt", { session: false }), editCityRoute_1.default);
CityRouteroutes.get("/all-city-route", passport_1.default.authenticate("jwt", { session: false }), allCityRoute_1.default);
CityRouteroutes.post("/delete-city-route", passport_1.default.authenticate("jwt", { session: false }), deleteCityRoute_1.default);
exports.default = CityRouteroutes;
