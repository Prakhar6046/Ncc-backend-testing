"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const createModel_1 = __importDefault(require("../../controller/CarModelController/createModel"));
const updatemodel_1 = __importDefault(require("../../controller/CarModelController/updatemodel"));
const getAllModels_1 = __importDefault(require("../../controller/CarModelController/getAllModels"));
const deleteModel_1 = __importDefault(require("../../controller/CarModelController/deleteModel"));
const CarModelroutes = (0, express_1.default)();
CarModelroutes.post("/new-carModel", passport_1.default.authenticate("jwt", { session: false }), createModel_1.default);
CarModelroutes.post("/update-carModel", passport_1.default.authenticate("jwt", { session: false }), updatemodel_1.default);
CarModelroutes.get("/all-carModel", passport_1.default.authenticate("jwt", { session: false }), getAllModels_1.default);
CarModelroutes.post("/delete-carModel", passport_1.default.authenticate("jwt", { session: false }), deleteModel_1.default);
exports.default = CarModelroutes;
