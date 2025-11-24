"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const createCategory_1 = __importDefault(require("../../controller/CategoryController/createCategory"));
const getCategories_1 = __importDefault(require("../../controller/CategoryController/getCategories"));
const deleteCategory_1 = require("../../controller/CategoryController/deleteCategory");
const updateCategory_1 = __importDefault(require("../../controller/CategoryController/updateCategory"));
const Categoryroutes = (0, express_1.default)();
Categoryroutes.post("/create-category", passport_1.default.authenticate("jwt", { session: false }), createCategory_1.default);
Categoryroutes.get("/all-categories", passport_1.default.authenticate("jwt", { session: false }), getCategories_1.default);
Categoryroutes.delete("/delete-category", passport_1.default.authenticate("jwt", { session: false }), deleteCategory_1.deleteCategory);
Categoryroutes.post("/update-category", passport_1.default.authenticate("jwt", { session: false }), updateCategory_1.default);
exports.default = Categoryroutes;
